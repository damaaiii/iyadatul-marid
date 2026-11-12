import React, { useState, useEffect } from "react";
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Timer,
  Info,
  Download,
  Printer,
  ChevronRight,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import confetti from "canvas-confetti";
import { COMPREHENSIVE_QUIZ } from "../../data/arabicData.ts";
import { QuizQuestion } from "../../types/index.ts";
import { AudioButton } from "../AudioButton.tsx";

export const IkhtibarQuiz: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>(COMPREHENSIVE_QUIZ);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [studentName, setStudentName] = useState<string>("Siswa Berprestasi MTs");
  const [madrasahName, setMadrasahName] = useState<string>("MTs Negeri / Swasta");
  const [showCertificate, setShowCertificate] = useState<boolean>(false);

  // AI Quiz Generator states
  const [isGeneratingAiQuiz, setIsGeneratingAiQuiz] = useState<boolean>(false);

  const currentQ = questions[currentIndex];

  const handleSelectAnswer = (optionIdx: number) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionIdx,
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correct += 1;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
    const finalScore = calculateScore();
    if (finalScore >= 80) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        console.warn("Confetti error", e);
      }
    }
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setIsSubmitted(false);
    setCurrentIndex(0);
    setShowCertificate(false);
  };

  const handleGenerateAiQuiz = async () => {
    setIsGeneratingAiQuiz(true);
    try {
      const res = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: "Fi'il Madhi, Jumlah Fi'liyah, dan Kosa Kata 'Iyadatul Maridh",
          count: 5,
        }),
      });

      if (!res.ok) throw new Error("Gagal generate kuis AI");
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const formatted: QuizQuestion[] = data.map((q: any, i: number) => ({
          id: 100 + i,
          type: "tarkib",
          questionArabic: q.questionArabic,
          questionIndo: q.questionIndo,
          options: q.options,
          correctAnswer: q.correctAnswerIndex,
          explanation: q.explanation,
          audioText: q.questionArabic,
        }));
        setQuestions(formatted);
        handleResetQuiz();
      }
    } catch (err) {
      console.error(err);
      alert("Gagal memuat kuis AI. Menggunakan kuis standar modul.");
    } finally {
      setIsGeneratingAiQuiz(false);
    }
  };

  const answeredCount = Object.keys(userAnswers).length;
  const score = isSubmitted ? calculateScore() : 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-emerald-100 text-xs font-semibold mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>الِاخْتِبَارُ الشَّامِلُ • عِيَادَةُ الْمَرِيْضِ</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
            Ikhtibar (Evaluasi Pembelajaran Bab 6)
          </h2>
          <p className="text-emerald-100 text-sm md:text-base leading-relaxed">
            Uji penguasaan 4 Maharah dan Tarkib Fi'il Madhi. Raih nilai minimal
            80 untuk mendapatkan Sertifikat Prestasi Belajar resmi!
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={handleGenerateAiQuiz}
              disabled={isGeneratingAiQuiz}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {isGeneratingAiQuiz ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>Buat Paket Soal Baru dengan AI</span>
            </button>
            <button
              onClick={() => {
                setQuestions(COMPREHENSIVE_QUIZ);
                handleResetQuiz();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-medium transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Gunakan Soal Baku Modul</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Quiz Area */}
      {!isSubmitted ? (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
          {/* Header & Progress */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 uppercase">
                Soal {currentIndex + 1} dari {questions.length} • Jenis:{" "}
                {currentQ.type.toUpperCase()}
              </span>
              <h3 className="text-lg font-bold text-slate-800 mt-2">
                Pilihlah salah satu jawaban yang paling tepat:
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">
                Terjawab: {answeredCount} / {questions.length}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>

          {/* Question Card */}
          <div className="p-6 rounded-2xl bg-emerald-50/40 border border-emerald-100 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="w-full text-right">
                <p className="font-arabic text-2xl md:text-3xl font-bold text-emerald-950 leading-loose">
                  {currentQ.questionArabic}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 text-left font-medium mt-1">
                  {currentQ.questionIndo}
                </p>
              </div>
              <AudioButton
                text={currentQ.audioText || currentQ.questionArabic}
                variant="iconOnly"
                size="md"
              />
            </div>

            {/* Options */}
            <div className="space-y-2.5 pt-2">
              {currentQ.options.map((option, idx) => {
                const isSelected = userAnswers[currentQ.id] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectAnswer(idx)}
                    className={`w-full p-4 rounded-xl border text-right font-arabic text-xl font-bold transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-300"
                        : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  >
                    <span className="text-xs font-sans font-bold opacity-75">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nav buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>

            {currentIndex + 1 < questions.length ? (
              <button
                onClick={() =>
                  setCurrentIndex((prev) =>
                    Math.min(questions.length - 1, prev + 1)
                  )
                }
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>Selanjutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                disabled={answeredCount < questions.length}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-sm shadow-md cursor-pointer transition-all"
              >
                Selesaikan Ujian & Lihat Nilai
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results & Discussion Screen */
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm text-center space-y-4">
            <div className="inline-flex p-4 rounded-full bg-emerald-100 text-emerald-700">
              <Award className="w-12 h-12" />
            </div>

            <h3 className="text-2xl font-black text-slate-900">
              Hasil Evaluasi Pembelajaran
            </h3>

            <div className="max-w-xs mx-auto p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-5xl font-black text-emerald-700">
                {score}
              </span>
              <span className="text-slate-400 text-sm font-semibold block">
                / 100 Poin
              </span>
            </div>

            <p className="text-sm text-slate-600 max-w-md mx-auto">
              {score >= 80
                ? "Mumtaz jiddan! Pemahamanmu terhadap materi 'Iyadatul Maridh dan Tarkib Fi'il Madhi sangat luar biasa!"
                : "Jayyid! Teruslah berlatih membaca, menyimak, dan mengulang tasrif fi'il madhi agar semakin lancar."}
            </p>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                onClick={() => setShowCertificate(true)}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <Award className="w-4 h-4" />
                <span>Lihat Sertifikat Prestasi</span>
              </button>

              <button
                onClick={handleResetQuiz}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Ulangi Ujian</span>
              </button>
            </div>
          </div>

          {/* Certificate Modal / View */}
          {showCertificate && (
            <div className="p-6 md:p-10 rounded-3xl bg-gradient-to-br from-amber-50 via-white to-emerald-50 border-4 border-amber-300 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-amber-200 pb-4">
                <div className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-amber-600" />
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-widest">
                    Sertifikat Kelulusan Belajar Bahasa Arab
                  </span>
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak</span>
                </button>
              </div>

              <div className="text-center py-4 space-y-3">
                <h2 className="text-3xl md:text-4xl font-extrabold font-arabic text-emerald-950">
                  شَهَادَةُ تَقْدِيْرٍ
                </h2>
                <p className="text-xs text-slate-500 uppercase tracking-widest">
                  CERTIFICATE OF ACHIEVEMENT
                </p>

                <p className="text-sm text-slate-600">
                  Diberikan dengan penuh penghargaan kepada:
                </p>

                <div className="max-w-md mx-auto space-y-2">
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Nama Lengkap Siswa"
                    className="w-full text-center text-xl md:text-2xl font-bold text-emerald-900 border-b-2 border-dashed border-emerald-400 bg-transparent py-1 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={madrasahName}
                    onChange={(e) => setMadrasahName(e.target.value)}
                    placeholder="Nama Madrasah / Sekolah"
                    className="w-full text-center text-xs text-slate-500 border-b border-dashed border-slate-300 bg-transparent py-0.5 focus:outline-none"
                  />
                </div>

                <p className="text-xs md:text-sm text-slate-700 max-w-lg mx-auto leading-relaxed pt-3">
                  Telah menyelesaikan Evaluasi Formatif Pembelajaran Bahasa Arab
                  Kelas VIII Madrasah Tsanawiyah (MTs) Bab 6:{" "}
                  <strong>عِيَادَةُ الْمَرِيْضِ (Menjenguk Orang Sakit)</strong>,
                  menguasai 4 Maharah (Istima', Kalam, Qira'ah, Kitabah) serta
                  Tarkib Fi'il Madhi dengan predikat kelulusan:
                </p>

                <div className="inline-block px-5 py-2 rounded-2xl bg-emerald-700 text-white font-bold text-base shadow-sm">
                  NILAI: {score} •{" "}
                  {score >= 90
                    ? "MUMTAZ (ISTIMEWA)"
                    : score >= 80
                    ? "JAYYID JIDDAN (SANGAT BAIK)"
                    : "JAYYID (BAIK)"}
                </div>
              </div>

              <div className="pt-6 border-t border-amber-200 flex items-center justify-between text-xs text-slate-500">
                <div>
                  <p className="font-semibold text-slate-700">Guru Pengampu:</p>
                  <p className="font-arabic text-sm text-emerald-950 font-bold">
                    أُسْتَاذُ اللُّغَةِ الْعَرَبِيَّةِ
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-700">Tanggal:</p>
                  <p>{new Date().toLocaleDateString("id-ID")}</p>
                </div>
              </div>
            </div>
          )}

          {/* Pembahasan Soal-Soal */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
            <h4 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">
              Kunci Jawaban & Pembahasan Mendalam
            </h4>

            <div className="space-y-4">
              {questions.map((q, idx) => {
                const userChoice = userAnswers[q.id];
                const isCorrect = userChoice === q.correctAnswer;

                return (
                  <div
                    key={q.id}
                    className={`p-5 rounded-2xl border ${
                      isCorrect
                        ? "bg-emerald-50/40 border-emerald-200"
                        : "bg-rose-50/40 border-rose-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-500">
                        Nomor {idx + 1} • {q.type.toUpperCase()}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-bold">
                        {isCorrect ? (
                          <span className="text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Jawaban Anda Benar
                          </span>
                        ) : (
                          <span className="text-rose-600 flex items-center gap-1">
                            <XCircle className="w-4 h-4" /> Jawaban Anda Kurang Tepat
                          </span>
                        )}
                      </span>
                    </div>

                    <p className="text-right font-arabic text-xl font-bold text-slate-900 mb-1">
                      {q.questionArabic}
                    </p>
                    <p className="text-xs text-slate-600 mb-3">{q.questionIndo}</p>

                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                      <p className="text-emerald-800 font-bold">
                        Jawaban Benar: ({String.fromCharCode(65 + q.correctAnswer)}){" "}
                        <span className="font-arabic text-sm">
                          {q.options[q.correctAnswer]}
                        </span>
                      </p>
                      <p className="text-slate-600 leading-relaxed pt-1 border-t border-slate-100">
                        <strong>Kaidah / Penjelasan:</strong> {q.explanation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
