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

      if (keyword === 'PDRN serum' && country === 'KR') { baseRevenue = 120000; inventoryLevel = 'low'; }
      if (keyword === 'cushion foundation' && country === 'JP') { baseRevenue = 95000; inventoryLevel = 'medium'; }
      if (keyword === 'lip gloss' && country === 'US') { baseRevenue = 150000; inventoryLevel = 'medium'; }

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
