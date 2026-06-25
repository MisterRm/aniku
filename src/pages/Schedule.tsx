import React, { useState, useEffect } from "react";
import { Calendar, Clock, Star, Play, AlertOctagon } from "lucide-react";
import { AnimeRaw, AccentColor, GridLayout, DataSource } from "../types";
import { AnimeCard } from "../components/AnimeCard";
import { ShimmerGrid } from "../components/ShimmerGrid";
import { ACCENTS } from "../lib/settings";

interface ScheduleProps {
  accent: AccentColor;
  gridLayout: GridLayout;
  dataSource: DataSource;
}

export function Schedule({ accent, gridLayout, dataSource }: ScheduleProps) {
  const [schedule, setSchedule] = useState<Record<string, AnimeRaw[]>>({});
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentAccent = ACCENTS[accent];

  const DAYS_ORDER = [
    { key: "senin", title: "Senin" },
    { key: "selasa", title: "Selasa" },
    { key: "rabu", title: "Rabu" },
    { key: "kamis", title: "Kamis" },
    { key: "jum'at", title: "Jumat" }, // Normalize key to jum'at
    { key: "sabtu", title: "Sabtu" },
    { key: "minggu", title: "Minggu" }
  ];

  useEffect(() => {
    // Pick today as selected day automatically on launch
    const dayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday ...
    const dayKeys = ["minggu", "senin", "selasa", "rabu", "kamis", "jum'at", "sabtu"];
    setSelectedDay(dayKeys[dayIndex]);
  }, []);

  useEffect(() => {
    async function fetchSchedule() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/proxy?route=schedule&source=${dataSource}`);
        if (!response.ok) {
          throw new Error("Gagal mengambil jadwal rilis mingguan");
        }
        const data = await response.json();
        setSchedule(data || {});
      } catch (err: any) {
        console.error(err);
        setError("Sambungan terputus. Gagal memuat jadwal tayang anime.");
      } finally {
        setLoading(false);
      }
    }

    fetchSchedule();
  }, [dataSource]);

  // Read list for active selectedDay
  // Note that samehadaku might return "jum'at" or "jumat". Let's cover both!
  const getDayList = () => {
    if (!selectedDay) return [];
    if (selectedDay === "jum'at") {
      return schedule["jum'at"] || schedule["jumat"] || [];
    }
    return schedule[selectedDay] || [];
  };

  const activeList = getDayList();

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex border-b border-neutral-900 pb-3 items-center gap-2.5">
        <div className={`p-1.5 rounded-lg bg-neutral-900 ${currentAccent.text}`}>
          <Calendar className="w-5 h-5" />
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-wider">
          Jadwal Tayang Mingguan
        </h1>
      </div>

      {/* Day Selectors Buttons row */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {DAYS_ORDER.map((d) => {
          const isSelected = selectedDay === d.key;
          const count = d.key === "jum'at" 
            ? (schedule["jum'at"]?.length || schedule["jumat"]?.length || 0)
            : (schedule[d.key]?.length || 0);

          return (
            <button
              key={d.key}
              onClick={() => setSelectedDay(d.key)}
              className={`flex flex-col items-center justify-center px-4 py-3 rounded-2xl border text-center transition-all duration-300 min-w-[76px] sm:min-w-[90px] shrink-0 ${
                isSelected
                  ? `${currentAccent.bg} text-white border-transparent ${currentAccent.glowingBg}`
                  : "bg-neutral-900 text-neutral-400 border-neutral-850 hover:text-white hover:border-neutral-700"
              }`}
            >
              <span className="text-xs font-semibold">{d.title}</span>
              {!loading && (
                <span className={`text-[10px] mt-1 font-bold font-mono px-1.5 py-0.5 rounded ${
                  isSelected ? 'bg-black/35 text-white' : 'bg-neutral-950 text-neutral-500'
                }`}>
                  {count} Anime
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="space-y-4">
        {error ? (
          <div className="p-8 text-center bg-[#161616] rounded-2xl border border-neutral-850 text-neutral-500 max-w-sm mx-auto">
            <AlertOctagon className="w-8 h-8 mx-auto text-neutral-600 mb-2" />
            <p className="font-medium">{error}</p>
          </div>
        ) : loading ? (
          <ShimmerGrid count={6} layout={gridLayout} />
        ) : activeList.length === 0 ? (
          <div className="py-24 text-center text-neutral-500 text-sm max-w-xs mx-auto">
            <Clock className="w-12 h-12 mx-auto text-neutral-700 stroke-1 mb-3 animate-spin duration-[6s]" />
            <p className="font-semibold text-neutral-400">Tidak ada jadwal rilis</p>
            <p className="text-xs text-neutral-500 mt-1">
              Hari ini tidak ada anime ongoing yang dijadwalkan merilis episode baru.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 border-b border-neutral-950 pb-2 mb-4 font-bold uppercase tracking-wider">
              <span>HARI:</span>
              <span className={currentAccent.text}>
                {DAYS_ORDER.find(d => d.key === selectedDay)?.title || ""}
              </span>
            </div>

            <div className={`grid gap-4 sm:gap-6 ${
              gridLayout === 'cols-2'
                ? 'grid-cols-2 lg:grid-cols-4'
                : gridLayout === 'list'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
            }`}>
              {activeList.map((anime) => (
                <AnimeCard
                  key={anime.slug}
                  anime={anime}
                  accent={accent}
                  layout={gridLayout}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
