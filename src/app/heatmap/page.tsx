import { getKeywordTrends } from '@/lib/api/trends';
import { Heatmap } from '@/components/charts/Heatmap';
import { HeatmapFilter } from '@/components/dashboard/HeatmapFilter';

export default async function HeatmapPage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string }>;
}) {
  const { country: selectedCountry } = await searchParams;

  const countries: ('KR' | 'US' | 'JP')[] = ['KR', 'US', 'JP'];
  const categories: ('스킨케어' | '메이크업')[] = ['스킨케어', '메이크업'];

  const allDataPromises = countries.flatMap(country =>
    categories.map(async (category) => ({
      country,
      category,
      data: await getKeywordTrends(country, category)
    }))
  );

  const allData = await Promise.all(allDataPromises);

  const filteredData = selectedCountry && selectedCountry !== '전체'
    ? allData.filter(d => d.country === selectedCountry)
    : allData;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-neutral-800 mb-2">키워드 히트맵 분석</h2>
          <p className="text-neutral-500">K-Beauty 주요 키워드별 검색 집약도(0-100) 및 성장 추이 시각화.</p>
        </div>
        <div className="flex gap-2">
          <HeatmapFilter selected={selectedCountry || '전체'} />
        </div>
      </div>

      <div className="grid xl:grid-cols-2 gap-8">
        {filteredData.map((item, idx) => (
          <Heatmap
            key={`${item.country}-${item.category}-${idx}`}
            data={item.data}
            country={item.country as any}
            category={item.category as any}
          />
        ))}
      </div>
    </div>
  );
}
