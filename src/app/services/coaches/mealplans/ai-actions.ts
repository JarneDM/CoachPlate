"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface GeneratedMeal {
  name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  ingredients?: GeneratedIngredient[];
}

interface GeneratedIngredient {
  name: string;
  amount_g: number;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

interface GeneratedDay {
  day: string;
  meals: {
    ontbijt: GeneratedMeal;
    lunch: GeneratedMeal;
    avondeten: GeneratedMeal;
    snack: GeneratedMeal;
  };
}

export async function createMealPlanFromAI({
  name,
  clientId,
  generatedPlan,
}: {
  name: string;
  clientId: string;
  generatedPlan: { days: GeneratedDay[] };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("1. createMealPlanFromAI aangeroepen:", { name, clientId });
  console.log("2. User:", user?.id);
  console.log("3. Generated plan days:", generatedPlan?.days?.length);

  const { data: plan, error: planError } = await supabase
    .from("meal_plans")
    .insert({
      coach_id: user!.id,
      name,
      client_id: clientId,
      is_active: true,
    })
    .select()
    .single();

  console.log("4. Plan aangemaakt:", plan?.id, "error:", planError);

  if (planError || !plan) {
    return { error: "Weekplan aanmaken mislukt" };
  }

  const days = generatedPlan.days.map((_, i) => ({
    meal_plan_id: plan.id,
    day_number: i + 1,
  }));

  const { data: createdDays, error: daysError } = await supabase.from("meal_plan_days").insert(days).select();

  console.log("5. Dagen aangemaakt:", createdDays?.length, "error:", daysError);

  if (daysError || !createdDays) {
    return { error: "Dagen aanmaken mislukt" };
  }

  for (let i = 0; i < generatedPlan.days.length; i++) {
    const day = generatedPlan.days[i];
    const createdDay = createdDays[i];

    console.log(`6. Dag ${i + 1} verwerken:`, day.day);

    for (const [mealType, meal] of Object.entries(day.meals)) {
      const { data: createdMeal, error: mealError } = await supabase
        .from("meals")
        .insert({
          meal_plan_day_id: createdDay.id,
          meal_type: mealType,
        })
        .select()
        .single();

      console.log(`7. Meal ${mealType}:`, createdMeal?.id, "error:", mealError);

      if (mealError || !createdMeal) continue;

      const { data: recipe, error: recipeError } = await supabase
        .from("recipes")
        .insert({
          coach_id: user!.id,
          name: meal.name,
          meal_type: mealType,
          calories: meal.calories,
          protein_g: meal.protein_g,
          carbs_g: meal.carbs_g,
          fat_g: meal.fat_g,
          servings: 1,
        })
        .select()
        .single();

      console.log(`8. Recipe ${meal.name}:`, recipe?.id, "error:", recipeError);

      if (recipeError || !recipe) continue;

      if (meal.ingredients?.length) {
        for (const ing of meal.ingredients) {
          const normalizedName = ing.name?.trim();
          const normalizedAmount = Number.isFinite(ing.amount_g) ? Math.max(1, Math.round(ing.amount_g)) : 100;
          const normalizedCalories = Number.isFinite(ing.calories) ? ing.calories : 0;
          const normalizedProtein = Number.isFinite(ing.protein_g) ? ing.protein_g : 0;
          const normalizedCarbs = Number.isFinite(ing.carbs_g) ? ing.carbs_g : 0;
          const normalizedFat = Number.isFinite(ing.fat_g) ? ing.fat_g : 0;

          if (!normalizedName) {
            continue;
          }

          let ingredientId: string | null = null;

          const { data: existingIngredient } = await supabase
            .from("ingredients")
            .select("id")
            .eq("name", normalizedName)
            .maybeSingle();

          if (existingIngredient) {
            ingredientId = existingIngredient.id;
          } else {
            const { data: createdIngredient, error: ingredientError } = await supabase
              .from("ingredients")
              .insert({
                name: normalizedName,
                calories: normalizedCalories,
                protein_g: normalizedProtein,
                carbs_g: normalizedCarbs,
                fat_g: normalizedFat,
              })
              .select("id")
              .single();

            if (ingredientError || !createdIngredient) {
              console.error(`Ingredient ${normalizedName} fout:`, ingredientError);
              continue;
            }

            ingredientId = createdIngredient.id;
          }

          const { error: recipeIngredientError } = await supabase.from("recipe_ingredients").insert({
            recipe_id: recipe.id,
            ingredient_id: ingredientId,
            amount_g: normalizedAmount,
          });

          if (recipeIngredientError) {
            console.error(`Recipe ingredient link fout (${normalizedName}):`, recipeIngredientError);
          }
        }
      }

      const { error: linkError } = await supabase.from("meal_recipes").insert({
        meal_id: createdMeal.id,
        recipe_id: recipe.id,
        servings: 1,
      });

      console.log(`9. Link meal-recipe:`, "error:", linkError);
    }
  }


  revalidatePath("/meal-plans");
  return { planId: plan.id };
}
