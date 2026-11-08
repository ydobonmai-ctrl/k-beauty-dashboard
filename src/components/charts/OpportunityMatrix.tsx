"use client";

import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine, Label } from 'recharts';
import { MappedInsight } from '@/types';

interface OpportunityMatrixProps {
  insights: MappedInsight[];
}

export function OpportunityMatrix({ insights }: OpportunityMatrixProps) {
  const data = insights.filter(i => i.growthAvailable).map(i => ({
    name: i.keyword,
    x: i.growth, // 수요 성장성
    y: i.opportunityScore, // 기회 지수 (FX 등 반영)
    z: i.trendScore, // Own-keyword relative interest, not absolute demand
    country: i.country,
    category: i.category
  }));

  return (
    <div className="w-full h-[450px] bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-xl font-black text-neutral-800 tracking-tighter">시장 기회 매트릭스 (Opportunity Matrix)</h3>
          <p className="text-sm text-neutral-500 font-medium">성장 추세와 수익 요인을 교차 분석한 시장 진입 전략</p>
        </div>
        <div className="flex space-x-2">
          <div className="flex items-center space-x-2 text-[11px] font-black text-neutral-400">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>고성장/수익</span>
          </div>
          <div className="flex items-center space-x-2 text-[11px] font-black text-neutral-400">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <span>정체/위험</span>
          </div>
        </div>
      </div>

      <div className="w-full h-full pb-12">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
            <XAxis
              type="number"
              dataKey="x"
              name="성장률"
              unit="%"
              stroke="#a3a3a3"
              fontSize={11}
              fontWeight={700}
              domain={['auto', 'auto']}
            >
              <Label value="수요 성장성 (Growth)" offset={-10} position="insideBottom" fill="#737373" fontSize={12} fontWeight={800} />
            </XAxis>
            <YAxis
              type="number"
              dataKey="y"
              name="기회지수"
              stroke="#a3a3a3"
              fontSize={11}
              fontWeight={700}
            >
              <Label value="전략 기회 지수" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} fill="#737373" fontSize={12} fontWeight={800} />
            </YAxis>
            <ZAxis type="number" dataKey="z" range={[100, 1500]} name="현재수요" />
            <Tooltip
              cursor={{ strokeDasharray: '3 3', stroke: '#d4d4d4' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-neutral-100 min-w-[180px]">
                      <div className="text-[10px] font-black text-fuchsia-600 mb-1 uppercase tracking-widest">{item.country} | {item.category}</div>
                      <div className="text-sm font-black text-neutral-900 mb-2">{item.name}</div>
                      <div className="space-y-1 border-t border-neutral-100 pt-2">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-neutral-500">성장률</span>
                          <span className="text-emerald-600">{item.x}%</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-neutral-500">기회지수</span>
                          <span className="text-fuchsia-600">{item.y}점</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-neutral-500">수요강도</span>
                          <span className="text-neutral-900">{item.z}</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine x={0} stroke="#e5e5e5" />
            <ReferenceLine y={50} stroke="#e5e5e5" />
            <Scatter name="Market Insights" data={data}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.x > 30 && entry.y > 60 ? '#10b981' : entry.x < 0 ? '#f43f5e' : '#d946ef'}
                  fillOpacity={0.8}
                  stroke={entry.x > 30 && entry.y > 60 ? '#059669' : entry.x < 0 ? '#e11d48' : '#c026d3'}
                  strokeWidth={2}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
