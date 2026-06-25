import React, { useEffect, useState } from "react";
import {
  ArrowDownToLine, Check, X, ShieldAlert, Heart, Landmark, ArrowRight, Smartphone, MessageCircle,
  User, Bookmark, Clapperboard, Newspaper, Clock, Bell, Palette, Lock,
  Monitor, CalendarDays, BadgeX, Database, Download as DownloadIcon, Tag, RefreshCw, ChevronDown, ChevronUp
} from "lucide-react";
import { AccentColor } from "../types";
import { ACCENTS } from "../lib/settings";

interface DownloadProps {
  accent: AccentColor;
  flashMessage?: string;
}

interface GithubAsset {
  name: string;
  browser_download_url: string;
  download_count: number;
  size: number;
  updated_at: string;
}

interface GithubRelease {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  prerelease: boolean;
  html_url: string;
  assets: GithubAsset[];
}

const GITHUB_API = "https://api.github.com/repos/RMBLOGG/aniku-app/releases";

function formatBytes(bytes: number) {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric", month: "short", year: "numeric"
  });
}

function parseMarkdownChangelog(body: string): { yang_baru: string[], perbaikan: string[], lainnya: string[] } {
  const lines = body.split("\n");
  const result: { yang_baru: string[], perbaikan: string[], lainnya: string[] } = { yang_baru: [], perbaikan: [], lainnya: [] };
  let section: keyof typeof result | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (/yang baru/i.test(trimmed)) { section = "yang_baru"; continue; }
    if (/perbaikan/i.test(trimmed)) { section = "perbaikan"; continue; }
    if (/lainnya/i.test(trimmed)) { section = "lainnya"; continue; }
    if (trimmed.startsWith("###") || trimmed.startsWith("---") || trimmed.startsWith(">") || trimmed.startsWith("###")) { section = null; continue; }
    if (section && trimmed.startsWith("-")) {
      result[section].push(trimmed.replace(/^-\s*/, "").replace(/\*\*/g, ""));
    }
  }
  return result;
}

