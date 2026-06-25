import React, { useState, useEffect } from "react";
import { Star, Play, PlayCircle, Eye, ArrowLeft, ArrowDownToLine, Tv, HardDrive, Calendar, Clock, AlertTriangle, HelpCircle, Sparkles } from "lucide-react";
import { DetailPayload, AccentColor, DataSource } from "../types";
import { ACCENTS } from "../lib/settings";

interface DetailProps {
  accent: AccentColor;
  dataSource: DataSource;
  slug: string;
}

export function Detail({ accent, dataSource, slug }: DetailProps) {
  const [detail, setDetail] = useState<DetailPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBlacklisted, setIsBlacklisted] = useState(false);

  const currentAccent = ACCENTS[accent];

  useEffect(() => {
    if (!slug) return;

    async function fetchDetail() {
      setLoading(true);
      setError(null);
      setIsBlacklisted(false);
      try {
        const response = await fetch(`/api/proxy?route=detail&source=${dataSource}&slug=${slug}`);
        if (response.status === 403) {
          const blockData = await response.json();
          if (blockData.blacklisted) {
            setIsBlacklisted(true);
            return;
          }
        }
        if (!response.ok) {
          throw new Error("Gagal mengambil data detail anime");
        }
        const data = await response.json();
        setDetail(data);
      } catch (err: any) {
        console.error(err);
        setError("Gagal memuat detail anime. Silakan kembali ke beranda atau muat ulang halaman.");
      } finally {
        setLoading(false);
      }
    }

    fetchDetail();
  }, [slug, dataSource]);

  // YouTube embed ID extractor helper
  const getYoutubeEmbedUrl = (url: string | null): string | null => {
    if (!url) return null;
    if (url.includes('youtube.com/embed/')) return url;
    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=0&mute=0`;
    }
    return null;
  };

  const embedUrl = detail ? getYoutubeEmbedUrl(detail.trailer) : null;

  // Handle blacklisted view
  if (isBlacklisted) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-red-600/10 border border-red-600 rounded-full flex items-center justify-center text-red-500 animate-bounce">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white font-display tracking-wide uppercase">
            Konten Tidak Tersedia di Web
          </h1>
          <p className="text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
            Sesuai kebijakan hak cipta dan pembatasan lisensi, anime ini diblokir untuk streaming di versi web.
          </p>
          <div className="p-4 bg-[#161616] border border-[#2A2A2A] rounded-2xl text-neutral-300 text-xs text-left max-w-sm mx-auto space-y-1.5 font-medium shadow-md">
            <span className="text-amber-500 font-bold block mb-1">Kenapa harus download APK Aniku?</span>
            <p>&bull; Akses bebas sensor &amp; bebas blokir hak cipta</p>
            <p>&bull; Kualitas video tinggi hingga 1080p</p>
            <p>&bull; Tanpa iklan, bookmark otomatis, dan riwayat nonton</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
          <a
            href="#/download"
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-[#E53935] hover:opacity-90 text-white shadow-lg transition-transform duration-300 font-display text-sm`}
          >
            <ArrowDownToLine className="w-4 h-4" />
            <span>Download APK Aniku Gratis</span>
          </a>
          <a
            href="#/home"
            className="text-xs sm:text-sm font-bold text-neutral-400 hover:text-white hover:underline px-4 py-2"
          >
            Kembali ke Beranda
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse pb-16">
        <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
          <div className="w-48 sm:w-64 aspect-[2/3] bg-neutral-900 rounded-2xl shrink-0 mx-auto md:mx-0" />
          <div className="flex-1 space-y-4 py-2">
            <div className="h-8 bg-neutral-900 rounded w-1/3" />
            <div className="h-6 bg-neutral-900 rounded w-2/3" />
            <div className="h-20 bg-neutral-900 rounded w-full" />
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="h-10 bg-neutral-900 rounded" />
              <div className="h-10 bg-neutral-900 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="p-12 text-center bg-[#161616] rounded-2xl border border-neutral-850 max-w-md mx-auto space-y-4">
        <HelpCircle className="w-12 h-12 text-neutral-600 mx-auto" />
        <p className="text-neutral-400 font-medium">{error || "Anime tidak ditemukan"}</p>
        <a
          href="#/home"
          className={`inline-block px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#E53935]`}
        >
          Kembali ke Beranda
        </a>
      </div>
    );
  }

  const hasEpisodes = detail.episodes && detail.episodes.length > 0;

  return (
    <div className="space-y-8 pb-16">
      {/* Back Button */}
      <div className="flex items-center">
        <a
          href="#/home"
          className="group flex items-center gap-2 text-xs sm:text-sm text-neutral-400 hover:text-white font-bold transition-all"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Kembali</span>
        </a>
      </div>

      {/* Hero Meta Section */}
      <div className="flex flex-col md:flex-row gap-6 sm:gap-10">
        {/* Dynamic 2:3 Poster aspect ratio with overlay badge */}
        <div className="relative w-48 sm:w-64 aspect-[2/3] rounded-2xl overflow-hidden border border-neutral-900 shadow-2xl shrink-0 mx-auto md:mx-0 bg-neutral-950">
          <img
            src={detail.poster}
            alt={detail.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          <span className="absolute top-3 left-3 text-[10px] sm:text-xs font-extrabold uppercase py-1 px-3 bg-[#FF8C00] text-white rounded-full tracking-wider z-10 shadow-lg">
            {detail.type || "TV"}
          </span>

          {detail.score && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1 text-xs text-white font-black bg-black/75 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-neutral-800">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{detail.score}</span>
            </div>
          )}
        </div>

        {/* Info Right Column */}
        <div className="flex-1 space-y-5 flex flex-col justify-start">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-2xl sm:text-4xl font-black text-white font-display uppercase tracking-wide leading-none">
              {detail.title}
            </h1>
            
            {/* Tagline genres wraps list */}
            {detail.genres && detail.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2.5 justify-center md:justify-start">
                {detail.genres.map((genre) => (
                  <a
                    key={genre.slug}
                    href={`#/explore?tab=Genres&genreSlug=${genre.slug}`}
                    className="text-xs font-semibold px-3 py-1 bg-neutral-900/45 text-neutral-300 hover:text-white rounded-lg border border-neutral-900 hover:border-neutral-700 transition"
                  >
                    {genre.name}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Specs grid list */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-neutral-900/60 border border-neutral-950 rounded-xl space-y-1">
              <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wide block">Studio</span>
              <span className="text-xs sm:text-sm text-neutral-200 font-bold leading-none truncate block">{detail.studios}</span>
            </div>
            <div className="p-3 bg-neutral-900/60 border border-neutral-950 rounded-xl space-y-1">
              <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wide block">Status</span>
              <span className="text-xs sm:text-sm text-neutral-200 font-bold leading-none truncate block">{detail.status}</span>
            </div>
            <div className="p-3 bg-neutral-900/60 border border-neutral-950 rounded-xl space-y-1">
              <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wide block">Musim</span>
              <span className="text-xs sm:text-sm text-neutral-200 font-bold leading-none truncate block">{detail.season}</span>
            </div>
            <div className="p-3 bg-neutral-900/60 border border-neutral-950 rounded-xl space-y-1">
              <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wide block">Durasi</span>
              <span className="text-xs sm:text-sm text-neutral-200 font-bold leading-none truncate block">{detail.duration}</span>
            </div>
            <div className="p-3 bg-neutral-900/60 border border-neutral-950 rounded-xl space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wide block">Rilis</span>
              <span className="text-xs sm:text-sm text-neutral-200 font-bold leading-none truncate block">{detail.aired}</span>
            </div>
          </div>

          {/* Action button if has episodes */}
          {hasEpisodes && (
            <div className="pt-2">
              <a
                href={`#/watch/${detail.episodes[0].slug}`}
                className={`flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-white shadow-lg ${currentAccent.glowingBg} transform active:scale-95 transition duration-300 font-display`}
              >
                <PlayCircle className="w-5 h-5" />
                <span>Nonton Episode Terbaru</span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Synopsis Section */}
      {detail.synopsis && (
        <section className="space-y-3 bg-[#161616] p-5 sm:p-6 rounded-2xl border border-[#2A2A2A]">
          <h2 className="text-lg font-bold text-white border-b border-neutral-900 pb-2 flex items-center gap-2">
            <span>Sinopsis</span>
          </h2>
          <p className="text-sm text-neutral-300 leading-relaxed max-w-none whitespace-pre-line font-medium text-justify">
            {detail.synopsis}
          </p>
        </section>
      )}

      {/* Trailer Block (YouTube iframe) */}
      {embedUrl && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white border-b border-neutral-900 pb-2">
            Trailer Resmi
          </h2>
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl border border-neutral-900 bg-neutral-950">
            <iframe
              src={embedUrl}
              title={`${detail.title} - Official Trailer`}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>
      )}

      {/* Episodes Block: clicking goes to watch page */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white border-b border-neutral-900 pb-2 flex items-center gap-2">
          <span>Daftar Episode ({detail.episodes?.length || 0})</span>
        </h2>

        {!hasEpisodes ? (
          <div className="p-8 text-center text-neutral-500 bg-neutral-900/20 border border-neutral-900 rounded-xl text-sm">
            Tautan episode belum tersedia untuk anime ini di database.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-[400px] overflow-y-auto pr-2">
            {detail.episodes.map((ep, idx) => (
              <a
                key={ep.slug}
                href={`#/watch/${ep.slug}`}
                className="flex items-center justify-between p-3.5 bg-[#161616] border border-[#2A2A2A] hover:border-brand-red rounded-xl group transition-all duration-300 hover:bg-neutral-900/60"
                style={{ borderColor: `var(--hover-border, #2A2A2A)` } as any}
              >
                <div className="space-y-0.5 min-w-0 pr-2">
                  <span className="text-[10px] text-neutral-500 font-bold font-mono">EPS {detail.episodes.length - idx}</span>
                  <h4 className="text-xs sm:text-sm text-neutral-200 group-hover:text-amber-500 font-semibold truncate leading-none">
                    {ep.name || `Episode ${detail.episodes.length - idx}`}
                  </h4>
                </div>
                <Play className="w-3.5 h-3.5 text-neutral-500 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all shrink-0" />
              </a>
            ))}
          </div>
        )}
      </section>

      {/* Bottom Campaign Banner linking to /download */}
      <section className="bg-gradient-to-r from-neutral-950 to-neutral-900 p-5 rounded-2xl border border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-neutral-900 text-amber-500">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm">Ingin bookmark anime favorit ini?</h4>
            <p className="text-xs text-neutral-400 mt-0.5">Bookmarks, riwayat tontonan tersimpan, notifikasi episode rilis &amp; tanpa iklan eksklusif di aplikasi Android.</p>
          </div>
        </div>
        <a
          href="#/download"
          className={`flex items-center gap-1.5 px-4 py-2 bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white rounded-lg text-xs font-bold transition-transform shrink-0`}
        >
          <ArrowDownToLine className="w-3.5 h-3.5" />
          <span>Dapatkan di Android</span>
        </a>
      </section>
    </div>
  );
}
