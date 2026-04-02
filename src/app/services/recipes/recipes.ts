import { createClient } from "@/lib/supabase/server";

export async function getRecipes() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase.from("recipes").select("*").eq("coach_id", user!.id).order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }

  return data;
}

export async function GetPublicRecipes() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("recipes").select("*").eq("public", true).order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching public recipes:", error);
    return [];
  }

  return data;
}

export async function getRecipesPaginated(page: number, pageSize: number, mealtype?: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const from = (safePage - 1) * safePageSize;
  const to = from + safePageSize - 1;

  const { data, error, count } = await supabase
    .from("recipes")
    .select("*", { count: "exact" })
    .eq("coach_id", user!.id)
    .eq(mealtype ? "meal_type" : "", mealtype)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching paginated recipes:", error);
    return { data: [], totalCount: 0 };
  }

  return { data: data ?? [], totalCount: count ?? 0 };
}

export async function getPublicRecipePaginated(page: number, pageSize: number, mealType?: string) {
  const supabase = await createClient();

  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const from = (safePage - 1) * safePageSize;
  const to = from + safePageSize - 1;

  const { data, error, count } = await supabase
    .from("recipes")
    .select("*", { count: "exact" })
    .eq("public", true)
    .eq(mealType ? "meal_type" : "", mealType)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching paginated public recipes:", error);
    return { data: [], totalCount: 0 };
  }

  return { data: data ?? [], totalCount: count ?? 0 };
}

export async function getRecipeById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("recipes")
    .select(
      `
      *,
      recipe_ingredients (
        id,
        amount_g,
        ingredients (
          id,
          name,
          calories,
          protein_g,
          carbs_g,
          fat_g
        )
      )
    `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching recipe:", error);
    return null;
  }

  return data;
}

export async function deleteRecipe(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("recipes").delete().eq("id", id);

  if (error) {
    console.error("Error deleting recipe:", error);
    return false;
  }

  return true;
}
