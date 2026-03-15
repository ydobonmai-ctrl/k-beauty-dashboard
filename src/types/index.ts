export type Country = 'KR' | 'US' | 'JP';
export type Category = '스킨케어' | '메이크업';

export const KEYWORDS: Record<Category, string[]> = {
  '스킨케어': [
    '클렌징 밤',
    '자외선 차단제',
    '수분 크림',
    '진정 크림',
    '피부 장벽',
    'PDRN 세럼',
  ],
  '메이크업': [
    '립글로스',
    '립틴트',
    '쿠션 파운데이션',
    '글래스 립',
    '블러셔',
    '컬러 밤',
  ],
};

export interface KeywordTrend {
  keyword: string;
  category: Category;
  score: number; // Current Google Trends intensity (0-100)
  growth: number; // Over selected timeframe
}

export interface TrendData {
  date: string; // ISO string 
  skincare: number; // Aggregate
  makeup: number; // Aggregate
}

export interface FxRate {
  currency: 'KRW' | 'JPY' | 'USD';
  rate: number; // Base USD
  trend: 'up' | 'down' | 'stable';
  volatility: number;
}

export interface InternalSales {
  keyword: string;
  category: Category;
  country: Country;
  revenue: number; // in USD
  inventoryLevel: 'low' | 'medium' | 'high';
}

export interface MappedInsight {
  keyword: string;
  category: Category;
  country: Country;
  trendScore: number;
  growth: number;
  fxAdjustedRevenue: number; // Revenue mapped against FX rate
  inventoryLevel: 'low' | 'medium' | 'high';
  opportunityScore: number; // Computed metric based on rising demand + FX + sales
}

export interface Alert {
  id: string;
  type: 'opportunity' | 'risk' | 'info';
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  country?: Country;
  category?: Category;
  keyword?: string;
}
