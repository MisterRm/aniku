import React, { useEffect, useState } from "react";
import { ArrowDownToLine, Smartphone } from "lucide-react";

const GITHUB_API = "https://api.github.com/repos/RMBLOGG/aniku-app/releases/latest";

export function APKStickyBanner() {
  const [apkUrl, setApkUrl] = useState<string>("https://github.com/RMBLOGG/aniku-app/releases/latest");
  const [version, setVersion] = useState<string | null>(null);

  useEffect(() => {
    fetch(GITHUB_API)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (!data) return;
        const apk = data.assets?.find((a: any) => a.name.endsWith(".apk"));
        if (apk?.browser_download_url) setApkUrl(apk.browser_download_url);
        if (data.tag_name) setVersion(data.tag_name);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="w-full bg-gradient-to-r from-[#1A0A0A] to-[#2A0E0E] border border-[#E53935] rounded-xl mb-6 py-3 px-4 shadow-lg">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <Smartphone className="w-7 h-7 text-[#E53935] shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-white">
              Versi web ini terbatas. Dapatkan fitur lengkap di aplikasi Android!
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              APK Gratis &bull; Bebas Iklan &bull; Android 7.0+ &bull; Bookmark, Chat &amp; Feed
              {version && <span className="ml-1 text-neutral-500">— {version}</span>}
            </p>
          </div>
        </div>
        <a
          href={apkUrl}
          className="flex items-center gap-2 bg-[#E53935] hover:bg-[#c62828] transition-colors px-4 py-2 text-sm font-bold text-white rounded-lg shrink-0"
        >
          <ArrowDownToLine className="w-4 h-4" />
          <span>Download APK</span>
        </a>
      </div>
    </div>
  );
}
