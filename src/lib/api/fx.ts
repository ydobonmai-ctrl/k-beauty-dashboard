import { FxRate } from '@/types';

export async function getFxRates(): Promise<FxRate[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return [
    { currency: 'USD', rate: 1, trend: 'stable', volatility: 0 },
    { currency: 'KRW', rate: 1350.5, trend: 'up', volatility: 1.2 },
    { currency: 'JPY', rate: 151.2, trend: 'up', volatility: 0.8 },
  ];
}
