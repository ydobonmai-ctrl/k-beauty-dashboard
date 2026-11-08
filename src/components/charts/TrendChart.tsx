"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { TrendData } from '@/types';

interface TrendChartProps {
  data: TrendData[];
  title?: string;
}

export function TrendChart({ data, title }: TrendChartProps) {
  return (
    <div className="w-full h-[350px] flex flex-col">
      {title && <h3 className="text-xl font-black tracking-tighter text-neutral-800 mb-6">{title}</h3>}
      {data.length === 0 && <p className="text-amber-700">Google Trends 데이터를 가져오지 못했습니다. 연결 상태를 확인하세요.</p>}
      <div className="flex-1 w-full relative min-h-0">
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
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#a3a3a3"
              fontSize={11}
              fontWeight={600}
              tickFormatter={(value) => new Date(value).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
              minTickGap={30}
              dy={10}
            />
            <YAxis stroke="#a3a3a3" fontSize={11} fontWeight={600} />
            <Tooltip
              contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #f0f0f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ color: '#404040', fontSize: '12px', fontWeight: 'bold' }}
              labelStyle={{ color: '#171717', marginBottom: '4px', fontWeight: 'black', fontSize: '14px' }}
            />
            <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px', fontSize: '12px', fontWeight: 'bold' }} />
            <Area
              type="monotone"
              dataKey="skincare"
              name="스킨케어"
              stroke="#d946ef"
              fillOpacity={1}
              fill="url(#colorSkincare)"
              strokeWidth={3}
            />
            <Area
              type="monotone"
              dataKey="makeup"
              name="메이크업"
              stroke="#ec4899"
              fillOpacity={1}
              fill="url(#colorMakeup)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
