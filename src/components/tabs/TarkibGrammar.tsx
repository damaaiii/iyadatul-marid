import React, { useState } from "react";
import {
  BookCheck,
  CheckCircle2,
  Sparkles,
  Info,
  HelpCircle,
  Lightbulb,
  Table,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import {
  TASRIF_FIIL_MADHI,
  OTHER_VERBS_DRILL,
} from "../../data/arabicData.ts";
import { AudioButton } from "../AudioButton.tsx";

export const TarkibGrammar: React.FC = () => {
  const [selectedVerbRoot, setSelectedVerbRoot] = useState<string>("فَحَصَ");
  const [activeTab, setActiveTab] = useState<"materi" | "tabel" | "kaidah" | "latihan">("materi");

  // Interactive Tasrif Tester
  const [testDhomir, setTestDhomir] = useState<string>("أَنْتِ");
  const [userGuess, setUserGuess] = useState<string>("");
  const [testResult, setTestResult] = useState<"correct" | "wrong" | null>(null);

  const verbsList = [
    { root: "فَحَصَ", meaning: "Memeriksa pasien" },
    { root: "كَتَبَ", meaning: "Menulis resep/surat" },
    { root: "ذَهَبَ", meaning: "Pergi menjenguk" },
    { root: "شَرِبَ", meaning: "Meminum obat" },
    { root: "زَارَ", meaning: "Berkunjung / Menjenguk" },
    { root: "تَنَاوَلَ", meaning: "Mengonsumsi obat" },
  ];

  // Helper to get conjugated form
  const getConjugation = (verb: string, dhomir: string) => {
    const drill = OTHER_VERBS_DRILL.find((v) => v.root === verb);
    if (drill) {
      if (dhomir === "هُوَ") return drill.tasrif.huwa;
      if (dhomir === "هِيَ") return drill.tasrif.hiya;
      if (dhomir === "أَنْتَ") return drill.tasrif.anta;
      if (dhomir === "أَنْتِ") return drill.tasrif.anti;
      if (dhomir === "أَنَا") return drill.tasrif.ana;
      if (dhomir === "نَحْنُ") return drill.tasrif.nahnu;
    }
    // Default for فَحَصَ
    if (dhomir === "هُوَ") return "فَحَصَ";
    if (dhomir === "هِيَ") return "فَحَصَتْ";
    if (dhomir === "أَنْتَ") return "فَحَصْتَ";
    if (dhomir === "أَنْتِ") return "فَحَصْتِ";
    if (dhomir === "أَنَا") return "فَحَصْتُ";
    if (dhomir === "نَحْنُ") return "فَحَصْنَا";
    return verb;
  };

  const handleCheckTasrif = () => {
    const correct = getConjugation(selectedVerbRoot, testDhomir);
    // Simple normalization
    const cleanUser = userGuess.trim();
    if (cleanUser === correct || cleanUser.replace(/[َُِّْ]/g, "") === correct.replace(/[َُِّْ]/g, "")) {
      setTestResult("correct");
    } else {
      setTestResult("wrong");
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-emerald-100 text-xs font-semibold mb-3">
            <BookCheck className="w-3.5 h-3.5" />
            <span>الْقَوَاعِدُ وَالتَّرَاكِيْبُ • الدَّرْسُ السَّادِسُ</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
            Tarkib: Fi'il Madhi & Jumlah Fi'liyah
          </h2>
          <p className="text-emerald-100 text-sm md:text-base leading-relaxed">
            Pelajari konsep kata kerja lampau (الفِعْلُ الْمَاضِي), rumus susunan
            Jumlah Fi'liyah, tabel tasrif 6 dhomir utama, serta kaidah kesesuaian
            gender antara fi'il dan fa'il sesuai modul Kemenag RI.
          </p>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: "materi", label: "1. Konsep & Definisi", arabic: "مَفْهُوْمُ الْفِعْلِ" },
          { id: "tabel", label: "2. Tabel Tasrif 6 Dhomir", arabic: "جَدْوَلُ التَّصْرِيْفِ" },
          { id: "kaidah", label: "3. Aturan Jumlah Fi'liyah", arabic: "قَوَاعِدُ الْجُمْلَةِ" },
          { id: "latihan", label: "4. Drill Uji Hafalan", arabic: "تَدْرِيْبُ التَّصْرِيْفِ" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === tab.id
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <span>{tab.label}</span>
            <span className="text-xs font-arabic opacity-75">{tab.arabic}</span>
          </button>
        ))}
      </div>

      {/* 1. Materi Konsep */}
      {activeTab === "materi" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold text-slate-800">
                A. Pengertian Fi'il (Kata Kerja) & Macam-Macamnya
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Berdasarkan waktu terjadinya, kata kerja dalam bahasa Arab
                terbagi menjadi tiga macam.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Fiil Madhi */}
              <div className="p-5 rounded-2xl bg-emerald-50/70 border-2 border-emerald-300 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-200/80 px-2.5 py-0.5 rounded-full">
                    Fokus Bab 6
                  </span>
                  <span className="font-arabic text-xl font-bold text-emerald-950">
                    الفِعْلُ الْمَاضِي
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  1. Fi'il Madhi (Waktu Lampau)
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Kata kerja yang menunjukkan pekerjaan atau peristiwa yang telah
                  terjadi di masa lalu/lampau (Past Tense).
                </p>
                <div className="p-3 bg-white rounded-xl border border-emerald-200 text-right space-y-1">
                  <p className="font-arabic text-xl font-bold text-emerald-950">
                    قَرَأْتُ الْقُرْآنَ
                  </p>
                  <p className="text-[11px] text-slate-500 text-left italic">
                    "Saya sudah membaca Al-Qur'an."
                  </p>
                </div>
              </div>

              {/* Fiil Mudhari */}
              <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-800 bg-sky-200/80 px-2.5 py-0.5 rounded-full">
                    Sekarang / Rutinitas
                  </span>
                  <span className="font-arabic text-xl font-bold text-sky-950">
                    الفِعْلُ الْمُضَارِعُ
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  2. Fi'il Mudhari' (Sekarang/Akan)
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Kata kerja yang menunjukkan perbuatan yang sedang berlangsung,
                  rutinitas, atau akan datang (Present / Continuous).
                </p>
                <div className="p-3 bg-white rounded-xl border border-sky-200 text-right space-y-1">
                  <p className="font-arabic text-xl font-bold text-sky-950">
                    أَقْرَأُ الْقُرْآنَ
                  </p>
                  <p className="text-[11px] text-slate-500 text-left italic">
                    "Saya sedang membaca Al-Qur'an."
                  </p>
                </div>
              </div>

              {/* Fiil Amr */}
              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-800 bg-amber-200/80 px-2.5 py-0.5 rounded-full">
                    Kata Perintah
                  </span>
                  <span className="font-arabic text-xl font-bold text-amber-950">
                    فِعْلُ الْأَمْرِ
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  3. Fi'il Amr (Perintah)
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Kata kerja perintah yang ditujukan kepada lawan bicara
                  (mukhathab) untuk melakukan suatu pekerjaan.
                </p>
                <div className="p-3 bg-white rounded-xl border border-amber-200 text-right space-y-1">
                  <p className="font-arabic text-xl font-bold text-amber-950">
                    اِقْرَأِ الْقُرْآنَ!
                  </p>
                  <p className="text-[11px] text-slate-500 text-left italic">
                    "Bacalah Al-Qur'an!"
                  </p>
                </div>
              </div>
            </div>

            {/* Ciri Ciri Fiil Madhi */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Ciri Khas Fi'il Madhi:
              </h4>
              <ul className="text-xs sm:text-sm text-slate-700 space-y-1.5 list-disc list-inside">
                <li>
                  Bentuk dasar (akar kata untuk dhomir هُوَ) berharakat{" "}
                  <strong>fathah</strong> di huruf terakhir (contoh: كَتَبَ،
                  فَحَصَ، جَلَسَ).
                </li>
                <li>
                  Menerima <strong>Ta' Ta'nits Sakinah</strong> (ـتْ) apabila
                  pelakunya perempuan/muannats (contoh: كَتَبَتْ، فَحَصَتْ).
                </li>
                <li>
                  Menerima <strong>Dhamir Mutaharrik Marfu'</strong> (seperti:
                  ـتَ، ـتِ، ـتُ، ـنَا) di akhir kata kerja saat menunjukkan pelaku
                  orang kedua atau pertama.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 2. Tabel Tasrif 6 Dhomir */}
      {activeTab === "tabel" && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-800">
                Tabel Tasrif Lughawi Fi'il Madhi (6 Dhomir Kelas 8)
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Pilih kata kerja untuk melihat perubahan bentuk fi'il madhi
                sesuai dhomirnya:
              </p>
            </div>

            {/* Verb Root Selector */}
            <div className="flex flex-wrap gap-1.5">
              {verbsList.map((v) => (
                <button
                  key={v.root}
                  onClick={() => setSelectedVerbRoot(v.root)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-arabic transition-all cursor-pointer ${
                    selectedVerbRoot === v.root
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  <span>{v.root}</span>
                  <span className="font-sans text-[10px] ml-1 opacity-70">
                    ({v.meaning})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-emerald-50/80 text-emerald-950 text-xs font-bold border-b border-emerald-200">
                  <th className="p-3.5 rounded-tl-xl">Dhamir (الضَّمِيْر)</th>
                  <th className="p-3.5">Arti Pelaku</th>
                  <th className="p-3.5 text-right font-arabic text-sm">
                    Fi'il Madhi ({selectedVerbRoot})
                  </th>
                  <th className="p-3.5">Tanda Akhiran (الزِّيَادَة)</th>
                  <th className="p-3.5 text-right font-arabic text-sm rounded-tr-xl">
                    Contoh Kalimat & Audio
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {TASRIF_FIIL_MADHI.map((row, idx) => {
                  const conjugated = getConjugation(
                    selectedVerbRoot,
                    row.dhomir
                  );
                  const exampleSentence = `${conjugated} ${
                    row.dhomir === "هِيَ"
                      ? "فَاطِمَةُ الدَّوَاءَ"
                      : "الطَّالِبُ الدَّرْسَ"
                  }`;

                  return (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="p-3.5 font-bold font-arabic text-lg text-emerald-900">
                        {row.dhomir}
                      </td>
                      <td className="p-3.5 text-xs text-slate-600">
                        {row.dhomirMeaning}
                      </td>
                      <td className="p-3.5 text-right font-arabic text-2xl font-bold text-emerald-800">
                        {conjugated}
                      </td>
                      <td className="p-3.5">
                        <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-arabic text-sm font-bold">
                          {row.suffix}
                        </span>
                        <span className="text-xs text-slate-400 block mt-0.5">
                          {row.suffixMeaning}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-arabic text-base text-slate-800 font-medium">
                            {exampleSentence}
                          </span>
                          <AudioButton
                            text={exampleSentence}
                            variant="iconOnly"
                            size="sm"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Kaidah Jumlah Fi'liyah */}
      {activeTab === "kaidah" && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-bold text-slate-800">
              Kaidah Emas Jumlah Fi'liyah (قَوَاعِدُ الْجُمْلَةِ الْفِعْلِيَّةِ)
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Perhatikan struktur kalimat dan aturan gender/jumlah yang sering
              keluar pada ujian MTs.
            </p>
          </div>

          {/* Rumus */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 text-center">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block mb-2">
              Rumus Baku Jumlah Fi'liyah
            </span>
            <div className="font-arabic text-2xl md:text-3xl font-extrabold text-emerald-950 flex items-center justify-center gap-3">
              <span>فِعْلٌ (Kata Kerja)</span>
              <span>+</span>
              <span>فَاعِلٌ (Pelaku / Subjek)</span>
              <span>+</span>
              <span className="opacity-80">مَفْعُوْلٌ بِهِ (Objek / Ket.)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Kaidah 1: Kesesuaian Gender */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                Kaidah 1: Kesesuaian Gender (التَّذْكِيْرُ وَالتَّأْنِيْثُ)
              </span>
              <p className="text-xs text-slate-600">
                Fi'il dan Fa'il harus selalu selaras dari sisi jenis kelamin
                (mudzakkar vs muannats).
              </p>
              <div className="space-y-2 pt-2 border-t border-slate-200/80">
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">
                      Subjek Mudzakkar (Laki-laki):
                    </span>
                    <p className="font-arabic text-xl font-bold text-emerald-950">
                      فَحَصَ الطَّبِيْبُ الْمَرِيْضَ
                    </p>
                  </div>
                  <AudioButton text="فَحَصَ الطَّبِيْبُ الْمَرِيْضَ" variant="iconOnly" />
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">
                      Subjek Muannats (Perempuan):
                    </span>
                    <p className="font-arabic text-xl font-bold text-rose-950">
                      فَحَصَتِ الطَّبِيْبَةُ الْمَرِيْضَ
                    </p>
                  </div>
                  <AudioButton text="فَحَصَتِ الطَّبِيْبَةُ الْمَرِيْضَ" variant="iconOnly" />
                </div>
              </div>
            </div>

            {/* Kaidah 2: Fiil Tetap Mufrad */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
              <span className="text-xs font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded-md">
                Kaidah 2: Fi'il Selalu Tunggal (MUFRAD)
              </span>
              <p className="text-xs text-amber-950 font-medium">
                Jika fa'il disebutkan secara zhahir (nama orang/kata benda),
                fi'il di awal kalimat <strong>tetap berbentuk mufrad</strong>,
                meskipun fa'il-nya berbentuk 2 orang (tatsniyah) atau banyak
                (jama')!
              </p>
              <div className="space-y-2 pt-2 border-t border-amber-200/80">
                <div className="p-2.5 bg-white rounded-xl border border-amber-200 text-right">
                  <p className="font-arabic text-lg font-bold text-slate-900">
                    دَخَلَ الطَّالِبُ الْفَصْلَ{" "}
                    <span className="text-xs font-sans text-slate-400">
                      (1 siswa)
                    </span>
                  </p>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-amber-200 text-right">
                  <p className="font-arabic text-lg font-bold text-emerald-800">
                    دَخَلَ الطَّالِبَانِ الْفَصْلَ{" "}
                    <span className="text-xs font-sans text-emerald-600 font-bold">
                      (2 siswa - fi'il tetap mufrad دَخَلَ!)
                    </span>
                  </p>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-amber-200 text-right">
                  <p className="font-arabic text-lg font-bold text-emerald-800">
                    دَخَلَ الطُّلَّابُ الْفَصْلَ{" "}
                    <span className="text-xs font-sans text-emerald-600 font-bold">
                      (Banyak siswa - fi'il tetap mufrad دَخَلَ!)
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Drill Uji Hafalan Tasrif */}
      {activeTab === "latihan" && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-bold text-slate-800">
              Drill Interaktif: Tebak Bentuk Tasrif Fi'il Madhi
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Pilih dhomir dan kata kerja, lalu tebak atau tuliskan bentuk
              perubahan fi'il madhi yang tepat.
            </p>
          </div>

          <div className="p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100 max-w-xl mx-auto space-y-4 text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="text-xs font-bold text-slate-500 uppercase">
                Kata Kerja:
              </span>
              <select
                value={selectedVerbRoot}
                onChange={(e) => {
                  setSelectedVerbRoot(e.target.value);
                  setUserGuess("");
                  setTestResult(null);
                }}
                className="px-3 py-1.5 rounded-xl border border-emerald-300 bg-white font-arabic font-bold text-lg cursor-pointer"
              >
                {verbsList.map((v) => (
                  <option key={v.root} value={v.root}>
                    {v.root} ({v.meaning})
                  </option>
                ))}
              </select>

              <span className="text-xs font-bold text-slate-500 uppercase ml-2">
                Dhamir:
              </span>
              <select
                value={testDhomir}
                onChange={(e) => {
                  setTestDhomir(e.target.value);
                  setUserGuess("");
                  setTestResult(null);
                }}
                className="px-3 py-1.5 rounded-xl border border-emerald-300 bg-white font-arabic font-bold text-lg cursor-pointer"
              >
                {["هُوَ", "هِيَ", "أَنْتَ", "أَنْتِ", "أَنَا", "نَحْنُ"].map(
                  (dh) => (
                    <option key={dh} value={dh}>
                      {dh}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="py-4">
              <span className="text-xs font-bold text-emerald-800 uppercase block mb-1">
                Tantangan:
              </span>
              <p className="text-base font-semibold text-slate-800">
                Ubah kata kerja <span className="font-arabic font-bold text-emerald-700">«{selectedVerbRoot}»</span> untuk dhomir <span className="font-arabic font-bold text-emerald-700">«{testDhomir}»</span>:
              </p>
            </div>

            {/* Multiple Choice Chips for Quick Pick */}
            <div className="flex flex-wrap gap-2 justify-center">
              {["هُوَ", "هِيَ", "أَنْتَ", "أَنْتِ", "أَنَا", "نَحْنُ"].map(
                (dh) => {
                  const form = getConjugation(selectedVerbRoot, dh);
                  return (
                    <button
                      key={dh}
                      onClick={() => {
                        setUserGuess(form);
                        setTestResult(null);
                      }}
                      className={`px-4 py-2 rounded-xl font-arabic text-xl font-bold border transition-all cursor-pointer ${
                        userGuess === form
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                          : "bg-white hover:bg-emerald-50 border-slate-200 text-slate-800"
                      }`}
                    >
                      {form}
                    </button>
                  );
                }
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={handleCheckTasrif}
                disabled={!userGuess}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                Periksa Jawaban
              </button>
            </div>

            {testResult === "correct" && (
              <div className="p-3 bg-emerald-100 rounded-xl border border-emerald-300 text-emerald-900 text-sm font-bold flex items-center justify-center gap-2 animate-in zoom-in-95">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>
                  Mumtaz! Jawabanmu benar: {getConjugation(selectedVerbRoot, testDhomir)}
                </span>
                <AudioButton
                  text={getConjugation(selectedVerbRoot, testDhomir)}
                  variant="iconOnly"
                  size="sm"
                />
              </div>
            )}

            {testResult === "wrong" && (
              <div className="p-3 bg-rose-100 rounded-xl border border-rose-300 text-rose-900 text-sm font-bold flex items-center justify-center gap-2 animate-in shake">
                <span>
                  Belum tepat. Jawaban yang benar adalah:{" "}
                  <strong className="font-arabic text-lg">
                    {getConjugation(selectedVerbRoot, testDhomir)}
                  </strong>
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
