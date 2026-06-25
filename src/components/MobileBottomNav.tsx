import React from "react";
import { Home, Search, Compass, Calendar, Smartphone } from "lucide-react";
import { AccentColor } from "../types";
import { ACCENTS } from "../lib/settings";

interface BottomNavProps {
  accent: AccentColor;
  activePage: string;
}

export function MobileBottomNav({ accent, activePage }: BottomNavProps) {
  const currentAccent = ACCENTS[accent];

  const MOBILE_ITEMS = [
    { page: "home", title: "Home", icon: Home, href: "#/" },
    { page: "search", title: "Cari", icon: Search, href: "#/search" },
    { page: "explore", title: "Explore", icon: Compass, href: "#/explore" },
    { page: "schedule", title: "Jadwal", icon: Calendar, href: "#/schedule" },
    { page: "download", title: "Get APK", icon: Smartphone, href: "#/download" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-[64px] bg-[#0E0E0E]/95 backdrop-blur-md border-t border-[#1C1C1C] flex items-center justify-around px-2 z-40 shadow-xl">
      {MOBILE_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = activePage === item.page;
        return (
          <a
            key={item.page}
            href={item.href}
            className="flex flex-col items-center justify-center py-2 px-3 grow text-center gap-1 group"
          >
            <div className={`p-1 rounded-xl transition-all duration-300 ${
              isActive 
                ? `${currentAccent.bg} text-white shadow-md scale-105` 
                : "text-neutral-500 hover:text-white"
            }`}>
              <Icon className="w-5 h-5 shrink-0" />
            </div>
            <span className={`text-[9px] font-bold tracking-wider leading-none ${
              isActive ? currentAccent.text : "text-neutral-500"
            }`}>
              {item.title}
            </span>
          </a>
        );
      })}
    </div>
  );
}
