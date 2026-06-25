import React, { useState, useEffect } from "react";
import { Sparkles, Tv, ReceiptText, AlertCircle, ArrowDownToLine, TrendingUp, CalendarDays, Clapperboard, Star, Radio, CheckCircle } from "lucide-react";
import { AnimeRaw, FeaturedAnime, Announcement, AccentColor, GridLayout, DataSource } from "../types";
import { HeroCarousel } from "../components/HeroCarousel";
import { APKStickyBanner } from "../components/APKStickyBanner";
import { AnimeCard } from "../components/AnimeCard";
import { ShimmerGrid } from "../components/ShimmerGrid";
import { ACCENTS } from "../lib/settings";

interface HomeProps {
  accent: AccentColor;
  gridLayout: GridLayout;
  dataSource: DataSource;
}

export function Home({ accent, gridLayout, dataSource }: HomeProps) {
  const [featured, setFeatured] = useState<FeaturedAnime[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [ongoing, setOngoing] = useState<AnimeRaw[]>([]);
  const [recent, setRecent] = useState<AnimeRaw[]>([]);
  const [popular, setPopular] = useState<AnimeRaw[]>([]);
  const [todaySchedule, setTodaySchedule] = useState<AnimeRaw[]>([]);
  const [movies, setMovies] = useState<AnimeRaw[]>([]);
  const [ongoingBanner, setOngoingBanner] = useState<AnimeRaw[]>([]);
  const [completed, setCompleted] = useState<AnimeRaw[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingExtra, setLoadingExtra] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentAccent = ACCENTS[accent];

  // Computed setelah loading selesai — fallback ke ongoing jika featured kosong
  const heroItems = featured.length > 0
    ? featured.map(f => ({
        anime_slug: f.anime_slug,
        anime_title: f.anime_title,
        anime_poster: f.anime_poster,
      }))
    : ongoing.slice(0, 8).map(a => ({
        anime_slug: a.slug,
        anime_title: a.title,
        anime_poster: a.poster,
      }));

  // Native Banner inject — tunggu DOM siap
  useEffect(() => {
    if (document.getElementById("ad-native-script")) return;
    const sn = document.createElement("script");
    sn.async = true;
    sn.setAttribute("data-cfasync", "false");
    sn.src = "https://pl29823357.effectivecpmnetwork.com/266ad41fec67e05bff96bd3047d66269/invoke.js";
    sn.id = "ad-native-script";
    document.body.appendChild(sn);
  }, []);

  useEffect(() => {
    async function fetchHomeData() {
      setLoading(true);
      setLoadingExtra(true);
      setError(null);
      try {
        // Fetch Supabase data & Anime APIs in parallel
        const [resFeatured, resAnnounce, resHome] = await Promise.all([
          fetch("/api/proxy?route=featured_anime"),
          fetch("/api/proxy?route=announcements"),
          fetch(`/api/proxy?route=home&source=${dataSource}`)
        ]);

        if (resFeatured.ok) {
          const featuredData = await resFeatured.json();
          setFeatured(featuredData);
        }

        if (resAnnounce.ok) {
          const announceData = await resAnnounce.json();
          setAnnouncements(announceData);
        }

        if (!resHome.ok) {
          throw new Error("Gagal mengambil data beranda anime");
        }

        const homeData = await resHome.json();
        setOngoing(homeData.ongoing || []);
        setOngoingBanner((homeData.ongoing || []).slice(0, 8));
        setRecent(homeData.recent || []);

        // Fetch popular, today schedule, movies secara paralel
        const todayKey = ["minggu","senin","selasa","rabu","kamis","jum'at","sabtu"][new Date().getDay()];

        const [resPopular, resSchedule, resMovies, resCompleted] = await Promise.all([
          fetch(`/api/proxy?route=explore&source=${dataSource}&tab=Popular&page=1`),
          fetch(`/api/proxy?route=schedule&source=${dataSource}`),
          fetch(`/api/proxy?route=explore&source=${dataSource}&tab=Movies&page=1`),
          fetch(`/api/proxy?route=explore&source=${dataSource}&tab=Completed&page=1`),
        ]);

        if (resPopular.ok) {
          const d = await resPopular.json();
          setPopular((d.animes || []).slice(0, 9));
        }
        if (resSchedule.ok) {
          const d = await resSchedule.json();
          const dayList = d[todayKey] || d["jumat"] || [];
          setTodaySchedule(dayList.slice(0, 8));
        }
        if (resMovies.ok) {
          const d = await resMovies.json();
          setMovies((d.animes || []).slice(0, 12));
        }
        if (resCompleted.ok) {
          const d = await resCompleted.json();
          setCompleted((d.animes || []).slice(0, 8));
        }
        setLoadingExtra(false);

      } catch (err: any) {
        console.error(err);
        setError("Sambungan terputus. Silakan ganti sumber data atau muat ulang halaman.");
      } finally {
        setLoading(false);
        setLoadingExtra(false);
      }
    }

    fetchHomeData();
  }, [dataSource]);

  return (
    <div className="space-y-8 pb-12">
      {/* Announcement Banner */}
      {announcements.length > 0 && (
        <div className="space-y-3">
          {announcements.map((announce) => (
            <div
              key={announce.id}
              className="bg-neutral-900 border-l-4 border-amber-500 p-4 rounded-r-2xl flex items-start gap-3 shadow-md"
            >
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-bold text-sm sm:text-base leading-tight">
                  {announce.title}
                </h4>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1 leading-relaxed">
                  {announce.message}
                </p>
                {announce.download_url && (
                  <a
                    href={announce.download_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2.5 text-xs text-amber-500 font-bold hover:underline"
                  >
                    <ArrowDownToLine className="w-3.5 h-3.5" />
                    <span>Download APK Update</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Featured Slider */}
      {!loading && heroItems.length > 0 && (
        <HeroCarousel featured={heroItems as any} accent={accent} />
      )}
      <APKStickyBanner />

      {/* Ongoing Releases Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-lg bg-neutral-900 ${currentAccent.text}`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-wide">
              Sedang Tayang (Ongoing)
            </h2>
          </div>
          <a
            href="#/explore?tab=Ongoing"
            className={`text-xs sm:text-sm font-bold ${currentAccent.text} hover:underline`}
          >
            Lihat Semua
          </a>
        </div>

        {error && ongoing.length === 0 ? (
          <div className="p-8 text-center bg-[#161616] rounded-2xl border border-neutral-850 text-neutral-400 space-y-2">
            <p>{error}</p>
          </div>
        ) : loading ? (
          <ShimmerGrid count={5} layout={gridLayout} />
        ) : ongoing.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 text-sm">
            Tidak ada rilis ongoing saat ini.
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4 sm:-mx-6 sm:px-6">
            {ongoing.slice(0, 15).map((anime) => (
              <div key={anime.slug} className="shrink-0 w-[120px] sm:w-[140px]">
                <AnimeCard anime={anime} accent={accent} layout="cols-3" />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent Releases Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-lg bg-neutral-900 ${currentAccent.text}`}>
              <Tv className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-wide">
              Episode Terbaru (Recent)
            </h2>
          </div>
          <a
            href="#/explore?tab=Latest"
            className={`text-xs sm:text-sm font-bold ${currentAccent.text} hover:underline`}
          >
            Lihat Semua
          </a>
        </div>

        {error && recent.length === 0 ? (
          <div className="p-8 text-center bg-[#161616] rounded-2xl border border-neutral-850 text-neutral-400">
            <p>{error}</p>
          </div>
        ) : loading ? (
          <ShimmerGrid count={10} layout={gridLayout} />
        ) : recent.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 text-sm">
            Tidak ada rilis terbaru ditemukan.
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4 sm:-mx-6 sm:px-6">
            {recent.slice(0, 20).map((anime) => (
              <div key={anime.slug} className="shrink-0 w-[120px] sm:w-[140px]">
                <AnimeCard anime={anime} accent={accent} layout="cols-3" />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Native Banner Ad — antara Recent dan Populer */}
      <div id="container-266ad41fec67e05bff96bd3047d66269" className="w-full min-h-[50px]" />

      {/* ── SECTION: Anime Populer ── */}
      <section className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-lg bg-neutral-900 ${currentAccent.text}`}>
              <TrendingUp className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-wide">
              Anime Populer
            </h2>
          </div>
          <a href="#/explore?tab=Popular" className={`text-xs sm:text-sm font-bold ${currentAccent.text} hover:underline`}>
            Lihat Semua
          </a>
        </div>

        {/* Grid 3 kolom dengan ranking badge */}
        {loadingExtra ? (
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-neutral-900 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : popular.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 text-sm">Data populer tidak tersedia.</div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {popular.map((anime, index) => (
              <a
                key={anime.slug}
                href={`#/detail/${anime.slug}`}
                className="group relative flex flex-col bg-[#161616] border border-[#2A2A2A] rounded-xl overflow-hidden hover:border-neutral-600 transition-all duration-300 hover:scale-[1.02]"
              >
                {/* Poster 2:3 */}
                <div className="relative w-full aspect-[2/3] overflow-hidden bg-neutral-950">
                  <img
                    src={anime.poster}
                    alt={anime.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  {/* Gradient bawah */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                  {/* Badge ranking — kiri atas, menimpa type badge */}
                  <div className={`absolute top-0 left-0 w-8 h-8 flex items-center justify-center font-black text-sm text-white rounded-br-xl ${
                    index === 0 ? 'bg-amber-500' :
                    index === 1 ? 'bg-neutral-400' :
                    index === 2 ? 'bg-amber-700' :
                    'bg-[#E53935]'
                  }`}>
                    #{index + 1}
                  </div>

                  {/* Score kanan atas */}
                  {anime.score && (
                    <div className="absolute top-1.5 right-1.5 flex items-center gap-1 text-[10px] text-white font-bold bg-black/70 px-1.5 py-0.5 rounded">
                      <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                      <span>{anime.score}</span>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-2">
                  <p className="text-[10px] sm:text-xs font-bold text-neutral-100 line-clamp-2 leading-snug">
                    {anime.title}
                  </p>
                  {anime.type && (
                    <span className="text-[9px] text-neutral-500 mt-0.5 block">{anime.type}</span>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* ── SECTION: Jadwal Hari Ini (Yoredaze style) ── */}
      <section className="space-y-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[11px] text-neutral-500 uppercase tracking-widest mb-0.5">Estimated</p>
            <h2 className="text-xl font-black text-white uppercase tracking-wide">
              Jadwal Hari Ini
            </h2>
            <p className={`text-sm font-bold ${currentAccent.text}`}>
              {["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"][new Date().getDay()]}
            </p>
          </div>
          <a href="#/schedule" className="text-xs text-neutral-500 hover:text-white border border-neutral-700 hover:border-neutral-500 px-3 py-1.5 rounded-lg transition-all">
            Jadwal Lengkap
          </a>
        </div>

        {/* Table-style list */}
        {loadingExtra ? (
          <div className="rounded-2xl overflow-hidden border border-[#2A2A2A]">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 bg-neutral-900 animate-pulse border-b border-[#1A1A1A] last:border-0" />
            ))}
          </div>
        ) : todaySchedule.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 text-sm bg-[#111111] rounded-2xl border border-[#2A2A2A]">
            Tidak ada jadwal tayang hari ini.
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden border border-[#2A2A2A]">
            {todaySchedule.map((anime, index) => (
              <a
                key={anime.slug}
                href={`#/detail/${anime.slug}`}
                className="group flex items-center gap-4 bg-[#111111] hover:bg-[#1A1A1A] px-4 py-3 border-b border-[#1E1E1E] last:border-0 transition-colors duration-150"
              >
                {/* Jam estimasi kiri */}
                <div className="shrink-0 w-12 text-center">
                  {anime.estimation ? (
                    <span className="text-sm font-bold text-white tabular-nums">{anime.estimation}</span>
                  ) : (
                    <span className="text-xs text-neutral-600 tabular-nums">--:--</span>
                  )}
                </div>

                {/* Divider vertikal */}
                <div className="w-px h-6 bg-[#2A2A2A] shrink-0" />

                {/* Judul */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-200 group-hover:text-white line-clamp-1 transition-colors">
                    {anime.title}
                  </p>
                </div>

                {/* Badge episode kanan */}
                <div className="shrink-0">
                  {anime.episode ? (
                    <span className="text-[10px] font-bold text-neutral-300 border border-[#3A3A3A] group-hover:border-neutral-500 px-2 py-1 rounded-md tabular-nums transition-colors">
                      {anime.episode.replace('Episode ', 'EP ')}
                    </span>
                  ) : (
                    <span className="text-[10px] text-neutral-600 border border-[#2A2A2A] px-2 py-1 rounded-md">
                      —
                    </span>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* ── SECTION: Film Anime ── */}
      <section className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-lg bg-neutral-900 ${currentAccent.text}`}>
              <Clapperboard className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-wide">
              Film Anime
            </h2>
          </div>
          <a href="#/explore?tab=Movies" className={`text-xs sm:text-sm font-bold ${currentAccent.text} hover:underline`}>
            Lihat Semua
          </a>
        </div>

        {/* Horizontal scroll landscape cards */}
        {loadingExtra ? (
          <div className="flex gap-3 overflow-x-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="shrink-0 w-[200px] sm:w-[240px] aspect-video bg-neutral-900 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 text-sm">Film tidak tersedia.</div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4 sm:-mx-6 sm:px-6">
            {movies.map((anime) => (
              <a
                key={anime.slug}
                href={`#/detail/${anime.slug}`}
                className="group relative shrink-0 w-[200px] sm:w-[240px] rounded-xl overflow-hidden bg-neutral-900 border border-[#2A2A2A] hover:border-neutral-600 transition-all duration-300 hover:scale-[1.02]"
              >
                {/* Poster landscape 16:9 */}
                <div className="relative w-full aspect-video overflow-hidden">
                  <img
                    src={anime.poster}
                    alt={anime.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  {/* Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  {/* Score */}
                  {anime.score && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] text-white font-bold bg-black/70 px-1.5 py-0.5 rounded">
                      <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                      <span>{anime.score}</span>
                    </div>
                  )}

                  {/* MOVIE badge */}
                  <span className="absolute top-2 left-2 text-[9px] font-extrabold uppercase bg-[#E53935] text-white px-2 py-0.5 rounded-full">
                    MOVIE
                  </span>

                  {/* Title overlay di bawah */}
                  <div className="absolute bottom-0 left-0 right-0 p-2.5">
                    <p className="text-xs font-bold text-white line-clamp-2 leading-snug">
                      {anime.title}
                    </p>
                    {anime.genres && anime.genres.length > 0 && (
                      <p className="text-[9px] text-neutral-400 mt-0.5 line-clamp-1">
                        {anime.genres.slice(0, 3).join(" · ")}
                      </p>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* ── SECTION: Baru Tamat (Yoredaze style) ── */}
      <section className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-lg bg-neutral-900 ${currentAccent.text}`}>
              <CheckCircle className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-wide">
              Baru Tamat
            </h2>
          </div>
          <a href="#/explore?tab=Completed" className={`text-xs sm:text-sm font-bold ${currentAccent.text} hover:underline`}>
            Lihat Semua
          </a>
        </div>

        {/* List */}
        {loadingExtra ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-24 bg-neutral-900 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : completed.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 text-sm">Data tidak tersedia.</div>
        ) : (
          <div className="space-y-3">
            {completed.map((anime, index) => (
              <a
                key={anime.slug}
                href={`#/detail/${anime.slug}`}
                className="group relative flex items-center gap-0 rounded-2xl overflow-hidden border border-[#2A2A2A] hover:border-neutral-600 transition-all duration-300 h-24"
              >
                {/* Background poster - grayscale */}
                <div className="absolute inset-0 w-full h-full">
                  <img
                    src={anime.poster}
                    alt={anime.title}
                    className="w-full h-full object-cover filter grayscale opacity-40 group-hover:opacity-50 group-hover:grayscale-0 transition-all duration-500 scale-105"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/30" />
                </div>

                {/* Poster kecil kiri */}
                <div className="relative shrink-0 w-16 h-24 overflow-hidden">
                  <img
                    src={anime.poster}
                    alt={anime.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-center py-0.5">
                    <span className="text-[10px] font-black text-white">#{index + 1}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="relative flex-1 px-3 py-2 min-w-0">
                  {/* Dot biru - completed */}
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                    <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Completed</span>
                  </div>

                  {/* Judul */}
                  <p className="text-sm font-black text-white line-clamp-1 group-hover:text-neutral-200 transition-colors">
                    {anime.title}
                  </p>

                  {/* Meta info */}
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    {anime.type && (
                      <span className="text-[9px] font-bold text-white bg-[#FF8C00] px-1.5 py-0.5 rounded-full shrink-0">
                        {anime.type}
                      </span>
                    )}
                    {anime.episode && (
                      <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                        <Tv className="w-3 h-3" />
                        {anime.episode}
                      </span>
                    )}
                    {anime.score && (
                      <span className="text-[10px] text-amber-400 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {anime.score}
                      </span>
                    )}
                  </div>
                </div>

                {/* Arrow kanan */}
                <div className="relative pr-3 shrink-0">
                  <div className="w-6 h-6 rounded-full border border-neutral-700 flex items-center justify-center group-hover:border-neutral-400 transition-colors">
                    <svg className="w-3 h-3 text-neutral-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

            {/* ── SECTION: Top Sedang Tayang (Yoredaze style) ── */}
      <section className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-lg bg-neutral-900 ${currentAccent.text}`}>
              <Radio className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-wide">
              Top Ongoing
            </h2>
          </div>
          <a href="#/explore?tab=Ongoing" className={`text-xs sm:text-sm font-bold ${currentAccent.text} hover:underline`}>
            Lihat Semua
          </a>
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-24 bg-neutral-900 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : ongoingBanner.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 text-sm">Data tidak tersedia.</div>
        ) : (
          <div className="space-y-3">
            {ongoingBanner.map((anime, index) => (
              <a
                key={anime.slug}
                href={`#/detail/${anime.slug}`}
                className="group relative flex items-center gap-0 rounded-2xl overflow-hidden border border-[#2A2A2A] hover:border-neutral-600 transition-all duration-300 h-24"
              >
                {/* Background poster - full width, grayscale */}
                <div className="absolute inset-0 w-full h-full">
                  <img
                    src={anime.poster}
                    alt={anime.title}
                    className="w-full h-full object-cover filter grayscale opacity-40 group-hover:opacity-50 group-hover:grayscale-0 transition-all duration-500 scale-105"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  {/* Overlay gradient dari kiri (gelap) ke kanan (transparan) */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/30" />
                </div>

                {/* Poster kecil kiri */}
                <div className="relative shrink-0 w-16 h-24 overflow-hidden">
                  <img
                    src={anime.poster}
                    alt={anime.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  {/* Nomor ranking overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-center py-0.5">
                    <span className="text-[10px] font-black text-white">#{index + 1}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="relative flex-1 px-3 py-2 min-w-0">
                  {/* Dot ongoing */}
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
                    <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider">Ongoing</span>
                  </div>

                  {/* Judul */}
                  <p className="text-sm font-black text-white line-clamp-1 group-hover:text-neutral-200 transition-colors">
                    {anime.title}
                  </p>

                  {/* Meta info */}
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    {anime.type && (
                      <span className="text-[9px] font-bold text-white bg-[#FF8C00] px-1.5 py-0.5 rounded-full shrink-0">
                        {anime.type}
                      </span>
                    )}
                    {anime.episode && (
                      <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                        <Tv className="w-3 h-3" />
                        {anime.episode}
                      </span>
                    )}
                    {anime.score && (
                      <span className="text-[10px] text-amber-400 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {anime.score}
                      </span>
                    )}
                  </div>
                </div>

                {/* Arrow kanan */}
                <div className="relative pr-3 shrink-0">
                  <div className={`w-6 h-6 rounded-full border border-neutral-700 flex items-center justify-center group-hover:border-neutral-400 transition-colors`}>
                    <svg className="w-3 h-3 text-neutral-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
