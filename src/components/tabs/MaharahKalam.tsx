import React, { useState } from "react";
import {
  MessageSquare,
  Sparkles,
  HeartHandshake,
  Send,
  Loader2,
  UserCheck,
  RotateCcw,
  Volume2,
  Lightbulb,
} from "lucide-react";
import { DIALOGUE_SCENES } from "../../data/arabicData.ts";
import { AudioButton } from "../AudioButton.tsx";
import { arabicAudio } from "../../utils/audio.ts";

interface RoleplayMessage {
  sender: "user" | "ai";
  arabic: string;
  transliteration?: string;
  translation?: string;
  expression?: string;
}

export const MaharahKalam: React.FC = () => {
  const [selectedSceneId, setSelectedSceneId] = useState<string>("scene-2");
  const currentScene =
    DIALOGUE_SCENES.find((s) => s.id === selectedSceneId) || DIALOGUE_SCENES[0];

  // Roleplay with AI states
  const [selectedCharacter, setSelectedCharacter] = useState<string>("Fatimah");
  const [roleplayInput, setRoleplayInput] = useState<string>("");
  const [roleplayLoading, setRoleplayLoading] = useState<boolean>(false);
  const [suggestedReplies, setSuggestedReplies] = useState<string[]>([
    "السَّلَامُ عَلَيْكُمْ يَا صَدِيْقَتِي، كَيْفَ حَالُكِ؟",
    "شَفَاكِ اللهُ شِفَاءً عَاجِلًا يَا فَاطِمَة!",
    "طَهُوْرٌ إِنْ شَاءَ اللهُ، لَا بَأْسَ عَلَيْكِ.",
  ]);
  const [messages, setMessages] = useState<RoleplayMessage[]>([
    {
      sender: "ai",
      arabic: "أَهْلًا وَسَهْلًا يَا صَدِيْقِي، شُكْرًا لِحُضُوْرِكَ لِعِيَادَتِي...",
      transliteration:
        "Ahlan wa sahlan ya shadiiqii, syukran lihudhuurika li'iyaadatii...",
      translation:
        "Selamat datang wahai temanku, terima kasih banyak telah datang menjengukku...",
      expression: "tersenyum lemah di tempat tidur",
    },
  ]);

  const handleSendRoleplay = async (inputText?: string) => {
    const textToSend = inputText || roleplayInput;
    if (!textToSend.trim() || roleplayLoading) return;

    const userMsg: RoleplayMessage = {
      sender: "user",
      arabic: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    setRoleplayInput("");
    setRoleplayLoading(true);

    try {
      const res = await fetch("/api/roleplay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          character: selectedCharacter,
          message: textToSend,
          roleplayHistory: messages.slice(-4),
        }),
      });

      if (!res.ok) {
        throw new Error("Gagal mendapatkan respons AI");
      }

      const data = await res.json();
      const aiMsg: RoleplayMessage = {
        sender: "ai",
        arabic: data.arabic || "شَفَاكَ اللهُ وَعَافَاكَ",
        transliteration: data.transliteration,
        translation: data.translation,
        expression: data.expression,
      };

      setMessages((prev) => [...prev, aiMsg]);
      if (Array.isArray(data.suggestedReplies) && data.suggestedReplies.length > 0) {
        setSuggestedReplies(data.suggestedReplies);
      }

      // Auto-play AI response
      if (data.arabic) {
        arabicAudio.speak(data.arabic);
      }
    } catch (err) {
      console.error(err);
      const fallbackMsg: RoleplayMessage = {
        sender: "ai",
        arabic: "آمِيْنَ، جَزَاكَ اللهُ خَيْرًا عَلَى دُعَائِكَ وَزِيَارَتِكَ الْكَرِيْمَةِ!",
        translation:
          "Aamiin, semoga Allah membalas kebaikanmu atas doa dan kunjungan muliamu!",
        expression: "penuh rasa syukur",
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setRoleplayLoading(false);
    }
  };

  const resetRoleplay = () => {
    setMessages([
      {
        sender: "ai",
        arabic:
          selectedCharacter === "Fatimah"
            ? "أَهْلًا وَسَهْلًا يَا صَدِيْقِي، شُكْرًا لِحُضُوْرِكَ لِعِيَادَتِي..."
            : "السَّلَامُ عَلَيْكُمْ يَا أَخِي، أَشْعُرُ بِصُدَاعٍ شَدِيْدٍ فِي رَأْسِي...",
        transliteration:
          selectedCharacter === "Fatimah"
            ? "Ahlan wa sahlan ya shadiiqii, syukran lihudhuurika li'iyaadatii..."
            : "Assalamu 'alaikum ya akhii, asy'uru bishudaa'in syadiidin...",
        translation:
          selectedCharacter === "Fatimah"
            ? "Selamat datang wahai temanku, terima kasih banyak telah datang menjengukku..."
            : "Assalamu'alaikum saudaraku, aku merasakan sakit kepala parah...",
        expression: "terbaring di ranjang rumah sakit",
      },
    ]);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-emerald-700 to-teal-800 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-emerald-100 text-xs font-semibold mb-3">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>الْمَهَارَةُ الثَّانِيَةُ: مَهَارَةُ الْكَلَامِ</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
            Maharah Kalam (Keterampilan Berbicara)
          </h2>
          <p className="text-emerald-100 text-sm md:text-base leading-relaxed">
            Latihlah tindak tutur menanyakan kondisi orang sakit (السؤال عن حال
            المريض) dan mengucapkan doa kesembuhan (الدعاء للمريض بالشفاء). Coba
            juga fitur simulasi percakapan interaktif bersama AI!
          </p>
        </div>
      </div>

      {/* Bagian Doa Ma'tsur Menjenguk Orang Sakit */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-3xl p-6 md:p-8 border border-amber-200/80 shadow-sm">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 bg-amber-500 text-white rounded-xl shadow-sm">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-amber-950">
              Doa-Doa Ma'tsur Menjenguk Orang Sakit (أَدْعِيَةُ عِيَادَةِ الْمَرِيْضِ)
            </h3>
            <p className="text-xs text-amber-800/80">
              Sunnah Rasulullah SAW saat menjenguk saudara yang sedang sakit
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Doa 1 */}
          <div className="bg-white p-5 rounded-2xl border border-amber-200/60 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Dibaca 7 Kali di Dekat Pasien
                </span>
                <AudioButton
                  text="أَسْأَلُ اللهَ الْعَظِيْمَ رَبَّ الْعَرْشِ الْعَظِيْمِ أَنْ يَشْفِيَكَ"
                  variant="primary"
                  size="sm"
                  label="Dengarkan Doa"
                />
              </div>
              <p className="text-right font-arabic text-xl md:text-2xl font-bold text-emerald-950 leading-loose my-2">
                «أَسْأَلُ اللهَ الْعَظِيْمَ رَبَّ الْعَرْشِ الْعَظِيْمِ أَنْ يَشْفِيَكَ»
              </p>
              <p className="text-xs text-slate-500 italic mb-1">
                "As'alullaahal-'Azhiima Rabbal-'Arsyil-'Azhiimi an yasyfiyaka"
              </p>
              <p className="text-xs text-slate-700 font-medium">
                Artinya: "Aku memohon kepada Allah Yang Maha Agung, Pemilik Arsy
                yang agung, agar menyembuhkanmu." (HR. Abu Dawud & Tirmidzi)
              </p>
            </div>
          </div>

          {/* Doa 2 & 3 */}
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-2xl border border-amber-200/60 shadow-xs flex items-center justify-between gap-3">
              <div>
                <p className="text-right font-arabic text-xl font-bold text-emerald-950">
                  «شَفَاكَ اللهُ شِفَاءً عَاجِلًا» / «شَفَاكِ اللهُ»
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  "Semoga Allah memberikan kesembuhan yang segera kepadamu (lk / pr)."
                </p>
              </div>
              <AudioButton
                text="شَفَاكَ اللهُ شِفَاءً عَاجِلًا، شَفَاكِ اللهُ شِفَاءً عَاجِلًا"
                variant="iconOnly"
              />
            </div>

            <div className="bg-white p-4 rounded-2xl border border-amber-200/60 shadow-xs flex items-center justify-between gap-3">
              <div>
                <p className="text-right font-arabic text-xl font-bold text-emerald-950">
                  «لَا بَأْسَ، طَهُوْرٌ إِنْ شَاءَ اللهُ»
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  "Tidak mengapa, semoga sakitmu ini menjadi pembersih dosa, insya Allah."
                </p>
              </div>
              <AudioButton
                text="لَا بَأْسَ، طَهُوْرٌ إِنْ شَاءَ اللهُ"
                variant="iconOnly"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bagian Percakapan Interaktif (Modul Dialog) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800">
            Naskah Percakapan (الْحِوَارُ الْمَدْرَسِيُّ)
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Pilih situasi percakapan di bawah, dengarkan lafadznya, dan tirukan
            dengan makhraj yang tepat.
          </p>
        </div>

        {/* Scene Selector */}
        <div className="flex flex-wrap gap-2">
          {DIALOGUE_SCENES.map((scene) => (
            <button
              key={scene.id}
              onClick={() => setSelectedSceneId(scene.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedSceneId === scene.id
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              <span>{scene.title}</span>
            </button>
          ))}
        </div>

        {/* Scene Box */}
        <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-emerald-900 text-base">
              {currentScene.title}
            </h4>
            <p className="text-xs text-emerald-700 font-arabic text-right mt-0.5">
              {currentScene.titleArabic}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {currentScene.description}
            </p>
          </div>
          <button
            onClick={() => {
              // Play full dialogue sequentially
              const fullText = currentScene.dialogue
                .map((d) => d.arabic)
                .join(" ... ");
              arabicAudio.speak(fullText);
            }}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Putar Seluruh Dialog</span>
          </button>
        </div>

        {/* Chat / Dialogue Lines */}
        <div className="space-y-4">
          {currentScene.dialogue.map((line, index) => {
            const isPatient = line.avatarRole === "patient";
            const isDoctor = line.avatarRole === "doctor";

            return (
              <div
                key={index}
                className={`p-4 rounded-2xl border transition-all ${
                  isPatient
                    ? "bg-rose-50/40 border-rose-200"
                    : isDoctor
                    ? "bg-sky-50/40 border-sky-200"
                    : "bg-slate-50/80 border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        isPatient
                          ? "bg-rose-100 text-rose-800"
                          : isDoctor
                          ? "bg-sky-100 text-sky-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {line.speaker}
                    </span>
                  </div>
                  <AudioButton text={line.arabic} variant="iconOnly" size="sm" />
                </div>

                <p className="text-right font-arabic text-xl md:text-2xl font-bold text-slate-900 leading-relaxed mb-2">
                  {line.arabic}
                </p>

                <div className="pt-2 border-t border-slate-200/60 flex flex-col gap-0.5">
                  <p className="text-xs text-slate-400 italic">
                    {line.transliteration}
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-slate-700">
                    "{line.translation}"
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bagian Simulasi Percakapan AI (Roleplay Cerdas) */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-800/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/20 text-emerald-300 rounded-2xl border border-emerald-500/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>Simulasi Percakapan 'Iyadah (AI Roleplay)</span>
                <span className="text-[10px] bg-amber-400 text-slate-900 px-2 py-0.5 rounded-full font-extrabold uppercase">
                  Interaktif
                </span>
              </h3>
              <p className="text-xs text-emerald-200/80">
                Latihlah menjenguk sahabatmu yang sakit secara langsung dengan respon kecerdasan buatan.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-white/10 p-1 rounded-xl text-xs">
              <button
                onClick={() => {
                  setSelectedCharacter("Fatimah");
                  resetRoleplay();
                }}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  selectedCharacter === "Fatimah"
                    ? "bg-emerald-600 text-white font-bold"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Fatimah (فَاطِمَة)
              </button>
              <button
                onClick={() => {
                  setSelectedCharacter("Farid");
                  resetRoleplay();
                }}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  selectedCharacter === "Farid"
                    ? "bg-emerald-600 text-white font-bold"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Farid (فَرِيْد)
              </button>
            </div>

            <button
              onClick={resetRoleplay}
              title="Mulai Ulang Percakapan"
              className="p-2 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat Stream Window */}
        <div className="bg-slate-950/70 rounded-2xl p-4 md:p-6 border border-emerald-900/60 max-h-96 overflow-y-auto space-y-4">
          {messages.map((msg, index) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={index}
                className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-xl rounded-2xl p-4 space-y-2 ${
                    isUser
                      ? "bg-emerald-600 text-white rounded-br-none"
                      : "bg-slate-800 text-slate-100 border border-emerald-800/50 rounded-bl-none"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 text-xs opacity-75 pb-1 border-b border-white/10">
                    <span className="font-semibold">
                      {isUser ? "Kamu (Pengunjung)" : `${selectedCharacter} (Pasien)`}
                    </span>
                    {!isUser && msg.expression && (
                      <span className="italic text-[11px] text-amber-300">
                        ({msg.expression})
                      </span>
                    )}
                    <AudioButton text={msg.arabic} variant="iconOnly" size="sm" />
                  </div>

                  <p className="text-right font-arabic text-xl md:text-2xl font-bold leading-relaxed">
                    {msg.arabic}
                  </p>

                  {msg.translation && (
                    <p className="text-xs text-slate-300 pt-1 border-t border-white/10">
                      {msg.translation}
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          {roleplayLoading && (
            <div className="flex items-center gap-2 text-emerald-400 text-xs italic">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{selectedCharacter} sedang menjawab...</span>
            </div>
          )}
        </div>

        {/* Suggested Quick Replies */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-semibold">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Pilihan Balasan Cepat (Klik untuk mengirim):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedReplies.map((reply, index) => (
              <button
                key={index}
                onClick={() => handleSendRoleplay(reply)}
                disabled={roleplayLoading}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-emerald-600/80 text-emerald-100 hover:text-white text-xs font-arabic border border-emerald-700/50 transition-all cursor-pointer text-right"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="flex gap-2">
          <input
            type="text"
            dir="auto"
            placeholder="Ketik ucapan dalam bahasa Arab atau Indonesia (contoh: شَفَاكِ اللهُ يَا فَاطِمَة)..."
            value={roleplayInput}
            onChange={(e) => setRoleplayInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendRoleplay();
            }}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          />
          <button
            onClick={() => handleSendRoleplay()}
            disabled={roleplayLoading || !roleplayInput.trim()}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            {roleplayLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>Kirim</span>
          </button>
        </div>
      </div>
    </div>
  );
};
