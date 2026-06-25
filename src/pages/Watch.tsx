import React, { useState, useEffect } from "react";
import { Play, Tv, Sparkles, MessageSquare, ArrowLeft, ArrowDownToLine, ChevronLeft, ChevronRight, RefreshCw, Loader2, Info, AlertTriangle, HardDrive } from "lucide-react";
import { EpisodePayload, AccentColor, DataSource } from "../types";
import { ACCENTS } from "../lib/settings";

interface WatchProps {
  accent: AccentColor;
  dataSource: DataSource;
  slug: string; // active episode slug
}

export function Watch({ accent, dataSource, slug }: WatchProps) {
  const [episode, setEpisode] = useState<EpisodePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active video player source stream URL
  const [playerUrl, setPlayerUrl] = useState<string>("");
  const [resolvingServer, setResolvingServer] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState<string>("");
  const [selectedServer, setSelectedServer] = useState<string>("");

  const currentAccent = ACCENTS[accent];

  useEffect(() => {
    if (!slug) return;

    async function fetchEpisode() {
      setLoading(true);
      setError(null);
      setPlayerUrl("");
      setSelectedQuality("");
      setSelectedServer("");
      try {
        const response = await fetch(`/api/proxy?route=episode&source=${dataSource}&slug=${slug}`);
        if (!response.ok) {
          throw new Error("Gagal mengambil info streaming episode");
        }
        const data: EpisodePayload = await response.json();
        setEpisode(data);

        // Resolve initial player source
        if (dataSource === "Dayynime-v2") {
          // Samehadaku
          if (data.qualities && data.qualities.length > 0) {
            const firstQual = data.qualities[0];
            setSelectedQuality(firstQual.title);
            
            if (firstQual.serverList && firstQual.serverList.length > 0) {
              const firstServ = firstQual.serverList[0];
              setSelectedServer(firstServ.serverId);
              
              // Load stream URL dynamically
              resolveSamehadakuServer(firstServ.serverId);
            } else {
              setPlayerUrl(data.defaultStreamingUrl || "");
            }
          } else {
            setPlayerUrl(data.defaultStreamingUrl || "");
          }
        } else {
          // Animasu (Dayynime-v1) - direct streams array
          if (data.streams && data.streams.length > 0) {
            setPlayerUrl(data.streams[0].url);
            setSelectedServer(data.streams[0].name);
          }
        }

      } catch (err: any) {
        console.error(err);
        setError("Gagal memuat link streaming. Coba refresh atau pilih server lain.");
      } finally {
        setLoading(false);
      }
    }

    fetchEpisode();
  }, [slug, dataSource]);

  // Request single samehadaku stream url via serverid proxy
  async function resolveSamehadakuServer(serverId: string) {
    setResolvingServer(true);
    try {
      const response = await fetch(`/api/proxy?route=server&serverId=${serverId}`);
      if (!response.ok) throw new Error("Gagal mendecode server");
      const data = await response.json();
      if (data.url) {
        setPlayerUrl(data.url);
      } else {
        // Fallback to default
        setPlayerUrl(episode?.defaultStreamingUrl || "");
      }
    } catch (e) {
      console.error(e);
      setPlayerUrl(episode?.defaultStreamingUrl || "");
    } finally {
      setResolvingServer(false);
    }
  }

  // Handle Changing Quality (Samehadaku only)
  const handleQualityChange = (qualityTitle: string) => {
    if (!episode || !episode.qualities) return;
    const qual = episode.qualities.find(q => q.title === qualityTitle);
    if (!qual) return;

    setSelectedQuality(qualityTitle);
    if (qual.serverList && qual.serverList.length > 0) {
      setSelectedServer(qual.serverList[0].serverId);
      resolveSamehadakuServer(qual.serverList[0].serverId);
    } else {
      setPlayerUrl(episode.defaultStreamingUrl || "");
    }
  };

  // Handle Changing Servers
  const handleServerChange = (item: any) => {
    if (dataSource === "Dayynime-v2") {
      setSelectedServer(item.serverId);
      resolveSamehadakuServer(item.serverId);
    } else {
      setSelectedServer(item.name);
      setPlayerUrl(item.url);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse pb-16">
        <div className="h-4 w-24 bg-neutral-900 rounded" />
        <div className="aspect-video w-full bg-neutral-900 rounded-2xl" />
        <div className="h-10 bg-neutral-900 rounded w-1/2" />
        <div className="h-20 bg-neutral-900 rounded w-full" />
      </div>
    );
  }

  if (error || !episode) {
    return (
      <div className="p-12 text-center bg-[#161616] rounded-2xl border border-neutral-850 max-w-sm mx-auto space-y-4">
        <AlertTriangle className="w-12 h-12 text-neutral-600 mx-auto" />
        <p className="text-neutral-400 font-medium">{error || "Episode tidak terdaftar"}</p>
        <a
          href="#/home"
          className={`inline-block px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#E53935]`}
        >
          Kembali ke Beranda
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Back Button */}
      <div className="flex items-center">
        <a
          href={episode.animeId ? `#/detail/${episode.animeId}` : "#/home"}
          className="group flex items-center gap-2 text-xs sm:text-sm text-neutral-400 hover:text-white font-bold transition-all"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Kembali ke Detail</span>
        </a>
      </div>

      {/* Episode Header Title */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-black text-white leading-tight font-display tracking-wide uppercase">
          {episode.title}
        </h1>
        <p className="text-xs text-neutral-500 font-medium">
          Menonton via provider <span className={`font-mono text-[10px] ${currentAccent.text} font-bold`}>{dataSource}</span>
        </p>
      </div>

      {/* Player Section aspect video */}
      <div className="w-full space-y-4">
        <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-neutral-900 bg-black">
          {resolvingServer ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 space-y-3 z-30">
              <Loader2 className="w-8 h-8 animate-spin text-red-500" />
              <p className="text-xs text-neutral-400 font-bold tracking-wide">Mendekripsi Kunci Server Streaming...</p>
            </div>
          ) : null}

          {playerUrl ? (
            <iframe
              src={playerUrl}
              title={episode.title}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-950 px-4 text-center z-10">
              <p className="text-sm text-neutral-500 font-semibold mb-2">Video player gagal dimuat.</p>
              <button 
                onClick={() => setPlayerUrl(episode.defaultStreamingUrl || "")}
                className="text-xs font-bold text-amber-500 hover:underline flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Gunakan Link Fallback</span>
              </button>
            </div>
          )}
        </div>

        {/* Previous and Next controls wrapper */}
        {(episode.hasPrev || episode.hasNext) && (
          <div className="flex items-center justify-between gap-3 bg-[#161616] p-3 rounded-2xl border border-[#2A2A2A]">
            {episode.hasPrev && episode.prevSlug ? (
              <a
                href={`#/watch/${episode.prevSlug}`}
                className="flex items-center gap-1 text-xs font-bold text-neutral-400 hover:text-white transition-all bg-neutral-950 hover:bg-neutral-900 px-3 py-2 rounded-xl border border-neutral-900"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Episode Sebelumnya</span>
                <span className="sm:hidden">Sebelumnya</span>
              </a>
            ) : <div />}

            {episode.hasNext && episode.nextSlug ? (
              <a
                href={`#/watch/${episode.nextSlug}`}
                className="flex items-center gap-1 text-xs font-bold text-white transition-all bg-red-600 hover:opacity-90 px-4 py-2 rounded-xl shadow-md"
              >
                <span className="hidden sm:inline">Episode Selanjutnya</span>
                <span className="sm:hidden">Selanjutnya</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            ) : <div />}
          </div>
        )}
      </div>

      {/* Streaming servers select options */}
      <div className="bg-[#161616] p-4 rounded-2xl border border-[#2A2A2A] space-y-4">
        <h3 className="text-white text-xs font-black uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
          <HardDrive className="w-4 h-4 text-neutral-500" />
          <span>Pilihan Server &amp; Kualitas</span>
        </h3>

        {dataSource === "Dayynime-v2" && episode.qualities && episode.qualities.length > 0 ? (
          <div className="space-y-4">
            {/* Qualities tab toggles */}
            <div className="flex flex-wrap gap-2 border-b border-neutral-900 pb-3">
              <span className="text-[10px] text-neutral-500 font-bold self-center uppercase pr-2">Kualitas:</span>
              {episode.qualities.map((q) => (
                <button
                  key={q.title}
                  onClick={() => handleQualityChange(q.title)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition ${
                    selectedQuality === q.title
                      ? `${currentAccent.bg} text-white border-transparent`
                      : "bg-neutral-950 text-neutral-400 border-neutral-900 hover:text-white"
                  }`}
                >
                  {q.title}
                </button>
              ))}
            </div>

            {/* Servers lists of selectedQuality */}
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] text-neutral-500 font-bold self-center uppercase pr-2">Server:</span>
              {episode.qualities
                .find((q) => q.title === selectedQuality)
                ?.serverList.map((srv) => {
                  const isSelected = selectedServer === srv.serverId;
                  return (
                    <button
                      key={srv.serverId}
                      onClick={() => handleServerChange(srv)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
                        isSelected
                          ? `bg-neutral-100 text-black border-transparent shadow font-bold`
                          : "bg-neutral-950 text-neutral-400 border-neutral-900 hover:text-white"
                      }`}
                    >
                      {srv.title}
                    </button>
                  );
                })}
            </div>
          </div>
        ) : dataSource === "Dayynime-v1" && episode.streams && episode.streams.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            <span className="text-[10px] text-neutral-500 font-bold self-center uppercase pr-1.5">SERVER:</span>
            {episode.streams.map((srv) => {
              const isSelected = selectedServer === srv.name;
              return (
                <button
                  key={srv.name}
                  onClick={() => handleServerChange(srv)}
                  className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg border transition ${
                    isSelected
                      ? `${currentAccent.bg} text-white border-transparent shadow font-bold`
                      : "bg-neutral-950 text-neutral-400 border-neutral-900 hover:text-white"
                  }`}
                >
                  {srv.name}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-neutral-500 italic">Hanya tersedia server default.</p>
        )}
      </div>

      {/* Watch Chat block as forbidden/restricted area */}
      <div className="bg-[#161616] rounded-2xl border border-[#2A2A2A] p-5 sm:p-6 space-y-4">
        <h3 className="text-neutral-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border-b border-neutral-900 pb-2">
          <MessageSquare className="w-4 h-4 text-neutral-500" />
          <span>Watch Chat &amp; Komentar</span>
        </h3>

        <div className="p-4 bg-neutral-950/80 rounded-xl border border-neutral-900 text-center space-y-3 max-w-md mx-auto">
          <MessageSquare className="w-8 h-8 text-neutral-500 mx-auto animate-bounce" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">Watch Chat Tidak Tersedia di Web</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Ngobrol seru secara real-time bareng ribuan penonton lain saat nonton episode anime ini eksklusif di aplikasi Android Aniku!
            </p>
          </div>
          <a
            href="#/download"
            className={`inline-flex items-center gap-1.5 px-4 py-2 font-bold text-xs text-white rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:text-white transition-all`}
          >
            <ArrowDownToLine className="w-3.5 h-3.5" />
            <span>Dapatkan Aplikasi Android</span>
          </a>
        </div>
      </div>
    </div>
  );
}
