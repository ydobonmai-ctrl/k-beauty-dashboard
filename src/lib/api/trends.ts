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
    if (keyword === 'PDRN serum' && country === 'KR') { score = 95; growth = 120; }
    if (keyword === 'lip gloss' && country === 'US') { score = 88; growth = 45; }
    if (keyword === 'cushion foundation' && country === 'JP') { score = 92; growth = 60; }
    if (keyword === 'color balm' && country === 'KR') { score = 85; growth = 80; }
    if (keyword === 'skin barrier' && country === 'US') { score = 75; growth = 25; }

    return {
      keyword,
      category,
      score: Math.round(score),
      growth: Math.round(growth),
    };
  });
}
