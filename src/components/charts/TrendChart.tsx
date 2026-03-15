"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { TrendData } from '@/types';

interface TrendChartProps {
  data: TrendData[];
  title?: string;
}

export function TrendChart({ data, title }: TrendChartProps) {
  return (
    <div className="w-full h-full min-h-[300px] flex flex-col">
      {title && <h3 className="text-base font-semibold mb-4 text-neutral-200">{title}</h3>}
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSkincare" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d946ef" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#d946ef" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorMakeup" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#525252"
              fontSize={12}
              tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              minTickGap={30}
            />
            <YAxis stroke="#525252" fontSize={12} />
            <Tooltip
              contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#e5e5e5' }}
              labelStyle={{ color: '#a3a3a3', marginBottom: '8px' }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Area
              type="monotone"
              dataKey="skincare"
              name="Skincare"
              stroke="#d946ef"
              fillOpacity={1}
              fill="url(#colorSkincare)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="makeup"
              name="Makeup"
              stroke="#ec4899"
              fillOpacity={1}
              fill="url(#colorMakeup)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
