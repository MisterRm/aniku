import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Info } from "lucide-react";
import { FeaturedAnime, AccentColor } from "../types";
import { ACCENTS } from "../lib/settings";

interface HeroCarouselProps {
  featured: FeaturedAnime[];
  accent: AccentColor;
}

export function HeroCarousel({ featured, accent }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const currentAccent = ACCENTS[accent];

  useEffect(() => {
    if (featured.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featured.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [featured]);

  if (!featured || featured.length === 0) {
    return (
      <div className="w-full h-[350px] sm:h-[450px] rounded-3xl bg-[#161616] animate-pulse flex items-center justify-center border border-[#2A2A2A]">
        <div className="text-neutral-500 font-medium">Memuat Anime Unggulan...</div>
      </div>
    );
  }

  const active = featured[activeIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveIndex((prev) => (prev - 1 + featured.length) % featured.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveIndex((prev) => (prev + 1) % featured.length);
  };

  return (
    <div className="relative w-full h-[320px] sm:h-[450px] rounded-3xl overflow-hidden group shadow-2xl border border-neutral-900 bg-neutral-950">
      {/* Background Poster Cover Image */}
      <div className="absolute inset-x-0 inset-y-0 select-none">
        <img
          src={active.anime_poster}
          alt={active.anime_title}
          className="w-full h-full object-cover object-center transform scale-102 transition-transform duration-[2000s]"
          key={active.id}
          referrerPolicy="no-referrer"
        />
        {/* Soft atmospheric gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/40 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
      </div>

      {/* Info Overlay Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12 z-20">
        <div className="max-w-2xl space-y-3">
          <span className={`inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded bg-black/60 backdrop-blur-md border border-neutral-700/50 ${currentAccent.text}`}>
            #ANIKU FEATURED UNGGULAN
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white font-display tracking-tight leading-none drop-shadow-md">
            {active.anime_title}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 drop-shadow max-w-lg leading-relaxed line-clamp-2">
            Ikuti perjalanan seru &amp; tonton langsung episode terbarunya sekarang. Subtitle Bahasa Indonesia, gratis selamanya.
          </p>

          <div className="flex items-center gap-3 pt-3">
            <a
              href={`#/detail/${active.anime_slug}`}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white ${currentAccent.glowingBg} hover:opacity-90 transform active:scale-95 transition-all duration-300`}
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Tonton Sekarang</span>
            </a>
            <a
              href={`#/detail/${active.anime_slug}`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-neutral-300 bg-black/50 hover:bg-neutral-800/80 hover:text-white transition-colors duration-300 border border-neutral-800"
            >
              <Info className="w-4 h-4" />
              <span>Detail Info</span>
            </a>
          </div>
        </div>
      </div>

      {/* Manual Slide Controls */}
      {featured.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-neutral-800/40 z-30"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-neutral-800/40 z-30"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Bullet Indicators */}
          <div className="absolute bottom-6 right-8 flex items-center gap-2 z-30">
            {featured.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === activeIndex
                    ? `w-8 ${currentAccent.bg}`
                    : 'w-2.5 bg-neutral-600 hover:bg-neutral-405'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
