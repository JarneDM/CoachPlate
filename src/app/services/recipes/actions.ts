"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { IngredientInput, RecipeInput } from "@/types/interfaces/index";

function calculateMacros(ingredients: IngredientInput[], servings: number) {
  const total = ingredients.reduce(
    (acc, ing) => {
      const factor = ing.amount_g / 100;
      return {
        calories: acc.calories + ing.calories * factor,
        protein_g: acc.protein_g + ing.protein_g * factor,
        carbs_g: acc.carbs_g + ing.carbs_g * factor,
        fat_g: acc.fat_g + ing.fat_g * factor,
      };
    },
    { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 },
  );

  return {
    calories: Math.round(total.calories / servings),
    protein_g: Math.round(total.protein_g / servings),
    carbs_g: Math.round(total.carbs_g / servings),
    fat_g: Math.round(total.fat_g / servings),
  };
}

export async function createRecipe(input: RecipeInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const servings = input.servings ?? 1;
  const macros = calculateMacros(input.ingredients, servings);

  const { data: recipe, error: recipeError } = await supabase
    .from("recipes")
    .insert({
      coach_id: user!.id,
      name: input.name,
      description: input.description,
      instructions: input.instructions,
      prep_time_min: input.prep_time_min,
      meal_type: input.meal_type,
      servings,
      ...macros,
    })
    .select()
    .single();

  if (recipeError || !recipe) {
    console.error("Recipe error:", recipeError);
    return { error: "Recept aanmaken mislukt" };
  }

  for (const ing of input.ingredients) {

    let ingredientId: string | null = null;

    const { data: existing } = await supabase
      .from("ingredients")
      .select("id")
      .eq("name", ing.name)
      .maybeSingle();

    if (existing) {
      ingredientId = existing.id;
    } else {
      const { data: newIngredient, error: ingError } = await supabase
        .from("ingredients")
        .insert({
          name: ing.name,
          calories: ing.calories,
          protein_g: ing.protein_g,
          carbs_g: ing.carbs_g,
          fat_g: ing.fat_g,
        })
        .select("id")
        .single();

      if (ingError || !newIngredient) {
        console.error("Ingredient error:", ingError);
        continue; 
      }

      ingredientId = newIngredient.id;
    }

    const { error: linkError } = await supabase
      .from("recipe_ingredients")
      .insert({
        recipe_id: recipe.id,
        ingredient_id: ingredientId,
        amount_g: ing.amount_g,
      });

    if (linkError) {
      console.error("Link error:", linkError);
    }
  }

  revalidatePath("/recipes");
  redirect("/recipes");
}

export async function deleteRecipeAction(id: string) {
  const supabase = await createClient();

  await supabase.from("recipes").delete().eq("id", id);

  revalidatePath("/recipes");
}
