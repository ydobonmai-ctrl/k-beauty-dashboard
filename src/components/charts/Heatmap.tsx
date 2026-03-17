"use client";

import { KeywordTrend, Country, Category } from '@/types';

interface HeatmapProps {
  data: KeywordTrend[];
  country: Country;
  category: Category;
}

export function Heatmap({ data, country, category }: HeatmapProps) {
  return (
    <div className="w-full bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-lg font-bold text-neutral-800 tracking-tight">{category} 키워드 분석</h3>
        <span className="px-3 py-1 bg-neutral-100 text-neutral-500 rounded-full text-[11px] font-black tracking-widest uppercase">
          {country}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {data.map((item) => {
          let bgClass = "bg-neutral-50";
          let textClass = "text-neutral-600";

          if (item.score > 85) {
            bgClass = "bg-gradient-to-br from-fuchsia-600 to-pink-600 shadow-lg shadow-fuchsia-200";
            textClass = "text-white";
          } else if (item.score > 70) {
            bgClass = "bg-fuchsia-500 border border-fuchsia-400";
            textClass = "text-white";
          } else if (item.score > 50) {
            bgClass = "bg-fuchsia-50 border border-fuchsia-100";
            textClass = "text-fuchsia-700";
          } else if (item.score > 30) {
            bgClass = "bg-neutral-100 border border-neutral-200";
          }

          return (
            <div
              key={item.keyword}
              className={`${bgClass} rounded-2xl p-5 flex flex-col justify-between aspect-square transition-all hover:scale-[1.05] duration-300 cursor-pointer group shadow-sm hover:shadow-md`}
            >
              <div className={`font-black ${textClass} leading-tight text-[15px] group-hover:underline decoration-white/30 underline-offset-4`}>
                {item.keyword}
              </div>
              <div className="flex items-end justify-between mt-auto">
                <div className={`text-4xl font-black ${textClass} tracking-tighter`}>
                  {item.score}
                </div>
                <div className={`text-[12px] ${item.growth >= 0 ? 'text-emerald-600' : 'text-rose-600'} font-black bg-white/40 px-2 py-1 rounded backdrop-blur-sm border border-white/20`}>
                  {item.growth >= 0 ? '▲' : '▼'}{Math.abs(item.growth)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
