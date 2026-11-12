import React, { useState } from "react";
import {
  BookOpen,
  Volume2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Info,
} from "lucide-react";
import { READING_TEXTS } from "../../data/arabicData.ts";
import { AudioButton } from "../AudioButton.tsx";
import { arabicAudio } from "../../utils/audio.ts";

export const MaharahQiraah: React.FC = () => {
  const [selectedTextId, setSelectedTextId] = useState<string>("text-1");
  const [fontSizeLevel, setFontSizeLevel] = useState<"normal" | "large" | "xl">("large");
  const [showTranslation, setShowTranslation] = useState<boolean>(true);
  const [showTransliteration, setShowTransliteration] = useState<boolean>(false);

  // Comprehension test states
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showTestResult, setShowTestResult] = useState<boolean>(false);

  const currentText =
    READING_TEXTS.find((t) => t.id === selectedTextId) || READING_TEXTS[0];

  const handleSelectAnswer = (questionId: string, optionIndex: number) => {
    if (showTestResult) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    currentText.comprehensionQuestions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correct += 1;
      }
    });
    return Math.round((correct / currentText.comprehensionQuestions.length) * 100);
  };

  const resetQuiz = () => {
    setAnswers({});
    setShowTestResult(false);
  };

  const fontSizeClasses = {
    normal: "text-xl md:text-2xl leading-relaxed",
    large: "text-2xl md:text-3xl leading-loose",
    xl: "text-3xl md:text-4xl leading-loose",
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-emerald-100 text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>الْمَهَارَةُ الثَّالِثَةُ: مَهَارَةُ الْقِرَاءَةِ</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
            Maharah Qira'ah (Keterampilan Membaca)
          </h2>
          <p className="text-emerald-100 text-sm md:text-base leading-relaxed">
            Bacalah teks naratif bertema 'Iyadatul Maridh dari buku Kemenag RI,
            perhatikan pelafalan kata kerja lampau (Fi'il Madhi), dan uji
            pemahamanmu melalui latihan Fahm al-Maqru'.
          </p>
        </div>
      </div>

      {/* Main Reading Container */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          {/* Text Switcher */}
          <div className="flex items-center gap-2">
            {READING_TEXTS.map((text) => (
              <button
                key={text.id}
                onClick={() => {
                  setSelectedTextId(text.id);
                  resetQuiz();
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  selectedTextId === text.id
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                <span>{text.title}</span>
              </button>
            ))}
          </div>

          {/* Reading Display Controls */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            {/* Font size toggles */}
            <div className="flex items-center bg-slate-100 rounded-xl p-1 text-slate-700">
              <button
                onClick={() => setFontSizeLevel("normal")}
                className={`px-2 py-1 rounded-lg font-bold cursor-pointer ${
                  fontSizeLevel === "normal"
                    ? "bg-white shadow-xs text-emerald-700"
                    : ""
                }`}
              >
                A
              </button>
              <button
                onClick={() => setFontSizeLevel("large")}
                className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${
                  fontSizeLevel === "large"
                    ? "bg-white shadow-xs text-emerald-700"
                    : ""
                }`}
              >
                A+
              </button>
              <button
                onClick={() => setFontSizeLevel("xl")}
                className={`px-3 py-1 rounded-lg font-bold cursor-pointer ${
                  fontSizeLevel === "xl"
                    ? "bg-white shadow-xs text-emerald-700"
                    : ""
                }`}
              >
                A++
              </button>
            </div>

            {/* Translation toggle */}
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className={`px-3 py-1.5 rounded-xl font-medium border transition-colors cursor-pointer ${
                showTranslation
                  ? "bg-emerald-50 text-emerald-700 border-emerald-300 font-bold"
                  : "bg-slate-50 text-slate-600 border-slate-200"
              }`}
            >
              Terjemahan: {showTranslation ? "Aktif" : "Sembunyi"}
            </button>

            {/* Transliteration toggle */}
            <button
              onClick={() => setShowTransliteration(!showTransliteration)}
              className={`px-3 py-1.5 rounded-xl font-medium border transition-colors cursor-pointer ${
                showTransliteration
                  ? "bg-emerald-50 text-emerald-700 border-emerald-300 font-bold"
                  : "bg-slate-50 text-slate-600 border-slate-200"
              }`}
            >
              Latin: {showTransliteration ? "Aktif" : "Sembunyi"}
            </button>

            {/* Play all */}
            <button
              onClick={() => {
                const fullText = currentText.paragraphs
                  .map((p) => p.arabic)
                  .join(" ... ");
                arabicAudio.speak(fullText);
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Baca Seluruh Teks</span>
            </button>
          </div>
        </div>

        {/* Text Header */}
        <div className="text-center py-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
          <h3 className="text-2xl md:text-3xl font-bold font-arabic text-emerald-900 mb-1">
            {currentText.titleArabic}
          </h3>
          <p className="text-sm font-semibold text-slate-700">
            {currentText.title}
          </p>
          <p className="text-xs text-slate-400 mt-1">{currentText.source}</p>
        </div>

        {/* Paragraphs Display */}
        <div className="space-y-6">
          {currentText.paragraphs.map((para, index) => (
            <div
              key={index}
              className="p-5 md:p-6 rounded-2xl border border-slate-200/80 bg-slate-50/40 hover:bg-emerald-50/20 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                  Paragraf {index + 1}
                </span>
                <AudioButton
                  text={para.arabic}
                  variant="subtle"
                  size="sm"
                  label="Dengarkan Paragraf"
                />
              </div>

              {/* Arabic Paragraph */}
              <p
                dir="rtl"
                className={`font-arabic text-slate-900 font-medium ${fontSizeClasses[fontSizeLevel]}`}
              >
                {para.arabic}
              </p>

              {/* Transliteration */}
              {showTransliteration && (
                <p className="text-xs text-slate-500 italic pt-1 border-t border-slate-200/60 leading-relaxed">
                  {para.transliteration}
                </p>
              )}

              {/* Translation */}
              {showTranslation && (
                <p className="text-xs sm:text-sm text-slate-700 font-medium pt-1 border-t border-slate-200/60 leading-relaxed bg-white/70 p-3 rounded-xl">
                  {para.translation}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bagian Fahm al-Maqru' (Uji Pemahaman Teks) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span>Fahm al-Maqru' (فَهْمُ الْمَقْرُوْءِ)</span>
              <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                Latihan Pemahaman
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Jawablah pertanyaan berdasarkan teks di atas untuk menguji daya
              analisismu.
            </p>
          </div>

          {showTestResult && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                Skor: {calculateScore()} / 100
              </span>
              <button
                onClick={resetQuiz}
                className="text-xs font-semibold text-slate-600 hover:text-emerald-700 underline cursor-pointer"
              >
                Ulangi Tes
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {currentText.comprehensionQuestions.map((q, qIndex) => {
            const chosen = answers[q.id];
            const isAnswered = chosen !== undefined;
            const isCorrect = isAnswered && chosen === q.correctAnswer;

            return (
              <div
                key={q.id}
                className={`p-5 rounded-2xl border transition-all ${
                  showTestResult
                    ? isCorrect
                      ? "bg-emerald-50/50 border-emerald-300"
                      : "bg-rose-50/50 border-rose-300"
                    : "bg-slate-50/50 border-slate-200"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                      Soal {qIndex + 1}
                    </span>
                    <h4 className="font-arabic text-xl font-bold text-slate-900 text-right mt-2 leading-relaxed">
                      {q.questionArabic}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                      {q.questionIndo}
                    </p>
                  </div>
                  <AudioButton text={q.questionArabic} variant="iconOnly" size="sm" />
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                  {q.options.map((opt, optIndex) => {
                    const isOptionSelected = chosen === optIndex;
                    let optionStyle =
                      "bg-white border-slate-200 hover:border-emerald-300 text-slate-800";

                    if (showTestResult) {
                      if (optIndex === q.correctAnswer) {
                        optionStyle =
                          "bg-emerald-100 border-emerald-500 text-emerald-900 font-bold ring-2 ring-emerald-400";
                      } else if (isOptionSelected) {
                        optionStyle =
                          "bg-rose-100 border-rose-500 text-rose-900 font-bold";
                      } else {
                        optionStyle = "bg-white border-slate-200 opacity-60";
                      }
                    } else if (isOptionSelected) {
                      optionStyle =
                        "bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold ring-2 ring-emerald-300";
                    }

                    return (
                      <button
                        key={optIndex}
                        onClick={() => handleSelectAnswer(q.id, optIndex)}
                        disabled={showTestResult}
                        className={`p-3.5 rounded-xl border text-right font-arabic text-base sm:text-lg transition-all flex items-center justify-between gap-2 cursor-pointer ${optionStyle}`}
                      >
                        <span className="text-xs font-sans font-bold text-slate-400">
                          {String.fromCharCode(65 + optIndex)}.
                        </span>
                        <span className="font-medium">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {showTestResult && (
                  <div className="mt-3 p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 flex items-start gap-2">
                    <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-emerald-800">
                        Pembahasan:{" "}
                      </span>
                      <span>{q.explanation}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!showTestResult && (
          <div className="flex justify-end pt-4">
            <button
              onClick={() => setShowTestResult(true)}
              disabled={
                Object.keys(answers).length <
                currentText.comprehensionQuestions.length
              }
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              Cek Jawaban & Nilai
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
