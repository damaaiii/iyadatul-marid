import React from "react";
import {
  Headphones,
  MessageSquare,
  BookOpen,
  PenTool,
  BookCheck,
  Award,
  Sparkles,
  FileText,
  Activity,
} from "lucide-react";

export type TabType =
  | "istima"
  | "kalam"
  | "qiraah"
  | "kitabah"
  | "tarkib"
  | "ikhtibar";

interface NavbarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenAiTutor: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenAiTutor,
}) => {
  const tabs = [
    {
      id: "istima" as TabType,
      label: "Istima'",
      arabicLabel: "اِسْتِمَاع",
      icon: Headphones,
      badge: "Menyimak",
    },
    {
      id: "kalam" as TabType,
      label: "Kalam",
      arabicLabel: "كَلَام",
      icon: MessageSquare,
      badge: "Berbicara",
    },
    {
      id: "qiraah" as TabType,
      label: "Qira'ah",
      arabicLabel: "قِرَاءَة",
      icon: BookOpen,
      badge: "Membaca",
    },
    {
      id: "kitabah" as TabType,
      label: "Kitabah",
      arabicLabel: "كِتَابَة",
      icon: PenTool,
      badge: "Menulis",
    },
    {
      id: "tarkib" as TabType,
      label: "Tarkib",
      arabicLabel: "تَرْكِيْب",
      icon: BookCheck,
      badge: "Gramatika",
    },
    {
      id: "ikhtibar" as TabType,
      label: "Ikhtibar",
      arabicLabel: "اِخْتِبَار",
      icon: Award,
      badge: "Ujian",
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-sm">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white px-4 py-2.5 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-700/80 text-emerald-200 px-2 py-0.5 rounded font-semibold text-[11px] border border-emerald-600/60">
              KMA 183 • MTs KELAS VIII
            </span>
            <span className="hidden sm:inline text-emerald-200/90 font-medium">
              الدرس السادس: عِيَادَةُ الْمَرِيْضِ (Menjenguk Orang Sakit)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/public/assets/aistudio/MODUL_BAHASA_ARAB_ff97db28.pdf"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-emerald-100 hover:text-white transition-colors"
              title="Buka Buku Teks Bahasa Arab Kemenag"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-300" />
              <span>Modul Buku PDF</span>
            </a>

            <button
              onClick={onOpenAiTutor}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-bold shadow-sm transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tanya Ustadz AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-800 leading-tight">
                'Iyadatul Maridh
              </h1>
              <span className="text-xl font-bold font-arabic text-emerald-700">
                عِيَادَةُ الْمَرِيْضِ
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Media Belajar 4 Maharah & Tarkib Fi'il Madhi • Bahasa Arab MTs
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center overflow-x-auto pb-1 md:pb-0 gap-1.5 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative px-3.5 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                    : "text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/70"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                <div className="text-left leading-none">
                  <div className="flex items-center gap-1.5">
                    <span>{tab.label}</span>
                    <span className="text-xs opacity-75 font-arabic">
                      {tab.arabicLabel}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
