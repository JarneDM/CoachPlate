export interface FoodFactsResult {
  id: string;
  name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

export async function searchIngredients(query: string): Promise<FoodFactsResult[]> {
  if (!query || query.length < 2) return [];

  try {
    const res = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=10&fields=id,product_name,nutriments`,
      { next: { revalidate: 3600 } },
    );

    const data = await res.json();

    return data.products
      .filter((p: any) => p.product_name && p.nutriments?.["energy-kcal_100g"])
      .map((p: any) => ({
        id: p.id,
        name: p.product_name,
        calories: Math.round(p.nutriments["energy-kcal_100g"] ?? 0),
        protein_g: Math.round(p.nutriments["proteins_100g"] ?? 0),
        carbs_g: Math.round(p.nutriments["carbohydrates_100g"] ?? 0),
        fat_g: Math.round(p.nutriments["fat_100g"] ?? 0),
      }));
  } catch (error) {
    console.error("Open Food Facts error:", error);
    return [];
  }
}
