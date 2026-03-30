"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addRecipeToMeal({
  mealPlanDayId,
  mealType,
  recipeId,
  servings,
  planId,
}: {
  mealPlanDayId: string;
  mealType: string;
  recipeId: string;
  servings: number;
  planId: string;
}) {
  const supabase = await createClient();


  let { data: meal, } = await supabase
    .from("meals")
    .select("id")
    .eq("meal_plan_day_id", mealPlanDayId)
    .eq("meal_type", mealType)
    .maybeSingle();

  if (!meal) {
    const { data: newMeal, error } = await supabase
      .from("meals")
      .insert({ meal_plan_day_id: mealPlanDayId, meal_type: mealType })
      .select("id")
      .single();

    if (error || !newMeal) return { error: "Maaltijd aanmaken mislukt" };
    meal = newMeal;
  }

  const { error: recipeError } = await supabase.from("meal_recipes").insert({ meal_id: meal.id, recipe_id: recipeId, servings });

  if (recipeError) return { error: "Recept toevoegen mislukt" };

  revalidatePath(`/meal-plans/${planId}`);
  return { success: true };
}

export async function removeRecipeFromMeal(mealRecipeId: string, planId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("meal_recipes").delete().eq("id", mealRecipeId);

  if (error) {
    return { error: "Recept verwijderen mislukt" };
  }

  revalidatePath(`/meal-plans/${planId}`);
  return { success: true };
}
