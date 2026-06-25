import React, { useState, useEffect } from "react";
import { Search as SearchIcon, Play, Frown, Loader2 } from "lucide-react";
import { AnimeRaw, AccentColor, GridLayout, DataSource } from "../types";
import { AnimeCard } from "../components/AnimeCard";
import { ShimmerGrid } from "../components/ShimmerGrid";
import { ACCENTS } from "../lib/settings";

interface SearchProps {
  accent: AccentColor;
  gridLayout: GridLayout;
  dataSource: DataSource;
  initialQuery?: string;
}

export function Search({ accent, gridLayout, dataSource, initialQuery = "" }: SearchProps) {
  const [keyword, setKeyword] = useState(initialQuery);
  const [results, setResults] = useState<AnimeRaw[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const currentAccent = ACCENTS[accent];

  useEffect(() => {
    // Sync keyword if initialQuery parsed from URL hash changes
    if (initialQuery) {
      setKeyword(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    if (!keyword.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const delayDebounce = setTimeout(async () => {
      try {
        const response = await fetch(`/api/proxy?route=search&source=${dataSource}&keyword=${encodeURIComponent(keyword)}`);
        if (!response.ok) {
          throw new Error("Gagal memproses pencarian anime");
        }
        const data = await response.json();
        setResults(data.animes || []);
      } catch (err: any) {
        console.error(err);
        setError("Gagal melakukan pencarian. Silakan periksa koneksi internet Anda.");
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce as requested

    return () => clearTimeout(delayDebounce);
  }, [keyword, dataSource]);

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="space-y-2 text-center max-w-xl mx-auto pt-4">
        <h1 className="text-3xl font-black text-white font-display uppercase tracking-widest leading-none">
          CARI ANIME
        </h1>
        <p className="text-sm text-neutral-400">
          Temukan ribuan serial anime subtitle Indonesia terlengkap dan terpopuler.
        </p>
      </div>

      {/* Input Search Box Area */}
      <div className="max-w-2xl mx-auto relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-brand-red transition-colors duration-300">
          <SearchIcon className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Ketik judul anime, genre, atau karakter..."
          className="w-full pl-12 pr-12 py-3.5 bg-[#161616] border border-[#2A2A2A] rounded-2xl text-white text-base focus:outline-none focus:ring-2 focus:ring-red-600 transition-all duration-300 placeholder-neutral-500 font-medium"
          style={{
            borderColor: keyword ? currentAccent.hex : '#2A2A2A'
          }}
        />
        {loading && (
          <div className="absolute inset-y-0 right-4 flex items-center text-neutral-400">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        )}
      </div>

      {/* Results Display Grid */}
      <div className="space-y-4">
        {keyword.trim() && (
          <div className="border-b border-neutral-900 pb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-neutral-300">
              Hasil Pencarian untuk: <span className={`${currentAccent.text} font-black`}>"{keyword}"</span>
            </h2>
            <span className="text-xs text-neutral-500 font-medium font-mono bg-neutral-950 px-2 py-1 rounded border border-neutral-900">
              {results.length} Kecocokan
            </span>
          </div>
        )}

        {error && (
          <div className="p-8 text-center bg-[#161616] rounded-2xl border border-neutral-850 text-neutral-500 max-w-md mx-auto">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {loading && results.length === 0 ? (
          <ShimmerGrid count={8} layout={gridLayout} />
        ) : !keyword.trim() ? (
          <div className="py-24 text-center text-neutral-500 text-sm max-w-sm mx-auto">
            <SearchIcon className="w-12 h-12 mx-auto text-neutral-700 stroke-1 mb-3" />
            <p className="font-semibold text-neutral-400">Belum ada pencarian</p>
            <p className="text-xs text-neutral-500 mt-1">Ketik kata kunci di atas untuk mencari anime kesayangan Anda.</p>
          </div>
        ) : results.length === 0 && !loading ? (
          <div className="py-24 text-center text-neutral-500 text-sm max-w-sm mx-auto">
            <Frown className="w-12 h-12 mx-auto text-neutral-700 stroke-1 mb-3" />
            <p className="font-semibold text-neutral-400">Anime tidak ditemukan</p>
            <p className="text-xs text-neutral-500 mt-1">Coba kata kunci lain atau gunakan fitur eklporasi genre di tab Explore.</p>
          </div>
        ) : (
          <div className={`grid gap-4 sm:gap-6 ${
            gridLayout === 'cols-2'
              ? 'grid-cols-2 lg:grid-cols-4'
              : gridLayout === 'list'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
          }`}>
            {results.map((anime) => (
              <AnimeCard
                key={anime.slug}
                anime={anime}
                accent={accent}
                layout={gridLayout}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
