import React, { useState } from "react";
import {
  X,
  Sparkles,
  Send,
  Loader2,
  Bot,
  User,
  Lightbulb,
  RotateCcw,
} from "lucide-react";
import { AudioButton } from "./AudioButton.tsx";

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

interface AiTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiTutorModal: React.FC<AiTutorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      text: "أَهْلًا وَسَهْلًا يَا بُنَيَّ! Saya Ustadz Hilmi, pembimbing bahasa Arabmu. Ada yang ingin ditanyakan seputar Bab 6: عِيَادَةُ الْمَرِيْضِ ('Iyadatul Maridh) atau kaidah Fi'il Madhi? Tanyakan apa saja ya!",
    },
  ]);
  const [inputText, setInputText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const quickPrompts = [
    "Jelaskan tasrif fi'il madhi untuk dhomir nahnu & ana",
    "Bagaimana doa yang diajarkan Rasulullah saat menjenguk orang sakit?",
    "Apa perbedaan Jumlah Ismiyyah dan Jumlah Fi'liyah?",
    "Sebutkan 5 nama penyakit dan kosa kata medis dalam bahasa Arab",
    "Buatkan contoh dialog singkat menjenguk teman yang sakit",
  ];

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputText;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = { role: "user", text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          conversationHistory: messages.slice(-6),
        }),
      });

      if (!res.ok) {
        throw new Error("Gagal mengambil respon AI");
      }

      const data = await res.json();
      const aiReply =
        data.reply ||
        "Maaf Ustadz sedang mengalami kendala jaringan. Silakan ulangi pertanyaanmu ya.";
      setMessages((prev) => [...prev, { role: "model", text: aiReply }]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "Afwan, koneksi ke server sedang terganggu. Pastikan server dev dan API key sudah terhubung ya.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        role: "model",
        text: "أَهْلًا وَسَهْلًا! Riwayat chat telah di-reset. Silakan tanyakan hal baru seputar bahasa Arab!",
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl h-[85vh] flex flex-col shadow-2xl border border-emerald-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/10 text-amber-300">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">Ustadz Hilmi AI</h3>
                <span className="text-[10px] bg-amber-400 text-slate-900 px-2 py-0.5 rounded-full font-black uppercase">
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-xs text-emerald-200">
                Tutor Cerdas Bahasa Arab MTs Kelas 8
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleReset}
              title="Reset Chat"
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((msg, idx) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={idx}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-lg p-4 rounded-2xl text-sm leading-relaxed ${
                    isUser
                      ? "bg-emerald-600 text-white rounded-br-none"
                      : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-none shadow-xs"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  {!isUser && (
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Ustadz Hilmi</span>
                      <AudioButton
                        text={msg.text}
                        variant="iconOnly"
                        size="sm"
                      />
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-emerald-700 p-2 italic">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Ustadz Hilmi sedang menulis penjelasan...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts Bar */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 overflow-x-auto">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mr-1">
              <Lightbulb className="w-3 h-3 text-amber-500" /> Tanya:
            </span>
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                disabled={loading}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs transition-colors cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex gap-2">
          <input
            type="text"
            placeholder="Tanyakan mufradat, tarkib, atau doa (Arab / Indo)..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !inputText.trim()}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            {loading ? (
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
