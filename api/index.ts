import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

// Initialize Google GenAI SDK (Server-Side)
const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    app: "Iyadatul Maridh - Bahasa Arab MTs Kelas 8",
    hasApiKey: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

// AI Arabic Teacher (Tanya Ustadz / Mu'allim AI)
app.post("/api/chat", async (req: Request, res: Response) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Pesan tidak boleh kosong." });
    }

    if (!apiKey) {
      return res.status(503).json({
        error: "GEMINI_API_KEY belum dikonfigurasi di server.",
        fallback:
          "Mohon pastikan API Key Gemini telah aktif di pengaturan aplikasi.",
      });
    }

    const systemInstruction = `Anda adalah "Ustadz Hilmi", seorang guru Bahasa Arab yang ramah, sabar, dan ahli untuk siswa jenjang MTs (Madrasah Tsanawiyah) Kelas 8.
Fokus materi saat ini adalah Bab 6: عِيَادَةُ الْمَرْضَى ('Iyadatul Maridh - Menjenguk Orang Sakit) dan Tarkib: الفِعْلُ الْمَاضِي وَالْجُمْلَةُ الْفِعْلِيَّةُ (Fi'il Madhi dan Jumlah Fi'liyah).
Tugas Anda:
1. Membantu siswa memahami kosa kata (mufradat) penyakit, rumah sakit, dokter, dan doa menjenguk orang sakit.
2. Menjelaskan kaidah Fi'il Madhi dan tasrif dhomir (هُوَ، هِيَ، أَنْتَ، أَنْتِ، أَنَا، نَحْنُ) dengan bahasa yang mudah dipahami anak remaja MTs.
3. Selalu sertakan harakat lengkap pada kata/kalimat bahasa Arab yang Anda tuliskan.
4. Berikan contoh kontekstual, terjemahan bahasa Indonesia, dan apresiasi positif (seperti "Mumtaz!", "Ahsantum!", "Bagus sekali pertanyaannya!").
5. Jika siswa menyapa atau bertanya di luar tema, jawablah dengan santun lalu kaitkan kembali ke pembelajaran bahasa Arab.`;

    const contents = [
      ...conversationHistory.map((item: { role: string; text: string }) => ({
        role: item.role === "user" ? "user" : "model",
        parts: [{ text: item.text }],
      })),
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    return res.json({
      reply: response.text || "Afwan, tidak ada jawaban dari model.",
    });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    return res.status(500).json({
      error: "Gagal memproses pesan AI",
      details: error.message || String(error),
    });
  }
});

