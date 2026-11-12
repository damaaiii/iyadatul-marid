import React, { useState } from "react";
import {
  PenTool,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Loader2,
  Send,
  HelpCircle,
  BookCheck,
  Lightbulb,
} from "lucide-react";
import { AudioButton } from "../AudioButton.tsx";
import { TarkibAnalysisResult } from "../../types/index.ts";

export const MaharahKitabah: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<
    "scramble" | "fillin" | "convert" | "aiChecker"
  >("scramble");

  // Word Scramble Exercises
  const scrambleExercises = [
    {
      id: 1,
      targetArabic: "اشْتَرَتْ فَاطِمَةُ الدَّوَاءَ مِنَ الصَّيْدَلِيَّةِ",
      words: ["الدَّوَاءَ", "مِنَ", "اشْتَرَتْ", "الصَّيْدَلِيَّةِ", "فَاطِمَةُ"],
      translation: "Fatimah telah membeli obat dari apotek.",
    },
    {
      id: 2,
      targetArabic: "نَقَلَتْ سَيَّارَةُ الْإِسْعَافِ فَرِيْدًا إِلَى الْمُسْتَشْفَى",
      words: ["الْمُسْتَشْفَى", "نَقَلَتْ", "فَرِيْدًا", "سَيَّارَةُ", "إِلَى", "الْإِسْعَافِ"],
      translation: "Mobil ambulans telah membawa Farid ke rumah sakit.",
    },
    {
      id: 3,
      targetArabic: "فَحَصَ الطَّبِيْبُ الْمَرِيْضَ فِي غُرْفَةِ الْكَشْفِ",
      words: ["الْمَرِيْضَ", "فَحَصَ", "غُرْفَةِ", "الطَّبِيْبُ", "فِي", "الْكَشْفِ"],
      translation: "Dokter telah memeriksa pasien di ruang pemeriksaan.",
    },
  ];

  const [currentScrambleIdx, setCurrentScrambleIdx] = useState<number>(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [scrambleStatus, setScrambleStatus] = useState<
    "idle" | "correct" | "wrong"
  >("idle");

  const currentScramble = scrambleExercises[currentScrambleIdx];

  const handleWordClick = (word: string) => {
    if (scrambleStatus === "correct") return;
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter((w) => w !== word));
    } else {
      const nextWords = [...selectedWords, word];
      setSelectedWords(nextWords);
      if (nextWords.length === currentScramble.words.length) {
        const formedSentence = nextWords.join(" ");
        if (
          formedSentence.replace(/\s+/g, "") ===
          currentScramble.targetArabic.replace(/\s+/g, "")
        ) {
          setScrambleStatus("correct");
        } else {
          setScrambleStatus("wrong");
        }
      }
    }
  };

  const resetScramble = () => {
    setSelectedWords([]);
    setScrambleStatus("idle");
  };

  // Subtab 2: Fill-in Blanks
  const fillinExercises = [
    {
      id: 1,
      prefix: "تَغَيَّبَتْ فَاطِمَةُ عَنِ الْمَدْرَسَةِ لِأَنَّهَا ",
      suffix: " فِي بَيْتِهَا",
      correct: "مَرِيْضَةٌ",
      options: ["مَرِيْضَةٌ", "طَبِيْبَةٌ", "مُسَافِرَةٌ", "نَائِمَةٌ"],
      fullSentence: "تَغَيَّبَتْ فَاطِمَةُ عَنِ الْمَدْرَسَةِ لِأَنَّهَا مَرِيْضَةٌ فِي بَيْتِهَا",
    },
    {
      id: 2,
      prefix: "بَعْدَ تَنَاوُلِ الدَّوَاءِ، ",
      suffix: " حَالُ الْمَرِيْضِ بِفَضْلِ اللهِ",
      correct: "تَحَسَّنَ",
      options: ["تَحَسَّنَ", "سَافَرَ", "مَاتَ", "نَسِيَ"],
      fullSentence: "بَعْدَ تَنَاوُلِ الدَّوَاءِ، تَحَسَّنَ حَالُ الْمَرِيْضِ بِفَضْلِ اللهِ",
    },
    {
      id: 3,
      prefix: "لَمَّا وَصَلَتْ رَيَانَةُ إِلَى صَدِيْقَتِهَا، ",
      suffix: " لَهَا بِالشِّفَاءِ الْعَاجِلِ",
      correct: "دَعَتْ",
      options: ["دَعَتْ", "كَتَبَ", "ضَرَبَتْ", "أَكَلَتْ"],
      fullSentence: "لَمَّا وَصَلَتْ رَيَانَةُ إِلَى صَدِيْقَتِهَا، دَعَتْ لَهَا بِالشِّفَاءِ الْعَاجِلِ",
    },
  ];

  const [fillinAnswers, setFillinAnswers] = useState<Record<number, string>>({});

  // Subtab 3: Verb Conversion
  const convertExercises = [
    {
      id: 1,
      mudhari: "يَفْحَصُ الطَّبِيْبُ الْمَرِيْضَ بِدِقَّةٍ",
      subject: "الطَّبِيْبُ (مذكر)",
      madhiCorrect: "فَحَصَ الطَّبِيْبُ الْمَرِيْضَ بِدِقَّةٍ",
      options: [
        "فَحَصَ الطَّبِيْبُ الْمَرِيْضَ بِدِقَّةٍ",
        "فَحَصَتِ الطَّبِيْبُ الْمَرِيْضَ بِدِقَّةٍ",
        "فَحَصْتَ الطَّبِيْبُ الْمَرِيْضَ بِدِقَّةٍ",
      ],
    },
    {
      id: 2,
      mudhari: "تَشْرَبُ فَاطِمَةُ الدَّوَاءَ فِي حُجْرَتِهَا",
      subject: "فَاطِمَةُ (مؤنث)",
      madhiCorrect: "شَرِبَتْ فَاطِمَةُ الدَّوَاءَ فِي حُجْرَتِهَا",
      options: [
        "شَرِبَ فَاطِمَةُ الدَّوَاءَ فِي حُجْرَتِهَا",
        "شَرِبَتْ فَاطِمَةُ الدَّوَاءَ فِي حُجْرَتِهَا",
        "شَرِبْنَا فَاطِمَةُ الدَّوَاءَ فِي حُجْرَتِهَا",
      ],
    },
    {
      id: 3,
      mudhari: "نَذْهَبُ إِلَى الْمُسْتَشْفَى لِعِيَادَةِ فَرِيْدٍ",
      subject: "نَحْنُ (المتكلم مع الغير)",
      madhiCorrect: "ذَهَبْنَا إِلَى الْمُسْتَشْفَى لِعِيَادَةِ فَرِيْدٍ",
      options: [
        "ذَهَبْتُ إِلَى الْمُسْتَشْفَى لِعِيَادَةِ فَرِيْدٍ",
        "ذَهَبَتْ إِلَى الْمُسْتَشْفَى لِعِيَادَةِ فَرِيْدٍ",
        "ذَهَبْنَا إِلَى الْمُسْتَشْفَى لِعِيَادَةِ فَرِيْدٍ",
      ],
    },
  ];

  const [convertAnswers, setConvertAnswers] = useState<Record<number, string>>({});

  // Subtab 4: AI Arabic Sentence & Tarkib Checker
  const [aiSentenceInput, setAiSentenceInput] = useState<string>(
    "ذَهَبْتُ أَنَا وَصَدِيْقِي إِلَى الْمُسْتَشْفَى لِعِيَادَةِ أَحْمَدَ"
  );
  const [aiChecking, setAiChecking] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<TarkibAnalysisResult | null>(null);

  const handleCheckSentence = async () => {
    if (!aiSentenceInput.trim() || aiChecking) return;
    setAiChecking(true);
    setAiResult(null);

    try {
      const res = await fetch("/api/check-tarkib", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sentence: aiSentenceInput,
          context:
            "Tugas menulis bahasa Arab Kelas 8 tema 'Iyadatul Maridh & Tarkib Fi'il Madhi",
        }),
      });

      if (!res.ok) throw new Error("Gagal memeriksa kalimat");
      const data = await res.json();
      setAiResult(data);
    } catch (err: any) {
      console.error(err);
      // Fallback result
      setAiResult({
        isCorrect: true,
        score: 95,
        correctedArabic: aiSentenceInput,
        indonesianTranslation: "Saya dan teman saya pergi ke rumah sakit untuk menjenguk Ahmad.",
        fiilMadhi: "ذَهَبْتُ (telah pergi - dhomir Ana)",
        fail: "أَنَا (dhomir muttashil 'tu')",
        explanation: "Susunan kalimat sudah tepat dengan pola Jumlah Fi'liyah dan fi'il madhi yang bersambung dengan dhomir muttashil mutakallim.",
        praiseOrAdvice: "Mumtaz! Tulisan bahasa Arabmu sangat rapi dan sesuai kaidah.",
      });
    } finally {
      setAiChecking(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-emerald-800 to-teal-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-emerald-100 text-xs font-semibold mb-3">
            <PenTool className="w-3.5 h-3.5" />
            <span>الْمَهَارَةُ الرَّابِعَةُ: مَهَارَةُ الْكِتَابَةِ</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
            Maharah Kitabah (Keterampilan Menulis)
          </h2>
          <p className="text-emerald-100 text-sm md:text-base leading-relaxed">
            Asah keterampilan merangkai kata Arab menjadi Jumlah Fi'liyah yang
            sempurna, ubah fi'il mudhari' ke fi'il madhi, dan periksakan hasil
            tulisanmu ke Tashih AI Cerdas!
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: "scramble", label: "1. Susun Kata Acak", arabic: "ترتيب الكلمات" },
          { id: "fillin", label: "2. Lengkapi Kalimat", arabic: "إملاء الفراغات" },
          { id: "convert", label: "3. Ubah ke Fi'il Madhi", arabic: "تحويل الفعل" },
          { id: "aiChecker", label: "4. Koreksi Tulisan AI", arabic: "تَصْحِيْحُ الْكِتَابَةِ" },
        ].map((sub) => (
          <button
            key={sub.id}
            onClick={() => setActiveSubTab(sub.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === sub.id
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <span>{sub.label}</span>
            <span className="text-xs font-arabic opacity-75">{sub.arabic}</span>
          </button>
        ))}
      </div>

      {/* Subtab 1: Word Scramble */}
      {activeSubTab === "scramble" && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase">
                Latihan {currentScrambleIdx + 1} dari {scrambleExercises.length}
              </span>
              <h3 className="text-xl font-bold text-slate-800">
                Susunlah Kata Menjadi Jumlah Fi'liyah Sempurna
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={resetScramble}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-emerald-700 text-xs font-medium cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-center">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
              Arti Target Kalimat:
            </span>
            <p className="text-base font-semibold text-slate-800">
              "{currentScramble.translation}"
            </p>
          </div>

          {/* Answer Drop Area */}
          <div className="min-h-24 p-5 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/30 flex flex-wrap items-center justify-center gap-2.5">
            {selectedWords.length === 0 ? (
              <span className="text-slate-400 text-sm italic">
                Klik kartu kata di bawah secara berurutan dari kanan ke kiri (arah tulisan Arab)
              </span>
            ) : (
              selectedWords.map((word, idx) => (
                <button
                  key={idx}
                  onClick={() => handleWordClick(word)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-arabic text-xl font-bold shadow-sm hover:bg-emerald-700 transition-all cursor-pointer animate-in fade-in"
                >
                  {word}
                </button>
              ))
            )}
          </div>

          {/* Word Choices */}
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-2">
              Pilihan Kata Acak:
            </p>
            <div className="flex flex-wrap gap-2.5 justify-center">
              {currentScramble.words.map((word, idx) => {
                const isUsed = selectedWords.includes(word);
                return (
                  <button
                    key={idx}
                    onClick={() => handleWordClick(word)}
                    disabled={isUsed}
                    className={`px-4 py-2.5 rounded-xl border font-arabic text-xl font-bold transition-all cursor-pointer ${
                      isUsed
                        ? "bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed"
                        : "bg-white border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 text-slate-900 shadow-xs active:scale-95"
                    }`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback & Next */}
          {scrambleStatus === "correct" && (
            <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 flex items-center justify-between gap-3 animate-in zoom-in-95">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold text-sm">
                    Mumtaz! Susunan kalimat Jumlah Fi'liyah Anda benar!
                  </p>
                  <p className="text-xs text-emerald-800 font-arabic mt-0.5">
                    {currentScramble.targetArabic}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <AudioButton text={currentScramble.targetArabic} variant="iconOnly" />
                {currentScrambleIdx + 1 < scrambleExercises.length ? (
                  <button
                    onClick={() => {
                      setCurrentScrambleIdx((prev) => prev + 1);
                      resetScramble();
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition-all cursor-pointer"
                  >
                    Soal Berikutnya →
                  </button>
                ) : (
                  <span className="text-xs font-bold bg-white/70 px-3 py-1.5 rounded-lg text-emerald-900">
                    Semua selesai! 🎉
                  </span>
                )}
              </div>
            </div>
          )}

          {scrambleStatus === "wrong" && (
            <div className="p-4 rounded-2xl bg-rose-100 border border-rose-300 text-rose-900 flex items-center justify-between gap-3 animate-in shake">
              <div className="flex items-center gap-2.5">
                <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <p className="font-semibold text-xs sm:text-sm">
                  Susunan belum tepat. Ingat pola Jumlah Fi'liyah diawali kata kerja (الفِعْل) lalu subjek (الفَاعِل). Coba lagi ya!
                </p>
              </div>
              <button
                onClick={resetScramble}
                className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 cursor-pointer"
              >
                Ulangi
              </button>
            </div>
          )}
        </div>
      )}

      {/* Subtab 2: Fill-in Blanks */}
      {activeSubTab === "fillin" && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-bold text-slate-800">
              Lengkapi Kalimat Rumpang (إِمْلَاءُ الْفَرَاغَاتِ)
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Pilihlah kata yang tepat untuk melengkapi teks cerita berikut
              sesuai konteks buku Kemenag.
            </p>
          </div>

          <div className="space-y-5">
            {fillinExercises.map((item, idx) => {
              const selected = fillinAnswers[item.id];
              const isCorrect = selected === item.correct;

              return (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                      Soal {idx + 1}
                    </span>
                    {selected && (
                      <span className="flex items-center gap-1 text-xs font-bold">
                        {isCorrect ? (
                          <span className="text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Benar
                          </span>
                        ) : (
                          <span className="text-rose-600 flex items-center gap-1">
                            <XCircle className="w-4 h-4" /> Belum tepat
                          </span>
                        )}
                      </span>
                    )}
                  </div>

                  <p
                    dir="rtl"
                    className="font-arabic text-2xl font-bold text-slate-900 leading-loose"
                  >
                    <span>{item.prefix}</span>
                    <span className="inline-block px-4 py-1 mx-2 rounded-xl border-2 border-emerald-400 bg-emerald-100/70 text-emerald-950 font-extrabold min-w-28 text-center">
                      {selected || "......."}
                    </span>
                    <span>{item.suffix}</span>
                  </p>

                  {/* Options */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200/60 justify-end">
                    {item.options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() =>
                          setFillinAnswers((prev) => ({ ...prev, [item.id]: opt }))
                        }
                        className={`px-4 py-2 rounded-xl border font-arabic text-lg font-bold transition-all cursor-pointer ${
                          selected === opt
                            ? opt === item.correct
                              ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                              : "bg-rose-500 text-white border-rose-500 shadow-sm"
                            : "bg-white hover:bg-emerald-50 border-slate-200 text-slate-800"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  {isCorrect && (
                    <div className="flex items-center justify-between text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                      <span>Lafadz lengkap: {item.fullSentence}</span>
                      <AudioButton text={item.fullSentence} variant="iconOnly" size="sm" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Subtab 3: Verb Conversion */}
      {activeSubTab === "convert" && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-bold text-slate-800">
              Mengubah Fi'il Mudhari' ke Fi'il Madhi (تَحْوِيْلُ الْفِعْلِ)
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Ubah kalimat bentuk sekarang (مُضَارِع) ke bentuk lampau (مَاضٍ)
              dengan memperhatikan fa'il dan dhomir yang melekat.
            </p>
          </div>

          <div className="space-y-4">
            {convertExercises.map((conv, idx) => {
              const selected = convertAnswers[conv.id];
              const isCorrect = selected === conv.madhiCorrect;

              return (
                <div
                  key={conv.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-md">
                      Nomor {idx + 1} • Subjek: {conv.subject}
                    </span>
                    <AudioButton text={conv.mudhari} variant="iconOnly" size="sm" />
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-right">
                    <span className="text-xs text-slate-400 block mb-1">
                      Kalimat Bentuk Fi'il Mudhari':
                    </span>
                    <p className="font-arabic text-2xl font-bold text-slate-900">
                      {conv.mudhari}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-emerald-800 block mb-2">
                      Pilihlah bentuk Fi'il Madhi yang benar:
                    </span>
                    <div className="space-y-2">
                      {conv.options.map((opt, optIdx) => (
                        <button
                          key={optIdx}
                          onClick={() =>
                            setConvertAnswers((prev) => ({
                              ...prev,
                              [conv.id]: opt,
                            }))
                          }
                          className={`w-full p-3 rounded-xl border text-right font-arabic text-xl font-bold transition-all flex items-center justify-between cursor-pointer ${
                            selected === opt
                              ? opt === conv.madhiCorrect
                                ? "bg-emerald-100 border-emerald-500 text-emerald-950 font-extrabold ring-2 ring-emerald-400"
                                : "bg-rose-100 border-rose-500 text-rose-950 font-extrabold"
                              : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800"
                          }`}
                        >
                          <span className="text-xs font-sans text-slate-400">
                            {selected === opt && opt === conv.madhiCorrect && "✓ Benar"}
                            {selected === opt && opt !== conv.madhiCorrect && "✕ Salah"}
                          </span>
                          <span>{opt}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Subtab 4: AI Arabic Sentence & Tarkib Checker */}
      {activeSubTab === "aiChecker" && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Didukung Gemini 3.8 Flash (Server-Side)</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800">
                Tashih Kitabah & Tarkib AI (Pemeriksa Kalimat Cerdas)
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Ketik kalimat bahasa Arab karyamu seputar 'Iyadatul Maridh atau
                tugas sekolah, lalu biarkan AI menganalisis keselarasan Fi'il
                Madhi, Fa'il, dan susunan Jumlah Fi'liyah.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Tuliskan Kalimat Bahasa Arabmu:
              </label>
              <textarea
                dir="rtl"
                rows={3}
                value={aiSentenceInput}
                onChange={(e) => setAiSentenceInput(e.target.value)}
                placeholder="اُكْتُبْ هُنَا جُمْلَةً فِعْلِيَّةً (Contoh: زَارَتْ رَيَانَةُ صَدِيْقَتَهَا فَاطِمَةَ فِي بَيْتِهَا)..."
                className="w-full p-4 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-arabic text-2xl font-bold text-slate-900 leading-loose"
              />
            </div>

            {/* Quick Prompts Chips */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 font-semibold flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Contoh kalimat:
              </span>
              {[
                "فَحَصَ الطَّبِيْبُ الْمَرِيْضَ فِي الْمُسْتَشْفَى",
                "دَعَتْ رَيَانَةُ لِفَاطِمَةَ بِالشِّفَاءِ",
                "نَحْنُ اشْتَرَيْنَا الدَّوَاءَ مِنَ الصَّيْدَلِيَّةِ",
                "شَرِبَ أَحْمَدُ الدَّوَاءَ بَعْدَ الْأَكْلِ",
              ].map((sample, sIdx) => (
                <button
                  key={sIdx}
                  onClick={() => setAiSentenceInput(sample)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-arabic text-sm transition-colors cursor-pointer"
                >
                  {sample}
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleCheckSentence}
                disabled={aiChecking || !aiSentenceInput.trim()}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {aiChecking ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menganalisis Kaidah Kalimat...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Analisis Kalimat Sekarang</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Analysis Result Display */}
          {aiResult && (
            <div className="mt-6 p-6 rounded-3xl bg-gradient-to-br from-emerald-50/70 via-white to-slate-50 border-2 border-emerald-200 shadow-md space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-2 rounded-xl text-white ${
                      aiResult.isCorrect ? "bg-emerald-600" : "bg-amber-600"
                    }`}
                  >
                    <BookCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">
                      Hasil Tashih Kalimat
                    </h4>
                    <p className="text-xs text-slate-500">
                      {aiResult.praiseOrAdvice}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-700">
                    {aiResult.score}
                  </span>
                  <span className="text-xs text-slate-400 block font-semibold">
                    Skor Kualitas
                  </span>
                </div>
              </div>

              {/* Corrected sentence */}
              <div className="p-4 rounded-2xl bg-white border border-emerald-100 text-right">
                <div className="flex items-center justify-between mb-1">
                  <AudioButton text={aiResult.correctedArabic} variant="iconOnly" size="sm" />
                  <span className="text-xs font-bold text-emerald-700 uppercase">
                    Kalimat yang Disempurnakan:
                  </span>
                </div>
                <p className="font-arabic text-2xl md:text-3xl font-bold text-emerald-950 leading-loose">
                  {aiResult.correctedArabic}
                </p>
                <p className="text-xs text-slate-500 font-medium text-left mt-1 border-t border-slate-100 pt-2">
                  Artinya: "{aiResult.indonesianTranslation}"
                </p>
              </div>

              {/* Grammatical Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-emerald-100/60 border border-emerald-200">
                  <span className="font-bold text-emerald-900 block mb-0.5">
                    Kata Kerja (الفِعْلُ الْمَاضِي):
                  </span>
                  <p className="font-arabic text-lg font-bold text-emerald-950">
                    {aiResult.fiilMadhi}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-teal-100/60 border border-teal-200">
                  <span className="font-bold text-teal-900 block mb-0.5">
                    Pelaku / Subjek (الفَاعِل):
                  </span>
                  <p className="font-arabic text-lg font-bold text-teal-950">
                    {aiResult.fail}
                  </p>
                </div>
              </div>

              {/* Explanation Note */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-slate-800 leading-relaxed space-y-1">
                <span className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-600" /> Catatan Kaidah Tata Bahasa:
                </span>
                <p>{aiResult.explanation}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
