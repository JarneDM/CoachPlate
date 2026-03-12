import { createClient } from "@/lib/supabase/server";
export const getMealPlans = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("meal_plans")
    .select(
      `
      *,
      clients (
        id,
        full_name
      )
    `,
    )
    .eq("coach_id", user!.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching meal plans:", error);
    return [];
  }

  return data;
};

export async function deleteMealPlan(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("meal_plans").delete().eq("id", id);

  if (error) {
    console.error("Error deleting meal plan:", error);
    return false;
  }

  return true;
}