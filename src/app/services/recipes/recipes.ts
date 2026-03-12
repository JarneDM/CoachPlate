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
