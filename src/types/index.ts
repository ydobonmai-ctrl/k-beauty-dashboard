export type Country = 'KR' | 'US' | 'JP';
export type Category = 'Skincare' | 'Makeup';

export const KEYWORDS: Record<Category, string[]> = {
  Skincare: [
    'cleansing balm',
    'sunscreen',
    'moisturizer',
    'soothing cream',
    'skin barrier',
    'PDRN serum',
  ],
  Makeup: [
    'lip gloss',
    'lip tint',
    'cushion foundation',
    'glass lips',
    'blush',
    'color balm',
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
