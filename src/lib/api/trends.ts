import { Country, Category, TrendData, KEYWORDS, KeywordTrend } from '@/types';
import { subDays, format } from 'date-fns';

const generateMockTrends = (country: Country, days: number): TrendData[] => {
  // Use a pseudo-random approach that remains relatively stable for the same day
  return Array.from({ length: days }).map((_, i) => {
    const date = format(subDays(new Date(), days - i - 1), 'yyyy-MM-dd');
    let skincareBase = country === 'KR' ? 75 : country === 'JP' ? 55 : 65;
    let makeupBase = country === 'JP' ? 85 : country === 'US' ? 75 : 60;

    // Predictable noise based on index
    const noiseS = (Math.sin(i) * 15);
    const noiseM = (Math.cos(i) * 15);

    return {
      date,
      skincare: Math.round(Math.max(0, Math.min(100, skincareBase + noiseS))),
      makeup: Math.round(Math.max(0, Math.min(100, makeupBase + noiseM))),
    };
  });
};

export async function getTrendsData(country: Country, days: number = 30): Promise<TrendData[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return generateMockTrends(country, days);
}

export async function getKeywordTrends(country: Country, category: Category): Promise<KeywordTrend[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const keywords = KEYWORDS[category];

  return keywords.map((keyword, index) => {
    let score = 50 + (Math.sin(index) * 20);
    let growth = (Math.cos(index) * 30);

    // Hero products overrides
    if (keyword === 'PDRN 세럼' && country === 'KR') { score = 95; growth = 120; }
    if (keyword === '립글로스' && country === 'US') { score = 88; growth = 45; }
    if (keyword === '쿠션 파운데이션' && country === 'JP') { score = 92; growth = 60; }
    if (keyword === '컬러 밤' && country === 'KR') { score = 85; growth = 80; }
    if (keyword === '피부 장벽' && country === 'US') { score = 75; growth = 25; }

    return {
      keyword,
      category,
      score: Math.round(score),
      growth: Math.round(growth),
    };
  });
}

import { MappedInsight, FxRate, InternalSales } from '@/types';
import { getFxRates } from './fx';
import { getInternalSales } from './sales';
import { getAgentAnalysis } from './agent';

export async function getMappedInsights(): Promise<MappedInsight[]> {
  const countries: Country[] = ['KR', 'US', 'JP'];
  const categories: Category[] = ['스킨케어', '메이크업'];

  const [fxRates, ...allKeywordTrends] = await Promise.all([
    getFxRates(),
    ...countries.flatMap(country =>
      categories.map(category => getKeywordTrends(country, category))
    )
  ]);

  const allSales = await Promise.all(countries.map(country => getInternalSales(country)));
  const flatSales = allSales.flat();
  const flatTrends = allKeywordTrends.flat();

  const insights: MappedInsight[] = [];

  countries.forEach(country => {
    const fx = fxRates.find(f => f.currency === (country === 'KR' ? 'KRW' : country === 'JP' ? 'JPY' : 'USD'));
    const fxFavorability = fx ? (fx.trend === 'up' ? 20 : fx.trend === 'down' ? -20 : 0) : 0;

    categories.forEach(category => {
      KEYWORDS[category].forEach(keyword => {
        const trend = flatTrends.find(t => t.keyword === keyword && t.category === category);
        const sale = flatSales.find(s => s.keyword === keyword && s.country === country);

        if (trend && sale) {
          // Opportunity Score Formula: (Growth * 0.4) + (Score * 0.3) + (FX * 0.2) + (Inventory_Low ? 10 : 0)
          const inventoryBonus = sale.inventoryLevel === 'low' ? 10 : 0;
          const oppScore = (trend.growth * 0.4) + (trend.score * 0.3) + fxFavorability + inventoryBonus;

          insights.push({
            keyword,
            category,
            country,
            trendScore: trend.score,
            growth: trend.growth,
            fxAdjustedRevenue: sale.revenue, // already in USD
            inventoryLevel: sale.inventoryLevel,
            opportunityScore: Math.round(oppScore)
          });
        }
      });
    });
  });

  const mappedInsights = await Promise.all(insights.map(async (insight) => {
    const agentInsight = await getAgentAnalysis(insight);
    return { ...insight, agentInsight };
  }));

  return mappedInsights;
}

export async function getInsightByContext(country: Country, category: Category, keyword: string): Promise<MappedInsight | undefined> {
  const allInsights = await getMappedInsights();
  return allInsights.find(i =>
    i.country === country &&
    i.category === category &&
    i.keyword === keyword
  );
}
