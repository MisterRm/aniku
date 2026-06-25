import React from "react";
import { Home, Search, Compass, Calendar, Smartphone, Sliders, PlayCircle } from "lucide-react";
import { AccentColor } from "../types";
import { ACCENTS } from "../lib/settings";

interface SidebarProps {
  accent: AccentColor;
  activePage: string;
}

export function DesktopSidebar({ accent, activePage }: SidebarProps) {
  const currentAccent = ACCENTS[accent];

  const NAV_ITEMS = [
    { page: "home", title: "Beranda", icon: Home, href: "#/" },
    { page: "search", title: "Pencarian", icon: Search, href: "#/search" },
    { page: "explore", title: "Jelajahi", icon: Compass, href: "#/explore" },
    { page: "schedule", title: "Jadwal", icon: Calendar, href: "#/schedule" },
    { page: "download", title: "Download APK", icon: Smartphone, href: "#/download" },
    { page: "settings", title: "Pengaturan", icon: Sliders, href: "#/settings" },
  ];

  return (
    <aside className="w-[240px] h-screen bg-[#0E0E0E] border-r border-[#1C1C1C] fixed top-0 left-0 flex flex-col justify-between py-6 px-4 shrink-0 overflow-y-auto hidden md:flex z-40">
      {/* Brand header */}
      <div className="space-y-8">
        <a href="#/" className="flex items-center gap-3 px-2 group">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 ${currentAccent.glowingBg}`}>
            <span className="text-xl font-black">A</span>
          </div>
          <div>
            <h1 className="text-xl font-black text-white leading-none font-display uppercase tracking-widest group-hover:text-amber-500 transition-colors">
              ANIKU
            </h1>
            <span className="text-[10px] text-neutral-510 font-bold uppercase tracking-wide">
              Versi Web
            </span>
          </div>
        </a>

        {/* Navigation list */}
        <nav className="space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.page;
            return (
              <a
                key={item.page}
                href={item.href}
                className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 ${
                  isActive
                    ? `${currentAccent.bg} text-white ${currentAccent.glowingBg}`
                    : "text-neutral-400 hover:text-white hover:bg-neutral-900/50"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.title}</span>
              </a>
            );
          })}
        </nav>
      </div>

      {/* Footer copyright and creator logo */}
      <div className="px-2 space-y-3 border-t border-[#1C1C1C] pt-4 text-center">
        <span className="text-[10px] text-neutral-500 font-bold block">
          Platform dibuat oleh Sankavollerei &bull; Dayynime Group.
        </span>
        <a
          href="https://aniku-downloads.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 w-full bg-[#E53935]/10 hover:bg-[#E53935]/25 border border-[#E53935]/20 text-red-500 text-xs font-bold py-2 px-3 rounded-lg transition"
        >
          <Smartphone className="w-3.5 h-3.5 animate-pulse" />
          <span>Dapatkan APK Android</span>
        </a>
      </div>
    </aside>
  );
}
