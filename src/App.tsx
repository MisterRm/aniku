import React, { useState, useEffect } from "react";
import { 
  getSavedAccent, 
  getSavedTextSize, 
  getSavedGridLayout, 
  getSavedDataSource 
} from "./lib/settings";
import { AccentColor, TextSize, GridLayout, DataSource, ActiveTab } from "./types";

// Page imports
import { Home } from "./pages/Home";
import { Search } from "./pages/Search";
import { Explore } from "./pages/Explore";
import { Schedule } from "./pages/Schedule";
import { Detail } from "./pages/Detail";
import { Watch } from "./pages/Watch";
import { Download } from "./pages/Download";
import { Settings } from "./pages/Settings";

import { MonitorPlay } from "lucide-react";

// Components imports
import { DesktopSidebar } from "./components/DesktopSidebar";
import { MobileBottomNav } from "./components/MobileBottomNav";

export default function App() {

  // Load preferences from local storage or cookie configurations
  const [accent, setAccent] = useState<AccentColor>(getSavedAccent);
  const [textSize, setTextSize] = useState<TextSize>(getSavedTextSize);
  const [gridLayout, setGridLayout] = useState<GridLayout>(getSavedGridLayout);
  const [dataSource, setDataSource] = useState<DataSource>(getSavedDataSource);

  // Router parsing state
  interface ParsedRoute {
    page: string;
    params: { slug?: string };
    query: Record<string, string>;
  }

  const [route, setRoute] = useState<ParsedRoute>({ page: "home", params: {}, query: {} });
  const [flashMessage, setFlashMessage] = useState<string>("");

  // Clean hash parsing function
  const parseRoute = (): ParsedRoute => {
    const hash = window.location.hash || "#/";
    const cleanHash = hash.replace(/^#/, "");
    
    if (cleanHash === "/" || cleanHash === "") {
      return { page: "home", params: {}, query: {} };
    }
    
    const [path, queryStr] = cleanHash.split("?");
    const pathParts = path.split("/").filter(Boolean); // e.g. ["detail", "naruto"]
    
    const query: Record<string, string> = {};
    if (queryStr) {
      queryStr.split("&").forEach((p) => {
        const [k, v] = p.split("=");
        query[k] = decodeURIComponent(v || "");
      });
    }

    if (pathParts[0] === "detail" && pathParts[1]) {
      return { page: "detail", params: { slug: pathParts[1] }, query };
    }
    if (pathParts[0] === "watch" && pathParts[1]) {
      return { page: "watch", params: { slug: pathParts[1] }, query };
    }
    
    return { page: pathParts[0] || "home", params: {}, query };
  };

  useEffect(() => {
    const handleHashChange = () => {
      const nextRoute = parseRoute();
      
      // Check for restricted / android-only route redirects
      const APP_ONLY_FEATURES = ["chat", "profile", "bookmark", "bookmarks", "feed", "auth", "admin", "create-post"];
      if (APP_ONLY_FEATURES.includes(nextRoute.page.toLowerCase())) {
        let featureName = nextRoute.page.toUpperCase();
        if (featureName === "CHAT" || featureName === "BOOKMARK" || featureName === "BOOKMARKS") {
          featureName = featureName === "CHAT" ? "Global Chat Room" : "Bookmark Anime";
        } else if (featureName === "FEED" || featureName === "CREATE-POST") {
          featureName = "Feed Komunitas";
        } else {
          featureName = "Akun & Profil";
        }

        setFlashMessage(`Fitur "${featureName}" hanya tersedia di Aplikasi Android Aniku! Silakan unduh di bawah ini.`);
        window.location.hash = "#/download";
        return;
      }
      
      setRoute(nextRoute);
    };

    window.addEventListener("hashchange", handleHashChange);
    // Trigger initial check
    handleHashChange();

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  // Clear flash message when migrating off the download page
  useEffect(() => {
    if (route.page !== "download") {
      setFlashMessage("");
    }
  }, [route.page]);

  // Histats + Ads — inject sekali saat mount
  useEffect(() => {
    // Histats
    (window as any)._Hasync = (window as any)._Hasync || [];
    (window as any)._Hasync.push(['Histats.start', '1,5034451,4,7,200,30,00011111']);
    (window as any)._Hasync.push(['Histats.fasi', '1']);
    (window as any)._Hasync.push(['Histats.track_hits', '']);
    (window as any)._Hasync.push(['Histats.framed_page', '']);
    const hs = document.createElement('script');
    hs.type = 'text/javascript';
    hs.async = true;
    hs.src = '//s10.histats.com/js15_as.js';
    document.head.appendChild(hs);

    // Social Bar
    const s = document.createElement("script");
    s.src = "https://pl29823364.effectivecpmnetwork.com/a4/06/3f/a4063f7ee1b746aaca3778ec2a68b52a.js";
    document.head.appendChild(s);

    // Popunder
    const sp = document.createElement("script");
    sp.src = "https://pl29823356.effectivecpmnetwork.com/c0/7c/e3/c07ce3e4c044fbbde88437c874514c6b.js";
    document.head.appendChild(sp);


  }, []);

  // Handle active class bindings based on sizing constraints
  const getSizingClass = () => {
    switch (textSize) {
      case "kecil": return "text-sm leading-relaxed";
      case "besar": return "text-lg leading-relaxed";
      case "sedang":
      default: return "text-base leading-relaxed";
    }
  };

  // Render appropriate View switch
  const renderPage = () => {
    switch (route.page) {
      case "home":
        return (
          <Home 
            accent={accent} 
            gridLayout={gridLayout} 
            dataSource={dataSource} 
          />
        );
      case "search":
        return (
          <Search 
            accent={accent} 
            gridLayout={gridLayout} 
            dataSource={dataSource} 
            initialQuery={route.query.q || ""}
          />
        );
      case "explore":
        const activeTab = (route.query.tab as ActiveTab) || "Popular";
        return (
          <Explore 
            accent={accent} 
            gridLayout={gridLayout} 
            dataSource={dataSource} 
            initialTab={activeTab}
          />
        );
      case "schedule":
        return (
          <Schedule 
            accent={accent} 
            gridLayout={gridLayout} 
            dataSource={dataSource} 
          />
        );
      case "detail":
        return (
          <Detail 
            accent={accent} 
            dataSource={dataSource} 
            slug={route.params.slug || ""} 
          />
        );
      case "watch":
        return (
          <Watch 
            accent={accent} 
            dataSource={dataSource} 
            slug={route.params.slug || ""} 
          />
        );
      case "download":
        return (
          <Download 
            accent={accent} 
            flashMessage={flashMessage} 
          />
        );
      case "settings":
        return (
          <Settings 
            accent={accent} 
            setAccent={setAccent}
            textSize={textSize}
            setTextSize={setTextSize}
            gridLayout={gridLayout}
            setGridLayout={setGridLayout}
            dataSource={dataSource}
            setDataSource={setDataSource}
          />
        );
      default:
        return (
          <Home 
            accent={accent} 
            gridLayout={gridLayout} 
            dataSource={dataSource} 
          />
        );
    }
  };

  return (
    <div className={`min-h-screen bg-[#0A0A0A] text-neutral-100 flex flex-col ${getSizingClass()}`}>
      
      <header className="sticky top-0 z-50 w-full bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#2A2A2A] px-4 sm:px-6 h-14 flex items-center justify-between md:pl-[256px]">
        <a href="#/" className="flex items-center gap-2">
          <MonitorPlay className="w-6 h-6 text-[#E53935]" />
          <span className="text-white font-extrabold text-lg tracking-tight">
            Aniku<span className="text-[#E53935]">Web</span>
          </span>
        </a>
        <span className="text-[11px] text-neutral-500 border border-[#2A2A2A] px-2 py-1 rounded-md">
          {dataSource === 'Dayynime-v1' ? 'Source: v1' : 'Source: v2'}
        </span>
      </header>

      <div className="flex flex-1 relative">
        {/* Left Drawer DesktopSidebar */}
        <DesktopSidebar accent={accent} activePage={route.page} />

        {/* Content Shell Section */}
        <main className="flex-1 min-w-0 md:pl-[240px] pb-[80px] md:pb-8 pt-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {renderPage()}
          </div>
        </main>
      </div>


      {/* ── FOOTER ── */}
      <footer className="md:pl-[240px] bg-[#080808] border-t border-[#1A1A1A] px-6 py-10 pb-24 md:pb-10">
        <div className="max-w-7xl mx-auto">

          {/* Logo + Disclaimer */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[#E53935] rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                </svg>
              </div>
              <span className="text-white font-black text-xl tracking-tight">Aniku<span className="text-[#E53935]">Web</span></span>
            </div>
            <p className="text-neutral-500 text-xs leading-relaxed max-w-sm">
              Situs web ini tidak menyimpan file apapun di servernya. Situs ini hanya menyediakan URL ke konten media yang dihosting oleh layanan pihak ketiga.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8">
            {[
              { label: "Beranda", href: "#/" },
              { label: "Cari Anime", href: "#/search" },
              { label: "Jelajahi", href: "#/explore" },
              { label: "Jadwal Tayang", href: "#/schedule" },
              { label: "Download APK", href: "https://aniku-downloads.vercel.app/", external: true },
              { label: "Donasi", href: "https://saweria.co/Dayynime", external: true },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="text-sm text-neutral-400 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-[#1A1A1A] pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

              {/* Copyright */}
              <p className="text-xs text-neutral-600">
                &copy; {new Date().getFullYear()} AnikuWeb &bull; Dibuat oleh{" "}
                <span className="text-neutral-400 font-semibold">Dayynime</span>
                {" "}&bull;{" "}
                <span className="text-neutral-600">v1.0.0</span>
              </p>

              {/* Social icons */}
              <div className="flex items-center gap-4">
                <a href="https://t.me/Dayynime" target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-white transition-colors" title="Telegram">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </a>
                <a href="https://saweria.co/Dayynime" target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-[#E53935] transition-colors text-xs font-bold border border-neutral-800 hover:border-[#E53935] px-2.5 py-1 rounded-lg">
                  Donasi
                </a>
              </div>
            </div>
          </div>

          {/* Histats Visit Counter */}
          <div className="mt-6 flex justify-start">
            <div id="histats_counter" />
            <noscript>
              <a href="/" target="_blank">
                <img src="//sstatic1.histats.com/0.gif?5034451&101" alt="" border="0" />
              </a>
            </noscript>
          </div>

        </div>
      </footer>

      {/* Fixed bottom phone MobileBottomNav bar */}
      <MobileBottomNav accent={accent} activePage={route.page} />
    </div>
  );
}