export function Download({ accent, flashMessage }: DownloadProps) {
  const currentAccent = ACCENTS[accent];

  const [releases, setReleases] = useState<GithubRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRelease, setExpandedRelease] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(GITHUB_API)
      .then(res => {
        if (!res.ok) throw new Error("Gagal fetch releases");
        return res.json();
      })
      .then((data: GithubRelease[]) => {
        setReleases(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const latestRelease = releases[0] ?? null;
  const latestApk = latestRelease?.assets.find(a => a.name.endsWith(".apk")) ?? null;

  const totalDownloads = releases.reduce((sum, rel) =>
    sum + rel.assets.reduce((s, a) => s + a.download_count, 0), 0
  );

  const EXCLUSIVE_FEATURES = [
    { icon: User,          title: "Akun & Profil",   desc: "Daftar akun, atur username & foto profil, login di semua perangkat." },
    { icon: Bookmark,      title: "Bookmark Anime",  desc: "Simpan anime favorit dan akses kapan saja dari menu bookmark." },
    { icon: MessageCircle, title: "Global Chat",     desc: "Ngobrol bareng sesama penonton anime di ruang chat publik secara real-time." },
    { icon: Clapperboard,  title: "Watch Chat",      desc: "Chat langsung bareng penonton lain saat nonton episode yang sama." },
    { icon: Newspaper,     title: "Feed Komunitas",  desc: "Buat post, bagikan anime favorit, like dan komentar postingan teman." },
    { icon: Clock,         title: "Riwayat Tonton",  desc: "Episode yang pernah ditonton otomatis tersimpan, lanjut dari mana saja." },
    { icon: Bell,          title: "Notifikasi",      desc: "Dapat notifikasi saat ada episode baru dari anime yang kamu ikuti." },
    { icon: Palette,       title: "Tema & Tampilan", desc: "Pilih warna aksen, ukuran teks, dan layout grid sesuai selera." },
    { icon: Lock,          title: "App Lock",        desc: "Kunci aplikasi dengan PIN atau biometrik untuk privasi lebih." },
    { icon: Monitor,       title: "Pilihan Server",  desc: "Ganti server streaming jika satu server lambat atau error." },
    { icon: CalendarDays,  title: "Jadwal Tayang",   desc: "Lihat anime apa yang rilis hari ini dan minggu ini." },
    { icon: BadgeX,        title: "Tanpa Iklan",     desc: "Nonton tanpa gangguan iklan sama sekali, selamanya gratis." },
    { icon: Database,      title: "Multi-source",    desc: "Pilih sumber data streaming: Dayynime-v1 atau Dayynime-v2 sesuai preferensi." },
  ];

  const COMPARISON_ROWS = [
    { feature: "Streaming anime", web: true, app: true },
    { feature: "Pencarian & filter genre", web: true, app: true },
    { feature: "Jadwal tayang", web: true, app: true },
    { feature: "Detail anime", web: true, app: true },
    { feature: "Akun & profil", web: false, app: true },
    { feature: "Bookmark anime", web: false, app: true },
    { feature: "Global chat room", web: false, app: true },
    { feature: "Watch chat (chat saat nonton)", web: false, app: true },
    { feature: "Feed komunitas & post", web: false, app: true },
    { feature: "Riwayat tonton tersimpan", web: false, app: true },
    { feature: "Notifikasi episode baru", web: false, app: true },
    { feature: "App lock (PIN/biometrik)", web: false, app: true },
    { feature: "Tanpa iklan", web: false, app: true },
    { feature: "Pilih sumber data (multi-source)", web: false, app: true },
    { feature: "Pilih tema & aksen warna", web: false, app: true }
  ];

  return (
    <div className="space-y-12 pb-16 pt-4 max-w-5xl mx-auto">
      {flashMessage && (
        <div className="bg-red-600/10 border border-red-500/50 p-4 rounded-2xl flex items-center gap-3 animate-pulse text-red-500">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <p className="text-xs sm:text-sm font-semibold">{flashMessage}</p>
        </div>
      )}

      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-900 border border-neutral-800 text-neutral-400 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
          <Smartphone className="w-3.5 h-3.5" />
          <span>Aplikasi Resmi Aniku Android</span>
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white font-display uppercase tracking-tight leading-none drop-shadow-md">
          ANIKU UNTUK ANDROID
        </h1>
        <p className="text-sm sm:text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed font-semibold">
          Streaming anime subtitle Indonesia gratis, tanpa gangguan iklan, dengan semua fitur premium pendukung lengkap.
        </p>

        {/* Live download button from GitHub */}
        <div className="pt-4 flex flex-col items-center gap-3">
          {loading ? (
            <div className="flex items-center gap-2 px-8 py-4 bg-neutral-800 text-neutral-500 rounded-2xl font-black text-base animate-pulse">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Memuat versi terbaru...</span>
            </div>
          ) : error || !latestApk ? (
            <a
              href="https://github.com/RMBLOGG/aniku-app/releases/latest"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-4 bg-[#E53935] hover:opacity-90 text-white rounded-2xl font-black text-base shadow-xl transition-all"
            >
              <ArrowDownToLine className="w-5 h-5" />
              <span>Download APK Gratis</span>
            </a>
          ) : (
            <a
              href={latestApk.browser_download_url}
              download={latestApk.name}
              className={`flex items-center gap-2 px-8 py-4 bg-[#E53935] hover:opacity-90 hover:scale-[1.03] text-white rounded-2xl font-black text-base sm:text-lg shadow-xl transition-all duration-300 transform active:scale-95 ${currentAccent.glowingBg}`}
            >
              <ArrowDownToLine className="w-5 h-5" />
              <span>Download {latestRelease.tag_name} — {formatBytes(latestApk.size)}</span>
            </a>
          )}
          <p className="text-xs text-neutral-500 font-bold tracking-wide uppercase font-mono">
            Gratis &bull; Tanpa Iklan &bull; Android 7.0+
          </p>
          {!loading && !error && totalDownloads > 0 && (
            <p className="text-xs text-neutral-400 font-semibold">
              <span className="text-white font-black">{totalDownloads.toLocaleString("id-ID")}</span> total unduhan dari semua versi
            </p>
          )}
        </div>
      </div>

      {/* Release History Section */}
      <section className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider font-display">
            Riwayat Rilis
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            Semua versi Aniku yang pernah dirilis — klik untuk lihat changelog.
          </p>
        </div>

        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-[#161616] border border-[#2A2A2A] rounded-2xl p-5 animate-pulse h-20" />
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-700/40 rounded-2xl p-4 text-red-400 text-sm text-center">
            Gagal memuat riwayat rilis: {error}
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-3">
            {releases.map((rel, idx) => {
              const apk = rel.assets.find(a => a.name.endsWith(".apk"));
              const dlCount = rel.assets.reduce((s, a) => s + a.download_count, 0);
              const isLatest = idx === 0;
              const isExpanded = expandedRelease === rel.id;
              const changelog = parseMarkdownChangelog(rel.body ?? "");

              return (
                <div
                  key={rel.id}
                  className={`bg-[#161616] border rounded-2xl overflow-hidden transition-all ${isLatest ? "border-[#E53935]/50" : "border-[#2A2A2A]"}`}
                >
                  {/* Release header row */}
                  <div
                    className="flex items-center gap-3 p-4 sm:p-5 cursor-pointer select-none"
                    onClick={() => setExpandedRelease(isExpanded ? null : rel.id)}
                  >
                    <div className="flex-1 flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-neutral-500" />
                        <span className="text-white font-black text-sm sm:text-base">{rel.name || rel.tag_name}</span>
                      </div>
                      {isLatest && (
                        <span className="px-2 py-0.5 bg-[#E53935] text-white text-[10px] font-black rounded-full uppercase tracking-wide">
                          Latest
                        </span>
                      )}
                      {rel.prerelease && (
                        <span className="px-2 py-0.5 bg-yellow-600/30 text-yellow-400 text-[10px] font-bold rounded-full uppercase">
                          Pre-release
                        </span>
                      )}
                      <span className="text-neutral-500 text-xs">{formatDate(rel.published_at)}</span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {dlCount > 0 && (
                        <div className="flex items-center gap-1 text-neutral-400 text-xs font-bold">
                          <DownloadIcon className="w-3.5 h-3.5" />
                          <span>{dlCount.toLocaleString("id-ID")}</span>
                        </div>
                      )}
                      {apk && (
                        <a
                          href={apk.browser_download_url}
                          download={apk.name}
                          onClick={e => e.stopPropagation()}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E53935] hover:opacity-85 text-white font-bold text-xs rounded-xl transition"
                        >
                          <ArrowDownToLine className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">{formatBytes(apk.size)}</span>
                          <span className="sm:hidden">APK</span>
                        </a>
                      )}
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-neutral-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-neutral-500" />
                      )}
                    </div>
                  </div>

                  {/* Expanded changelog */}
                  {isExpanded && (
                    <div className="border-t border-[#2A2A2A] px-5 pb-5 pt-4 space-y-4">
                      {changelog.yang_baru.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-black text-green-400 uppercase tracking-wider">✦ Yang Baru</p>
                          <ul className="space-y-1.5">
                            {changelog.yang_baru.map((item, i) => (
                              <li key={i} className="flex gap-2 text-xs text-neutral-300">
                                <span className="text-green-500 mt-0.5 shrink-0">+</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {changelog.perbaikan.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-black text-blue-400 uppercase tracking-wider">✦ Perbaikan</p>
                          <ul className="space-y-1.5">
                            {changelog.perbaikan.map((item, i) => (
                              <li key={i} className="flex gap-2 text-xs text-neutral-300">
                                <span className="text-blue-500 mt-0.5 shrink-0">↳</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {changelog.lainnya.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-black text-yellow-400 uppercase tracking-wider">✦ Lainnya</p>
                          <ul className="space-y-1.5">
                            {changelog.lainnya.map((item, i) => (
                              <li key={i} className="flex gap-2 text-xs text-neutral-300">
                                <span className="text-yellow-500 mt-0.5 shrink-0">→</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {changelog.yang_baru.length === 0 && changelog.perbaikan.length === 0 && changelog.lainnya.length === 0 && (
                        <p className="text-xs text-neutral-500 italic">Tidak ada catatan perubahan untuk versi ini.</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Section: Exclusive Features */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider font-display">
            Fitur Eksklusif Aplikasi Android
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto">
            Nikmati pengalaman nonton tak tertandingi dengan beragam fitur sosial dan personalisasi.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EXCLUSIVE_FEATURES.map((feat) => (
            <div
              key={feat.title}
              className="bg-[#161616] hover:border-red-650 transition-colors duration-300 border border-[#2A2A2A] rounded-2xl p-5 space-y-3 group group-hover:shadow-[0_0_10px_rgba(229,57,53,0.1)] hover:border-brand-red/50"
            >
              <div className="text-3xl">
                <feat.icon className="w-8 h-8 text-neutral-300" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-black text-sm sm:text-base group-hover:text-brand-red transition-all">
                  {feat.title}
                </h4>
                <p className="text-xs text-neutral-400 leading-relaxed font-semibold">
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section: Comparison table */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider font-display">
            Perbandingan Web vs Android APK
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto">
            Mengapa versi Android adalah pilihan mutlak terbaik untuk anime lovers.
          </p>
        </div>

        <div className="bg-[#161616] border border-[#2A2A2A] rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#222222] border-b border-[#2A2A2A] text-[11px] sm:text-xs font-bold text-neutral-400 uppercase tracking-wider">
                <th className="py-4 px-4 sm:px-6">Fitur Layanan</th>
                <th className="py-4 px-4 text-center ">Web Browser</th>
                <th className="py-4 px-4 text-center text-brand-red bg-[#E53935]/5 border-x border-[#2A2A2A]">Aplikasi Android</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900 text-xs sm:text-sm">
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.feature} className="hover:bg-neutral-900/40">
                  <td className="py-3.5 px-4 sm:px-6 text-white font-semibold">{row.feature}</td>
                  <td className="py-3.5 px-4 text-center">
                    {row.web ? (
                      <Check className="w-5 h-5 text-[#4CAF50] mx-auto stroke-[3]" />
                    ) : (
                      <X className="w-5 h-5 text-neutral-600 mx-auto stroke-[3]" />
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center bg-[#E53935]/5 border-x border-[#2A2A2A] font-bold">
                    {row.app ? (
                      <Check className="w-5 h-5 text-[#4CAF50] mx-auto stroke-[3]" />
                    ) : (
                      <X className="w-5 h-5 text-[#4CAF50] mx-auto stroke-[3]" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 bg-neutral-900/60 border-t border-[#2A2A2A] text-center">
            <p className="text-[11px] sm:text-xs text-neutral-400 font-bold italic">
               * Fitur web akan terus berkembang. Untuk pengalaman terbaik, gunakan aplikasi Android. *
            </p>
          </div>
        </div>
      </section>

      {/* Creator Donations & CTA Section */}
      <section className="bg-gradient-to-r from-neutral-950 to-[#221111]/30 border border-neutral-900 rounded-3xl p-6 sm:p-10 text-center space-y-6">
        <div className="max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-black text-white font-display">DUKUNG DEVELOPER ANIKU</h2>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-semibold">
            Bantu kami mempertahankan server streaming, meningkatkan update database anime, dan mengembangkan fitur APK Android agar tetap bebas dari iklan selamanya gratis.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href="https://saweria.co/Dayynime"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#222222] hover:bg-neutral-800 text-amber-500 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-neutral-800 transition"
          >
            <Heart className="w-4 h-4 fill-red-600 text-red-605" />
            <span>Saweria</span>
          </a>
          <a
            href="https://trakteer.id/Dayynimee"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#222222] hover:bg-neutral-800 text-red-500 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-neutral-800 transition"
          >
            <Landmark className="w-4 h-4" />
            <span>Trakteer</span>
          </a>
          <a
            href="https://sociabuzz.com/dayynime"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#222222] hover:bg-neutral-800 text-[#2196F3] font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-neutral-800 transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Sociabuzz</span>
          </a>
        </div>

        <div className="pt-2 border-t border-neutral-900 max-w-xl mx-auto flex flex-col items-center gap-4">
          {latestApk ? (
            <a
              href={latestApk.browser_download_url}
              download={latestApk.name}
              className="inline-flex items-center gap-2 bg-[#E53935] hover:opacity-95 px-6 py-3 font-bold text-white text-sm rounded-xl shadow-lg transition"
            >
              <span>Download APK Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          ) : (
            <a
              href="#"
              className="inline-flex items-center gap-2 bg-[#E53935] hover:opacity-95 px-6 py-3 font-bold text-white text-sm rounded-xl shadow-lg transition opacity-50 pointer-events-none"
            >
              <span>Download APK Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
