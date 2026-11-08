import { getTrendsSnapshot } from '@/lib/api/trends';
import type { Country } from '@/types';

export async function TrendsSource() {
  const snapshots = await Promise.all((['KR', 'US', 'JP'] as Country[]).map(getTrendsSnapshot));
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-5 text-sm space-y-3">
      <p className="font-bold">데이터 출처: Google Trends·환율(ECB) 실데이터 · 매출·재고는 샘플 · AI 제안은 Gemini(실데이터만 근거)</p>
      <div className="flex flex-wrap gap-3">
        {snapshots.map(snapshot => (
          <div key={snapshot.country} className={snapshot.status === 'connected' ? 'text-emerald-700' : 'text-amber-700'}>
            <a className="underline" target="_blank" rel="noreferrer" href={`https://trends.google.com/trends/explore?geo=${snapshot.country}&date=today%201-m`}>
              {snapshot.country}
            </a>: {snapshot.status === 'connected'
              ? `연결됨 · 데이터 ${snapshot.lastDate}까지 · 수집 ${new Date(snapshot.fetchedAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}`
              : `수집 불가 (${snapshot.error})`}
          </div>
        ))}
      </div>
      <p className="text-neutral-500">최근 30일의 완료된 일별 데이터, 1시간 캐시. 키워드 점수는 각 검색어의 기간 내 최고치를 100으로 환산한 최근 7일 평균이며, 국가·키워드 간 검색량 비교값이 아닙니다. 성장률은 직전 7일 대비 관심도 변화입니다. 기준값이 0이면 비교 불가로 표시합니다. 데이터가 부족한 검색어는 제외합니다.</p>
    </section>
  );
}
