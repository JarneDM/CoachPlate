
import { createClient } from "@/lib/supabase/server";
export async function getMealPlanById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("meal_plans")
    .select(
      `
      *,
      clients (
        id,
        full_name,
        calories_goal,
        protein_goal,
        carbs_goal,
        fat_goal
      ),
      meal_plan_days (
        id,
        day_number,
        date,
        meals (
          id,
          meal_type,
          order_index,
          meal_recipes (
            id,
            servings,
            recipes (
              id,
              name,
              instructions,
              prep_time_min,
              calories,
              protein_g,
              carbs_g,
              fat_g
            )
          )
        )
      )
      
    `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching meal plan:", error);
    return null;
  }

  return data;
}
