"use client";

import { KeywordTrend, Country, Category } from '@/types';

interface HeatmapProps {
  data: KeywordTrend[];
  country: Country;
  category: Category;
}

export function Heatmap({ data, country, category }: HeatmapProps) {
  return (
    <div className="w-full bg-neutral-900 rounded-xl border border-neutral-800 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white tracking-tight">{category} Heatmap</h3>
        <span className="px-3 py-1 bg-neutral-800 text-neutral-300 rounded-full text-sm font-medium">
          {country}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {data.map((item) => {
          let bgClass = "bg-neutral-800/50";
          let textClass = "text-neutral-300";

          if (item.score > 85) {
            bgClass = "bg-gradient-to-br from-fuchsia-500 to-pink-600 shadow-lg shadow-fuchsia-500/20";
            textClass = "text-white";
          } else if (item.score > 70) {
            bgClass = "bg-fuchsia-600/80 border border-fuchsia-500/50";
            textClass = "text-white";
          } else if (item.score > 50) {
            bgClass = "bg-fuchsia-900/40 border border-fuchsia-800/50";
            textClass = "text-fuchsia-100";
          } else if (item.score > 30) {
            bgClass = "bg-neutral-800 border border-neutral-700";
          }

          return (
            <div
              key={item.keyword}
              className={`${bgClass} rounded-xl p-4 flex flex-col justify-between aspect-[4/3] transition-all hover:scale-[1.03] duration-300 cursor-pointer group`}
            >
              <div className={`font-semibold ${textClass} leading-tight group-hover:underline decoration-white/30 underline-offset-4`}>
                {item.keyword}
              </div>
              <div className="flex items-end justify-between mt-4">
                <div className={`text-3xl font-black ${textClass} tracking-tighter`}>
                  {item.score}
                </div>
                <div className={`text-sm ${item.growth >= 0 ? 'text-emerald-400' : 'text-rose-400'} font-bold bg-black/20 px-2 py-1 rounded backdrop-blur-sm`}>
                  {item.growth >= 0 ? '+' : ''}{item.growth}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
