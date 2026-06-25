import React from "react";

interface ShimmerGridProps {
  count?: number;
  layout?: 'cols-2' | 'cols-3' | 'list';
}

export function ShimmerGrid({ count = 6, layout = 'cols-3' }: ShimmerGridProps) {
  const isList = layout === 'list';

  if (isList) {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex gap-4 bg-[#161616] border border-[#2A2A2A] rounded-xl p-3 animate-pulse"
          >
            {/* Poster cover */}
            <div className="w-24 sm:w-28 aspect-[2/3] rounded-lg bg-neutral-800 shrink-0" />

            {/* Info lines */}
            <div className="flex flex-col justify-between py-1 flex-1">
              <div className="space-y-2">
                <div className="h-4 bg-neutral-800 rounded w-1/3" />
                <div className="h-6 bg-neutral-800 rounded w-3/4" />
              </div>
              <div className="space-y-1.5 pt-2">
                <div className="h-4 bg-neutral-800 rounded w-1/2" />
                <div className="h-4 bg-neutral-800 rounded w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid gap-4 sm:gap-6 ${
      layout === 'cols-2'
        ? 'grid-cols-2 lg:grid-cols-4'
        : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
    }`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col bg-[#161616] border border-[#2A2A2A] rounded-2xl overflow-hidden animate-pulse"
        >
          {/* Poster 2:3 */}
          <div className="w-full aspect-[2/3] bg-neutral-800" />
          
          {/* Footer details */}
          <div className="p-4 space-y-3">
            <div className="h-5 bg-neutral-800 rounded w-5/6" />
            <div className="h-4 bg-neutral-800 rounded w-1/2" />
            <div className="flex justify-between pt-2 border-t border-neutral-800">
              <div className="h-3 bg-neutral-800 rounded w-1/3" />
              <div className="h-3 bg-neutral-800 rounded w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
