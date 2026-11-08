import { Country, Category, TrendData, KEYWORDS, KeywordTrend } from '@/types';
import { fetchInterest, summarizeInterest } from './google-trends';

export const SEARCH_TERMS: Record<Country, Record<Category, string[]>> = {
  KR: KEYWORDS,
  US: {
    '스킨케어': ['cleansing balm', 'sunscreen', 'moisturizer', 'soothing cream', 'skin barrier', 'PDRN serum'],
    '메이크업': ['lip gloss', 'lip tint', 'cushion foundation', 'glass lips', 'blush', 'tinted lip balm'],
  },
  JP: {
    '스킨케어': ['クレンジングバーム', '日焼け止め', '保湿クリーム', '鎮静クリーム', '肌バリア', 'PDRN 美容液'],
    '메이크업': ['リップグロス', 'リップティント', 'クッションファンデ', 'グラスリップ', 'チーク', '色付きリップバーム'],
  },
};
const CATEGORY_TERMS: Record<Country, string[]> = {
  KR: ['스킨케어', '메이크업'], US: ['skincare', 'makeup'], JP: ['スキンケア', 'メイクアップ'],
};
export interface TrendsSnapshot {
  country: Country;
  status: 'connected' | 'unavailable';
  fetchedAt: string;
  lastDate?: string;
  error?: string;
  timeline: TrendData[];
  keywords: KeywordTrend[];
}
const snapshots = new Map<Country, { expires: number; value: Promise<TrendsSnapshot> }>();

async function loadSnapshot(country: Country): Promise<TrendsSnapshot> {
  try {
    const categoryPoints = await fetchInterest(country, CATEGORY_TERMS[country]);
    const keywords: KeywordTrend[] = [];
    for (const category of ['스킨케어', '메이크업'] as Category[]) {
      const terms = SEARCH_TERMS[country][category];
      // Google accepts at most five comparison terms. Split each six-term list.
      for (let start = 0; start < terms.length; start += 3) {
        const points = await fetchInterest(country, terms.slice(start, start + 3));
        terms.slice(start, start + 3).forEach((_, index) => {
          if (points.some(point => point.values[index] > 0)) keywords.push({
            country, category, keyword: KEYWORDS[category][start + index],
            ...summarizeInterest(points, index),
          });
        });
      }
    }
    return { country, status: 'connected', fetchedAt: new Date().toISOString(),
      lastDate: categoryPoints.at(-1)?.date, keywords,
      timeline: categoryPoints.map(point => ({ date: point.date, skincare: point.values[0], makeup: point.values[1] })),
    };
  } catch (error) {
    return { country, status: 'unavailable', fetchedAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Google Trends 연결 실패', timeline: [], keywords: [],
    };
  }
}

export function getTrendsSnapshot(country: Country): Promise<TrendsSnapshot> {
  const cached = snapshots.get(country);
  if (cached && cached.expires > Date.now()) return cached.value;
  const entry = { expires: Infinity, value: loadSnapshot(country) };
  snapshots.set(country, entry);
  void entry.value.then(result => { entry.expires = Date.now() + (result.status === 'connected' ? 60 * 60_000 : 5 * 60_000); });
  return entry.value;
}
export async function getTrendsData(country: Country, days = 30): Promise<TrendData[]> {
  return (await getTrendsSnapshot(country)).timeline.slice(-days);
}
export async function getKeywordTrends(country: Country, category: Category): Promise<KeywordTrend[]> {
  return (await getTrendsSnapshot(country)).keywords.filter(item => item.category === category);
}

import { MappedInsight } from '@/types';
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
        const trend = flatTrends.find(t => t.keyword === keyword && t.category === category && t.country === country);
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
            growthAvailable: trend.growthAvailable,
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
