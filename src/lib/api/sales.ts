import { Country, Category, InternalSales, KEYWORDS } from '@/types';

export async function getInternalSales(country: Country): Promise<InternalSales[]> {
  await new Promise(resolve => setTimeout(resolve, 400));

  const allSales: InternalSales[] = [];

  Object.keys(KEYWORDS).forEach((cat) => {
    const category = cat as Category;
    KEYWORDS[category].forEach((keyword, index) => {
      // Deterministic pseudo-random revenue for consistency
      let baseRevenue = 15000 + (index * 5000) + (country === 'US' ? 20000 : 0);
      let inventoryLevel: 'low' | 'medium' | 'high' = index % 3 === 0 ? 'low' : index % 2 === 0 ? 'high' : 'medium';

      if (keyword === 'PDRN 세럼' && country === 'KR') { baseRevenue = 120000; inventoryLevel = 'low'; }
      if (keyword === '쿠션 파운데이션' && country === 'JP') { baseRevenue = 95000; inventoryLevel = 'medium'; }
      if (keyword === '립글로스' && country === 'US') { baseRevenue = 150000; inventoryLevel = 'medium'; }

      allSales.push({
        keyword,
        category,
        country,
        revenue: baseRevenue,
        inventoryLevel,
      });
    });
  });

  return allSales;
}
