import React from "react";
import { Star, Play, Calendar } from "lucide-react";
import { AnimeRaw, AccentColor, GridLayout } from "../types";
import { ACCENTS } from "../lib/settings";

interface AnimeCardProps {
  key?: string;
  anime: AnimeRaw;
  accent: AccentColor;
  layout?: GridLayout;
}

export function AnimeCard({ anime, accent, layout = 'cols-3' }: AnimeCardProps) {
  const currentAccent = ACCENTS[accent];
  const isList = layout === 'list';

  const typeBadgeColor = "#FF8C00"; // Orange color tag mandated by user

  // Handle click to prevent scrolling glitches
  const href = `#/detail/${anime.slug}`;

  if (isList) {
    return (
      <a
        href={href}
        className="group flex gap-4 bg-[#161616] border border-[#2A2A2A] hover:border-brand-red rounded-xl p-3 transition-all duration-300 hover:scale-[1.01]"
        style={{ borderColor: `var(--hover-border, #2A2A2A)` } as any}
      >
        {/* Poster 2:3 */}
        <div className="relative w-24 sm:w-28 aspect-[2/3] rounded-lg overflow-hidden bg-neutral-900 shrink-0 shadow-md">
          <img
            src={anime.poster}
            alt={anime.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
          {anime.type && (
            <span
              className="absolute top-1.5 left-1.5 text-[9px] font-bold uppercase py-0.5 px-1.5 rounded-full text-white shadow-sm z-10"
              style={{ backgroundColor: typeBadgeColor }}
            >
              {anime.type}
            </span>
          )}
        </div>

        {/* Info detail */}
        <div className="flex flex-col justify-between py-1 flex-1 min-w-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {anime.score && (
                <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold bg-amber-500/15 px-1.5 py-0.5 rounded">
                  <Star className="w-3 h-3 fill-amber-500" />
                  <span>{anime.score}</span>
                </div>
              )}
              {anime.status && (
                <span className="text-[10px] text-neutral-400 font-medium bg-neutral-800 px-1.5 py-0.5 rounded">
                  {anime.status}
                </span>
              )}
            </div>
            <h3 className="text-white font-bold text-sm sm:text-base group-hover:text-brand-red transition-colors duration-300 line-clamp-2"
                style={{ color: `var(--hover-color, #FFFFFF)` } as any}>
              {anime.title}
            </h3>
          </div>

          <div className="text-xs text-neutral-400 space-y-1">
            {anime.episode && (
              <div className="flex items-center gap-1">
                <Play className="w-3.5 h-3.5 text-neutral-500" />
                <span className="text-white font-medium">{anime.episode}</span>
              </div>
            )}
            {anime.release && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                <span>{anime.release}</span>
              </div>
            )}
          </div>
        </div>
      </a>
    );
  }

  // Standard 2:3 Card Grid Layout
  return (
    <a
      href={href}
      className="group flex flex-col bg-[#161616] border border-[#2A2A2A] rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-neutral-700 bg-neutral-900/40 relative"
    >
      {/* Poster area with 2:3 ratio */}
      <div className="relative w-full aspect-[2/3] overflow-hidden bg-neutral-950">
        <img
          src={anime.poster}
          alt={anime.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Gradient backdrop */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 transition-opacity duration-300" />

        {/* Top-left Type badge in orange as requested */}
        {anime.type && (
          <span
            className="absolute top-1.5 left-1.5 text-[8px] font-extrabold uppercase tracking-wider py-0.5 px-1.5 rounded-full text-white shadow-md z-10"
            style={{ backgroundColor: typeBadgeColor }}
          >
            {anime.type}
          </span>
        )}

        {/* Score Overlay */}
        {anime.score && (
          <div className="absolute top-1.5 right-1.5 flex items-center gap-1 text-[10px] text-white font-extrabold bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded border border-neutral-800 shadow-md">
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
            <span>{anime.score}</span>
          </div>
        )}

        {/* Bottom overlays for episode info */}
        {anime.episode && (
          <span className={`absolute bottom-2 left-2 text-[10px] font-bold text-white py-0.5 px-2 rounded-md border border-neutral-850 bg-[#161616]/90 backdrop-blur-md shadow-md`}>
            {anime.episode}
          </span>
        )}
      </div>

      {/* Text Info footer */}
      <div className="p-2 flex flex-col flex-1 bg-gradient-to-b from-[#161616] to-[#111111]">
        <h3 className={`text-xs sm:text-sm font-bold text-neutral-100 line-clamp-2 group-hover:${currentAccent.text} transition-colors duration-300 leading-snug flex-1`}>
          {anime.title}
        </h3>
        
        {(anime.status || anime.release) && (
          <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-neutral-800/60 text-[10px] text-neutral-400">
            <span>{anime.status || ""}</span>
            <span className="truncate max-w-[80px]">{anime.release || ""}</span>
          </div>
        )}
      </div>
    </a>
  );
}
