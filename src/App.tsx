/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Navbar, TabType } from "./components/Navbar.tsx";
import { MaharahIstima } from "./components/tabs/MaharahIstima.tsx";
import { MaharahKalam } from "./components/tabs/MaharahKalam.tsx";
import { MaharahQiraah } from "./components/tabs/MaharahQiraah.tsx";
import { MaharahKitabah } from "./components/tabs/MaharahKitabah.tsx";
import { TarkibGrammar } from "./components/tabs/TarkibGrammar.tsx";
import { IkhtibarQuiz } from "./components/tabs/IkhtibarQuiz.tsx";
import { AiTutorModal } from "./components/AiTutorModal.tsx";
import {
  Sparkles,
  BookOpen,
  HeartHandshake,
  FileText,
  GraduationCap,
  ChevronRight,
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("istima");
  const [isAiTutorOpen, setIsAiTutorOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenAiTutor={() => setIsAiTutorOpen(true)}
      />

      {/* Main Tab Content */}
      <main className="flex-1 pb-16">
        {activeTab === "istima" && <MaharahIstima />}
        {activeTab === "kalam" && <MaharahKalam />}
        {activeTab === "qiraah" && <MaharahQiraah />}
        {activeTab === "kitabah" && <MaharahKitabah />}
        {activeTab === "tarkib" && <TarkibGrammar />}
        {activeTab === "ikhtibar" && <IkhtibarQuiz />}
      </main>

      {/* Floating AI Tutor Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsAiTutorOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-800/25 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <div className="p-1 rounded-full bg-amber-400 text-slate-950">
            <Sparkles className="w-4 h-4" />
          </div>
          <span>Tanya Ustadz AI</span>
          <span className="hidden sm:inline text-emerald-200 text-xs font-normal">
            | Mu'allim Arabi
          </span>
        </button>
      </div>

      {/* AI Tutor Chat Drawer/Modal */}
      <AiTutorModal
        isOpen={isAiTutorOpen}
        onClose={() => setIsAiTutorOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-10 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-white font-bold text-sm">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <span>
                'Iyadatul Maridh (عِيَادَةُ الْمَرِيْضِ) • Bahasa Arab MTs Kelas 8
              </span>
            </div>
            <p className="text-slate-500">
              Disusun berdasarkan Buku Siswa Bahasa Arab MTs Kelas VIII KMA 183
              Tahun 2020 Kementerian Agama Republik Indonesia.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400">
            <a
              href="/public/assets/aistudio/MODUL_BAHASA_ARAB_ff97db28.pdf"
              target="_blank"
              rel="noreferrer"
              className="hover:text-emerald-300 transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Unduh Buku Teks PDF</span>
            </a>
            <span>•</span>
            <button
              onClick={() => setActiveTab("tarkib")}
              className="hover:text-emerald-300 transition-colors cursor-pointer"
            >
              Kaidah Fi'il Madhi
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab("ikhtibar")}
              className="hover:text-emerald-300 transition-colors cursor-pointer"
            >
              Evaluasi Akhir
            </button>
            <span>•</span>
            <button
              onClick={() => setIsAiTutorOpen(true)}
              className="hover:text-amber-300 transition-colors text-amber-400 font-semibold cursor-pointer"
            >
              Ustadz AI
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
