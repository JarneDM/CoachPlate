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
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Niet ingelogd" };
  }

  const servings = input.servings ?? 1;
  const macros = calculateMacros(input.ingredients, servings);
  const normalizedRecipeName = input.name.trim();

  const { data: existingRecipe, error: existsError } = await supabase
    .from("recipes")
    .select("id")
    .eq("coach_id", user.id)
    .ilike("name", normalizedRecipeName)
    .maybeSingle();

  if (existsError) {
    console.error("Recipe exists check error:", existsError);
    return { error: "Controle op bestaand recept mislukt" };
  }

  if (existingRecipe) {
    return { error: "Er bestaat al een recept met deze naam" };
  }

  const { data: recipe, error: recipeError } = await supabase
    .from("recipes")
    .insert({
      coach_id: user.id,
      name: normalizedRecipeName,
      description: input.description,
      instructions: input.instructions,
      prep_time_min: input.prep_time_min,
      meal_type: input.meal_type,
      servings,
      public: input.public,
      ...macros,
    })
    .select("id")
    .single();

  if (recipeError || !recipe) {
    console.error("Recipe error:", recipeError);
    return { error: "Recept aanmaken mislukt" };
  }

  for (const ing of input.ingredients) {
    let ingredientId: string | null = null;
    const normalizedIngredientName = ing.name.trim();

    const { data: existingIngredient } = await supabase
      .from("ingredients")
      .select("id")
      .ilike("name", normalizedIngredientName)
      .maybeSingle();

    if (existingIngredient) {
      ingredientId = existingIngredient.id;
    } else {
      const { data: newIngredient, error: ingError } = await supabase
        .from("ingredients")
        .insert({
          name: normalizedIngredientName,
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

    const { error: linkError } = await supabase.from("recipe_ingredients").insert({
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

export async function updateRecipe(id: string, input: RecipeInput) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Niet ingelogd" };
  }

  const servings = input.servings ?? 1;
  const macros = calculateMacros(input.ingredients, servings);

  // Update the recipe
  const { error: updateError } = await supabase
    .from("recipes")
    .update({
      name: input.name.trim(),
      description: input.description,
      instructions: input.instructions,
      prep_time_min: input.prep_time_min,
      meal_type: input.meal_type,
      servings,
      public: input.public,
      ...macros,
    })
    .eq("id", id)
    .eq("coach_id", user.id);

  if (updateError) {
    console.error("Recipe update error:", updateError);
    return { error: "Recept bijwerken mislukt" };
  }

  // Delete old ingredients
  const { error: deleteError } = await supabase.from("recipe_ingredients").delete().eq("recipe_id", id);

  if (deleteError) {
    console.error("Delete ingredients error:", deleteError);
  }

  // Add new ingredients
  for (const ing of input.ingredients) {
    let ingredientId: string | null = null;
    const normalizedIngredientName = ing.name.trim();

    const { data: existingIngredient } = await supabase
      .from("ingredients")
      .select("id")
      .ilike("name", normalizedIngredientName)
      .maybeSingle();

    if (existingIngredient) {
      ingredientId = existingIngredient.id;
    } else {
      const { data: newIngredient, error: ingError } = await supabase
        .from("ingredients")
        .insert({
          name: normalizedIngredientName,
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

    const { error: linkError } = await supabase.from("recipe_ingredients").insert({
      recipe_id: id,
      ingredient_id: ingredientId,
      amount_g: ing.amount_g,
    });

    if (linkError) {
      console.error("Link error:", linkError);
    }
  }

  revalidatePath("/recipes");
  revalidatePath(`/recipes/${id}`);
  redirect("/recipes");
}

export async function deleteRecipeAction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("recipes").delete().eq("id", id);

  if (error) {
    console.error("Delete error:", error);
    return { error: "Recept verwijderen mislukt" };
  }

  revalidatePath("/recipes");
}
