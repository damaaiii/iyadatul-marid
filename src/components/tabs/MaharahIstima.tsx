import React, { useState } from "react";
import {
  Headphones,
  Volume2,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Stethoscope,
  Pill,
  HeartPulse,
  HeartHandshake,
} from "lucide-react";
import { MUFRADAT_LIST } from "../../data/arabicData.ts";
import { AudioButton } from "../AudioButton.tsx";
import { arabicAudio } from "../../utils/audio.ts";
import { MufradatItem } from "../../types/index.ts";

export const MaharahIstima: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activePracticeIndex, setActivePracticeIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswerFeedback, setShowAnswerFeedback] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isPracticeMode, setIsPracticeMode] = useState<boolean>(false);

  // Filtered vocabulary list
  const filteredMufradat = MUFRADAT_LIST.filter((item) => {
    const matchesCategory =
      activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      item.arabic.includes(searchQuery) ||
      item.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Practice items (randomized subset for listening test)
  const practiceItems = React.useMemo(() => {
    return [...MUFRADAT_LIST].sort(() => 0.5 - Math.random()).slice(0, 8);
  }, []);

  const currentPractice = practiceItems[activePracticeIndex];

  // Generate 4 randomized options for the current practice
  const practiceOptions = React.useMemo(() => {
    if (!currentPractice) return [];
    const wrongs = MUFRADAT_LIST.filter(
      (m) => m.id !== currentPractice.id
    ).sort(() => 0.5 - Math.random()).slice(0, 3);
    const combined = [currentPractice, ...wrongs].sort(
      () => 0.5 - Math.random()
    );
    return combined;
  }, [currentPractice]);

  const handleSelectOption = (index: number, chosenItem: MufradatItem) => {
    if (showAnswerFeedback) return;
    setSelectedAnswer(index);
    setShowAnswerFeedback(true);
    if (chosenItem.id === currentPractice.id) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextPractice = () => {
    setSelectedAnswer(null);
    setShowAnswerFeedback(false);
    if (activePracticeIndex + 1 < practiceItems.length) {
      setActivePracticeIndex((prev) => prev + 1);
      // Auto-play audio of next item
      setTimeout(() => {
        arabicAudio.speak(practiceItems[activePracticeIndex + 1].arabic);
      }, 300);
    } else {
      // Completed practice
      setIsPracticeMode(false);
    }
  };

  const startPractice = () => {
    setIsPracticeMode(true);
    setActivePracticeIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowAnswerFeedback(false);
    setTimeout(() => {
      arabicAudio.speak(practiceItems[0].arabic);
    }, 400);
  };

  const categoryIcons = {
    penyakit: <HeartPulse className="w-4 h-4 text-rose-500" />,
    medis: <Stethoscope className="w-4 h-4 text-sky-500" />,
    tindakan: <Pill className="w-4 h-4 text-amber-500" />,
    doa: <HeartHandshake className="w-4 h-4 text-emerald-500" />,
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Headphones className="w-72 h-72" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-emerald-100 text-xs font-semibold mb-3">
            <Headphones className="w-3.5 h-3.5" />
            <span>الْمَهَارَةُ الْأُوْلَى: مَهَارَةُ الِاسْتِمَاعِ</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
            Maharah Istima' (Keterampilan Menyimak)
          </h2>
          <p className="text-emerald-100 text-sm md:text-base leading-relaxed">
            Dengarkan pelafalan kosa kata (المفردات والعبارات) tema 'Iyadatul
            Maridh dengan harakat dan makharijul huruf yang fasih. Uji ketajaman
            pendengaranmu melalui simulasi kuis audio interaktif!
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => {
                if (isPracticeMode) {
                  setIsPracticeMode(false);
                } else {
                  startPractice();
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-sm shadow-md transition-all cursor-pointer transform active:scale-95"
            >
              <Volume2 className="w-4 h-4" />
              <span>
                {isPracticeMode ? "Kembali ke Daftar Kosa Kata" : "Mulai Tes Istima' Interaktif"}
              </span>
            </button>

            <button
              onClick={() => {
                const randomItem =
                  filteredMufradat[
                    Math.floor(Math.random() * filteredMufradat.length)
                  ];
                if (randomItem) arabicAudio.speak(randomItem.arabic);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-medium text-sm transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Dengarkan Kosa Kata Acak</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mode 1: Interactive Listening Test */}
      {isPracticeMode ? (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-emerald-100 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <div>
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                Latihan Menyimak ({activePracticeIndex + 1} dari {practiceItems.length})
              </span>
              <h3 className="text-xl font-bold text-slate-800">
                Dengarkan Audio & Tentukan Artinya
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
                Skor: {score}
              </span>
              <button
                onClick={startPractice}
                title="Ulangi Latihan"
                className="p-2 text-slate-400 hover:text-emerald-600 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="text-center py-8">
            <p className="text-slate-500 text-sm mb-4">
              Klik tombol di bawah untuk mendengarkan lafadz bahasa Arab yang diucapkan:
            </p>

            <div className="inline-flex items-center justify-center p-6 bg-emerald-50 rounded-full border-4 border-emerald-100 mb-6 shadow-inner">
              <AudioButton
                text={currentPractice.arabic}
                size="lg"
                variant="primary"
                label="Putar Suara Kosa Kata"
                className="text-base px-6 py-3"
              />
            </div>

            <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {practiceOptions.map((option, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = option.id === currentPractice.id;

                let btnStyle =
                  "bg-slate-50 border-slate-200 hover:border-emerald-300 text-slate-700";
                if (showAnswerFeedback) {
                  if (isCorrect) {
                    btnStyle =
                      "bg-emerald-100 border-emerald-500 text-emerald-900 font-bold ring-2 ring-emerald-400";
                  } else if (isSelected) {
                    btnStyle =
                      "bg-rose-100 border-rose-500 text-rose-900 font-bold";
                  } else {
                    btnStyle = "bg-slate-50 border-slate-200 opacity-60";
                  }
                }

                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(idx, option)}
                    disabled={showAnswerFeedback}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                  >
                    <div>
                      <p className="text-base font-semibold">{option.meaning}</p>
                      {showAnswerFeedback && (
                        <p className="text-xs font-arabic text-emerald-800 mt-1">
                          {option.arabic} ({option.transliteration})
                        </p>
                      )}
                    </div>
                    {showAnswerFeedback && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {showAnswerFeedback && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {showAnswerFeedback && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleNextPractice}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  {activePracticeIndex + 1 < practiceItems.length
                    ? "Soal Selanjutnya →"
                    : "Selesai & Lihat Ringkasan"}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* Mode 2: Vocabulary Gallery & Audio Player */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span>Mufradat & 'Ibarat Pilihan</span>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-semibold">
                {filteredMufradat.length} Kosa Kata
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Klik ikon speaker pada setiap kartu untuk mendengarkan lafadz Arab dengan harakat lengkap.
            </p>
          </div>

          {/* Search bar */}
          <div className="w-full md:w-72">
            <input
              type="text"
              placeholder="Cari kata (Arab / Indo)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100">
          {[
            { id: "all", label: "Semua Kosa Kata" },
            { id: "penyakit", label: "Penyakit & Gejala" },
            { id: "medis", label: "Fasilitas & Petugas" },
            { id: "tindakan", label: "Tindakan & Obat" },
            { id: "doa", label: "Doa & Ungkapan" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMufradat.map((item) => (
            <div
              key={item.id}
              className="group bg-gradient-to-br from-white to-slate-50/60 p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium capitalize">
                    {categoryIcons[item.category]}
                    <span>{item.category}</span>
                  </span>
                  <AudioButton
                    text={item.arabic}
                    variant="iconOnly"
                    size="sm"
                  />
                </div>

                <div className="text-right my-2">
                  <h4 className="text-2xl md:text-3xl font-bold font-arabic text-emerald-900 group-hover:text-emerald-700 transition-colors leading-relaxed">
                    {item.arabic}
                  </h4>
                  <p className="text-xs text-slate-400 italic">
                    {item.transliteration}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <p className="text-sm font-semibold text-slate-800">
                    {item.meaning}
                  </p>
                </div>
              </div>

              {item.exampleArabic && (
                <div className="mt-3 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100/80 text-xs">
                  <div className="flex items-center justify-between text-emerald-800 font-semibold mb-1">
                    <span>Contoh Kalimat:</span>
                    <AudioButton
                      text={item.exampleArabic}
                      variant="iconOnly"
                      size="sm"
                    />
                  </div>
                  <p className="text-right font-arabic text-sm text-emerald-950 font-medium">
                    {item.exampleArabic}
                  </p>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    "{item.exampleIndo}"
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