// Pemeriksa Tarkib & Kalimat (Tashih Jumlah & Fi'il Madhi)
app.post("/api/check-tarkib", async (req: Request, res: Response) => {
  try {
    const { sentence, context } = req.body;

    if (!sentence || typeof sentence !== "string") {
      return res.status(400).json({ error: "Kalimat tidak boleh kosong." });
    }

    if (!apiKey) {
      return res.status(503).json({
        error: "GEMINI_API_KEY belum dikonfigurasi di server.",
      });
    }

    const prompt = `Analisis kalimat bahasa Arab siswa Kelas 8 MTs berikut:
Kalimat: "${sentence}"
Konteks Pembelajaran: Tema 'Iyadatul Maridh (عيادة المريض) dan Tarkib Fi'il Madhi + Jumlah Fi'liyah (فعل ماض + فاعل + مفعول به). ${
      context ? `Konteks spesifik: ${context}` : ""
    }

Berikan respons terstruktur dalam format JSON dengan kunci:
- "isCorrect": boolean (true jika kaidah fi'il madhi dan struktur kalimat benar, false jika ada kesalahan)
- "score": number (skor 0 - 100)
- "correctedArabic": string (kalimat Arab dengan harakat lengkap yang benar dan fasih)
- "indonesianTranslation": string (arti bahasa Indonesia yang tepat)
- "fiilMadhi": string (sebutkan fi'il madhi yang digunakan dan artinya)
- "fail": string (sebutkan subjek/fa'il dan jenisnya: mudzakkar/muannats/dhomir)
- "explanation": string (penjelasan tata bahasa yang ramah dan edukatif untuk anak MTs: apakah dhomir/ta' ta'nits sudah sesuai, i'rab rafa'/fathah, dll.)
- "praiseOrAdvice": string (kata penyemangat dalam bahasa Indonesia & Arab, misal: "Mumtaz! Penggunaan ta' ta'nits sudah tepat.")

Pastikan HANYA menghasilkan JSON valid tanpa markdown format blok jika memungkinkan, atau JSON murni.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    let parsedData;
    try {
      parsedData = JSON.parse(text);
    } catch {
      // Clean fallback if model returned backticks
      const cleanJson = text.replace(/```json\n?|\n?```/g, "").trim();
      parsedData = JSON.parse(cleanJson);
    }

    return res.json(parsedData);
  } catch (error: any) {
    console.error("Error in /api/check-tarkib:", error);
    return res.status(500).json({
      error: "Gagal menganalisis kalimat",
      details: error.message || String(error),
    });
  }
});

// Roleplay Interaktif Menjenguk Teman Sakit (Simulasi Percakapan)
app.post("/api/roleplay", async (req: Request, res: Response) => {
  try {
    const { character = "Fatimah", message, roleplayHistory = [] } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Pesan tidak boleh kosong." });
    }

    const systemInstruction = `Kamu sedang bermain peran (roleplay) sebagai ${character}, seorang siswi MTs Kelas 8 yang sedang terbaring sakit (demam dan pusing) di kamarnya/rumah sakit.
Lawan bicaramu adalah teman sekelasnya yang datang menjengukmu ('iyadatul maridh).
Karakteristikmu:
- Merasa lemah karena sakit, tapi sangat senang dan berterima kasih dijenguk temannya.
- Merespons ucapan doa (seperti: "آمِيْنَ، جَزَاكَ اللهُ خَيْرًا", "شُكْرًا لَكَ عَلَى الزِّيَارَةِ").
- Jelaskan sakitmu dengan kosa kata bab ini jika ditanya (صُدَاعٌ، حُمَّى، أَلَمٌ فِي الْمَعِدَةِ، تَنَاوَلْتُ الدَّوَاءَ، فَحَصَنِي الطَّبِيْبُ).
Format jawaban JSON dengan atribut:
- "arabic": Kalimat Arab dengan harakat lengkap.
- "transliteration": Cara baca latin bahasa Indonesia.
- "translation": Arti bahasa Indonesia.
- "expression": Ekspresi wajah/perasaan ("lemah tapi tersenyum", "terharu", "meringis kesakitan", "penuh syukur").
- "suggestedReplies": 2-3 contoh kalimat balasan Arab yang bisa diucapkan teman yang menjenguk selanjutnya.`;

    const prompt = `Dialog saat ini:
Riwayat sebelumnya: ${JSON.stringify(roleplayHistory)}
Ucapan teman yang menjenguk: "${message}"

Berikan responmu sebagai ${character} dalam JSON valid.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: systemInstruction,
      },
    });

    const text = response.text || "{}";
    const cleanJson = text.replace(/```json\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(cleanJson);
    return res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/roleplay:", error);
    return res.status(500).json({
      error: "Gagal menjalankan simulasi roleplay",
      details: error.message || String(error),
    });
  }
});

// Generate dynamic quiz questions via AI
app.post("/api/generate-quiz", async (req: Request, res: Response) => {
  try {
    const { topic = "fiil-madhi", count = 5 } = req.body;

    const prompt = `Buat ${count} butir soal pilihan ganda interaktif Bahasa Arab MTs Kelas 8 mengenai topik: "${topic}" dalam lingkup Bab 6 (عيادة المريض - Menjenguk Orang Sakit) dan Tarkib Fi'il Madhi + Jumlah Fi'liyah.
Format JSON berupa Array of Objects dengan properti:
- "id": number
- "questionArabic": string (pertanyaan dengan teks Arab berharakat jelas)
- "questionIndo": string (terjemahan atau instruksi dalam bahasa Indonesia)
- "options": array of 4 string (pilihan jawaban berharakat A, B, C, D)
- "correctAnswerIndex": number (0 untuk A, 1 untuk B, 2 untuk C, 3 untuk D)
- "explanation": string (penjelasan singkat mengapa jawaban itu benar sesuai kaidah fi'il madhi/tarkib)`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "[]";
    const cleanJson = text.replace(/```json\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(cleanJson);
    return res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/generate-quiz:", error);
    return res.status(500).json({
      error: "Gagal membuat kuis AI",
      details: error.message || String(error),
    });
  }
});

export default app;
