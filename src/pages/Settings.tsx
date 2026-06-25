import React from "react";
import { Palette, Layers, Type, Sliders, ExternalLink, Heart, Send, Check } from "lucide-react";
import { AccentColor, TextSize, GridLayout, DataSource } from "../types";
import { ACCENTS, saveSettings } from "../lib/settings";

interface SettingsProps {
  accent: AccentColor;
  setAccent: (val: AccentColor) => void;
  textSize: TextSize;
  setTextSize: (val: TextSize) => void;
  gridLayout: GridLayout;
  setGridLayout: (val: GridLayout) => void;
  dataSource: DataSource;
  setDataSource: (val: DataSource) => void;
}

export function Settings({
  accent,
  setAccent,
  textSize,
  setTextSize,
  gridLayout,
  setGridLayout,
  dataSource,
  setDataSource
}: SettingsProps) {
  const currentAccent = ACCENTS[accent];

  const ACCENT_OPTIONS: { id: AccentColor; name: string; class: string }[] = [
    { id: 'red', name: 'Cinema Red', class: 'bg-[#E53935]' },
    { id: 'green', name: 'Forest Green', class: 'bg-[#4CAF50]' },
    { id: 'blue', name: 'Ocean Blue', class: 'bg-[#2196F3]' },
    { id: 'purple', name: 'Cosmic Purple', class: 'bg-[#9C27B0]' },
    { id: 'orange', name: 'Amber Orange', class: 'bg-[#FF9800]' },
  ];

  const GRID_OPTIONS: { id: GridLayout; name: string }[] = [
    { id: 'cols-2', name: '2 Kolom Grid' },
    { id: 'cols-3', name: '3 Kolom / Standar' },
    { id: 'list', name: 'Tampilan Baris (List)' },
  ];

  const TEXT_OPTIONS: { id: TextSize; name: string }[] = [
    { id: 'kecil', name: 'Kecil (Small)' },
    { id: 'sedang', name: 'Sedang (Normal)' },
    { id: 'besar', name: 'Besar (Large)' },
  ];

  const SOURCE_OPTIONS: { id: DataSource; name: string; desc: string }[] = [
    { id: 'Dayynime-v1', name: 'Animasu Server (Dayynime-v1)', desc: 'Kecepatan load cepat, streaming responsif, sub Indonesia.' },
    { id: 'Dayynime-v2', name: 'Samehadaku Server (Dayynime-v2)', desc: 'Database sangat lengkap, rilis tercepat, pilihan resolusi murni.' },
  ];

  // Handle Updates
  const updateAccent = (newAccent: AccentColor) => {
    setAccent(newAccent);
    saveSettings(newAccent, textSize, gridLayout, dataSource);
  };

  const updateGridLayout = (newLayout: GridLayout) => {
    setGridLayout(newLayout);
    saveSettings(accent, textSize, newLayout, dataSource);
  };

  const updateTextSize = (newSize: TextSize) => {
    setTextSize(newSize);
    saveSettings(accent, newSize, gridLayout, dataSource);
  };

  const updateDataSource = (newSource: DataSource) => {
    setDataSource(newSource);
    saveSettings(accent, textSize, gridLayout, newSource);
    
    // Refresh page briefly to flush API cache states
    setTimeout(() => {
      window.location.reload();
    }, 150);
  };

  return (
    <div className="space-y-8 pb-16 max-w-3xl mx-auto pt-4">
      {/* Header */}
      <div className="flex border-b border-neutral-900 pb-3 items-center gap-2.5">
        <div className={`p-1.5 rounded-lg bg-neutral-900 ${currentAccent.text}`}>
          <Sliders className="w-5 h-5" />
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-wider">
          Pengaturan Aplikasi
        </h1>
      </div>

      <div className="space-y-6">
        {/* Sumber Data Panel */}
        <div className="bg-[#161616] p-5 sm:p-6 rounded-3xl border border-[#2A2A2A] space-y-4">
          <div className="flex items-center gap-2 text-white font-bold border-b border-neutral-900 pb-2.5">
            <Layers className="w-5 h-5 text-neutral-500" />
            <span>Sumber Data / API Provider</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {SOURCE_OPTIONS.map((opt) => {
              const isSelected = dataSource === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => updateDataSource(opt.id)}
                  className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all duration-300 ${
                    isSelected
                      ? `bg-neutral-950 text-white ${currentAccent.border} ring-1 ${currentAccent.border}`
                      : "bg-neutral-900/40 text-neutral-400 border-neutral-850 hover:border-neutral-700 hover:text-neutral-250"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border border-neutral-800 shrink-0 mt-0.5 flex items-center justify-center ${
                    isSelected ? currentAccent.bg : ''
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3.5]" />}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-white font-bold text-sm sm:text-base">{opt.name}</h4>
                    <p className="text-xs text-neutral-500 font-medium leading-relaxed">{opt.desc}</p>
                    {isSelected && (
                      <span className="inline-block text-[9px] bg-red-650/15 text-red-500 font-bold px-1.5 py-0.5 rounded mt-1 border border-red-950/20">
                        Aktif Sekarang (Memuat Ulang)
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Color Accent Settings panel */}
        <div className="bg-[#161616] p-5 sm:p-6 rounded-3xl border border-[#2A2A2A] space-y-4">
          <div className="flex items-center gap-2 text-white font-bold border-b border-neutral-900 pb-2.5">
            <Palette className="w-5 h-5 text-neutral-500" />
            <span>Aksen Warna Tema</span>
          </div>
          
          <div className="flex flex-wrap gap-2.5">
            {ACCENT_OPTIONS.map((opt) => {
              const isSelected = accent === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => updateAccent(opt.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs sm:text-sm font-semibold transition-all duration-300 ${
                    isSelected
                      ? `bg-neutral-950 text-white ${currentAccent.border} ring-1 ${currentAccent.border} font-bold`
                      : "bg-neutral-900/40 text-neutral-400 border-neutral-850 hover:border-neutral-700 hover:text-white"
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full ${opt.class} shrink-0`} />
                  <span>{opt.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Layout Grid Settings */}
        <div className="bg-[#161616] p-5 sm:p-6 rounded-3xl border border-[#2A2A2A] space-y-4">
          <div className="flex items-center gap-2 text-white font-bold border-b border-neutral-900 pb-2.5">
            <Layers className="w-5 h-5 text-neutral-500" />
            <span>Format Tata Letak Grid</span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {GRID_OPTIONS.map((opt) => {
              const isSelected = gridLayout === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => updateGridLayout(opt.id)}
                  className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all duration-300 ${
                    isSelected
                      ? `bg-neutral-950 text-white ${currentAccent.border} ring-1 ${currentAccent.border} font-bold`
                      : "bg-neutral-900/40 text-neutral-400 border-neutral-850 hover:border-neutral-700 hover:text-white"
                  }`}
                >
                  {opt.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Text Size options panel */}
        <div className="bg-[#161616] p-5 sm:p-6 rounded-3xl border border-[#2A2A2A] space-y-4">
          <div className="flex items-center gap-2 text-white font-bold border-b border-neutral-900 pb-2.5">
            <Type className="w-5 h-5 text-neutral-500" />
            <span>Ukuran Fontasi Teks</span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {TEXT_OPTIONS.map((opt) => {
              const isSelected = textSize === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => updateTextSize(opt.id)}
                  className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all duration-300 ${
                    isSelected
                      ? `bg-neutral-950 text-white ${currentAccent.border} ring-1 ${currentAccent.border} font-bold`
                      : "bg-neutral-900/40 text-neutral-400 border-neutral-850 hover:border-neutral-700 hover:text-white"
                  }`}
                >
                  {opt.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Application Metadata Info card */}
        <div className="bg-[#161616] p-5 sm:p-6 rounded-3xl border border-[#2A2A2A] space-y-4">
          <div className="border-b border-neutral-900 pb-2.5 text-white font-bold">Informasi Aplikasi &amp; Sosial</div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-neutral-400">
            <div className="space-y-1">
              <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">Versi Web</span>
              <span className="text-white text-sm font-bold block">2.4.0 (Vite &bull; Full-Stack React)</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">Lisensi</span>
              <span className="text-white text-sm font-bold block">Sankavollerei &bull; Dayynime developer group</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-900">
            <a
              href="https://t.me/Dayynime"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 border border-neutral-850 hover:border-neutral-700 text-[#2196F3] font-bold text-xs rounded-xl"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Telegram Resmi</span>
              <ExternalLink className="w-3 h-3 text-neutral-500" />
            </a>
            <a
              href="https://saweria.co/Dayynime"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 border border-neutral-850 hover:border-neutral-700 text-amber-500 font-bold text-xs rounded-xl"
            >
              <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
              <span>Saweria</span>
              <ExternalLink className="w-3 h-3 text-neutral-500" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
