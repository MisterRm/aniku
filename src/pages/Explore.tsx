import React, { useState, useEffect } from "react";
import { Compass, Sparkles, Film, CheckCircle, Clock, BookOpen, Layers, ChevronLeft, ChevronRight, Hash } from "lucide-react";
import { AnimeRaw, AccentColor, GridLayout, DataSource, ActiveTab } from "../types";
import { AnimeCard } from "../components/AnimeCard";
import { ShimmerGrid } from "../components/ShimmerGrid";
import { ACCENTS } from "../lib/settings";

interface ExploreProps {
  accent: AccentColor;
  gridLayout: GridLayout;
  dataSource: DataSource;
  initialTab?: ActiveTab;
}

export function Explore({ accent, gridLayout, dataSource, initialTab = 'Popular' }: ExploreProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>(initialTab);
  const [genres, setGenres] = useState<{ title: string; slug: string }[]>([]);
  const [activeGenreSlug, setActiveGenreSlug] = useState<string>("");
  const [activeGenreTitle, setActiveGenreTitle] = useState<string>("");
  
  const [animes, setAnimes] = useState<AnimeRaw[]>([]);
  const [pagination, setPagination] = useState({ currentPage: 1, hasNext: false, hasPrev: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentAccent = ACCENTS[accent];

  // List of Tabs with metadata
  const tabs = [
    { id: 'Popular' as ActiveTab, title: 'Terpopuler', icon: Sparkles },
    { id: 'Movies' as ActiveTab, title: 'Film / Movies', icon: Film },
    { id: 'Ongoing' as ActiveTab, title: 'Ongoing', icon: Clock },
    { id: 'Completed' as ActiveTab, title: 'Tamat / Completed', icon: CheckCircle },
    { id: 'Latest' as ActiveTab, title: 'Terbaru', icon: BookOpen },
    { id: 'Genres' as ActiveTab, title: 'Semua Genre', icon: Layers },
  ];

  // Load genres
  useEffect(() => {
    async function fetchGenres() {
      try {
        const response = await fetch(`/api/proxy?route=genres&source=${dataSource}`);
        if (response.ok) {
          const data = await response.json();
          setGenres(data);
          
          // Pre-select first genre if we are under Genres tab
          if (data.length > 0 && !activeGenreSlug) {
            setActiveGenreSlug(data[0].slug);
            setActiveGenreTitle(data[0].title);
          }
        }
      } catch (err) {
        console.error("Gagal mengambil daftar genre:", err);
      }
    }
    fetchGenres();
  }, [dataSource]);

  // Load anime items whenever tab, page, or active genre modifications lock
  useEffect(() => {
    // If Genres tab but no genre slug preselected, wait
    if (activeTab === 'Genres' && !activeGenreSlug) return;

    async function fetchExploreData() {
      setLoading(true);
      setError(null);
      try {
        let url = `/api/proxy?route=explore&source=${dataSource}&tab=${activeTab}&page=${pagination.currentPage}`;
        if (activeTab === 'Genres' && activeGenreSlug) {
          url += `&genreSlug=${activeGenreSlug}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Gagal mengambil data eksplorasi");
        }
        const data = await response.json();
        setAnimes(data.animes || []);
        setPagination({
          currentPage: data.pagination?.currentPage || pagination.currentPage,
          hasNext: !!data.pagination?.hasNext,
          hasPrev: !!data.pagination?.hasPrev,
        });
      } catch (err: any) {
        console.error(err);
        setError("Gagal memuat daftar anime. Silakan muat ulang halaman ini.");
      } finally {
        setLoading(false);
      }
    }

    fetchExploreData();
  }, [activeTab, activeGenreSlug, pagination.currentPage, dataSource]);

  // Handle Tab Switch
  const handleTabChange = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    setPagination({ currentPage: 1, hasNext: false, hasPrev: false });
    setError(null);
    setAnimes([]);
  };

  // Handle Genre Item Click
  const handleGenreClick = (slug: string, title: string) => {
    setActiveGenreSlug(slug);
    setActiveGenreTitle(title);
    setPagination({ currentPage: 1, hasNext: false, hasPrev: false });
    setAnimes([]);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header section */}
      <div className="flex border-b border-neutral-900 pb-3 items-center gap-2.5">
        <div className={`p-1.5 rounded-lg bg-neutral-900 ${currentAccent.text}`}>
          <Compass className="w-5 h-5" />
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-wider">
          Jelajahi Anime
        </h1>
      </div>

      {/* Tabs list slider / wrapped flex */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 shrink-0 border ${
                isActive
                  ? `${currentAccent.bg} text-white border-transparent ${currentAccent.glowingBg}`
                  : "bg-neutral-900 text-neutral-400 border-neutral-850 hover:text-white hover:border-neutral-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.title}</span>
            </button>
          );
        })}
      </div>

      {/* Genres sub-panel selection if tab is Genres */}
      {activeTab === 'Genres' && genres.length > 0 && (
        <div className="space-y-4 bg-[#161616] border border-[#2A2A2A] rounded-2xl p-4">
          <h3 className="text-white text-xs font-bold uppercase tracking-wider text-neutral-400">
            Daftar Genre ({genres.length})
          </h3>
          <div className="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto pr-1">
            {genres.map((g) => {
              const isSelected = activeGenreSlug === g.slug;
              return (
                <button
                  key={g.slug}
                  onClick={() => handleGenreClick(g.slug, g.title)}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all duration-300 ${
                    isSelected
                      ? `bg-neutral-100 text-black border-transparent shadow font-bold`
                      : "bg-neutral-950 text-neutral-400 border-neutral-900 hover:text-white hover:border-neutral-700"
                  }`}
                >
                  <Hash className="w-3 h-3 text-neutral-500" />
                  <span>{g.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Subheading of active category */}
      <div className="flex justify-between items-center border-b border-neutral-950 pb-2">
        <h2 className="text-white text-base font-bold flex items-center gap-2">
          <span>Kategori:</span>
          <span className={`${currentAccent.text} uppercase font-extrabold font-display tracking-widest`}>
            {activeTab === 'Genres' ? `GENRE "${activeGenreTitle}"` : tabs.find(t => t.id === activeTab)?.title}
          </span>
        </h2>
        
        {/* Simple count info */}
        {!loading && animes.length > 0 && (
          <span className="text-xs text-neutral-400 font-medium">
            Halaman {pagination.currentPage}
          </span>
        )}
      </div>

      {/* Main feed grids list */}
      {error ? (
        <div className="p-8 text-center bg-[#161616] rounded-2xl border border-neutral-850 text-neutral-500 max-w-sm mx-auto">
          <p>{error}</p>
        </div>
      ) : loading ? (
        <ShimmerGrid count={10} layout={gridLayout} />
      ) : animes.length === 0 ? (
        <div className="py-16 text-center text-neutral-500 text-sm">
          Tidak ada anime yang ditemukan untuk kategori ini.
        </div>
      ) : (
        <>
          <div className={`grid gap-4 sm:gap-6 ${
            gridLayout === 'cols-2'
              ? 'grid-cols-2 lg:grid-cols-4'
              : gridLayout === 'list'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
          }`}>
            {animes.map((anime) => (
              <AnimeCard
                key={anime.slug}
                anime={anime}
                accent={accent}
                layout={gridLayout}
              />
            ))}
          </div>

          {/* Simple and elegant pagination controls */}
          {(pagination.hasNext || pagination.hasPrev) && (
            <div className="flex items-center justify-center gap-4 pt-6">
              <button
                onClick={() => setPagination(p => ({ ...p, currentPage: Math.max(1, p.currentPage - 1) }))}
                disabled={!pagination.hasPrev}
                className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>
              
              <span className="text-xs sm:text-sm text-neutral-400 font-bold font-mono">
                {pagination.currentPage}
              </span>

              <button
                onClick={() => setPagination(p => ({ ...p, currentPage: p.currentPage + 1 }))}
                disabled={!pagination.hasNext}
                className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all"
              >
                <span>Selanjutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
