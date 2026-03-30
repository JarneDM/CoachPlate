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

export const getMealPlansPaginated = async (page: number, pageSize: number) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const from = (safePage - 1) * safePageSize;
  const to = from + safePageSize - 1;

  const { data, error, count } = await supabase
    .from("meal_plans")
    .select(
      `
      *,
      clients (
        id,
        full_name
      )
    `,
      { count: "exact" },
    )
    .eq("coach_id", user!.id)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching paginated meal plans:", error);
    return { data: [], totalCount: 0 };
  }

  return { data: data ?? [], totalCount: count ?? 0 };
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