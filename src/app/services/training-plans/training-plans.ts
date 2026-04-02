import { createClient } from "@/lib/supabase/server";

export async function getTrainingPlans() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("training_plans")
    .select(
      `
      *,
      clients (
        id,
        full_name
      ),
      training_plan_days (
        id,
        day_number,
        name
      )
    `,
    )
    .eq("coach_id", user!.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching training plans:", error);
    return [];
  }

  return data;
}

export async function getTrainingPlansPaginated(page: number, pageSize: number, clientId?: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const from = (safePage - 1) * safePageSize;
  const to = from + safePageSize - 1;

  const { data, error, count } = await supabase
    .from("training_plans")
    .select(
      `
      *,
      clients (
        id,
        full_name
      ),
      training_plan_days (
        id,
        day_number,
        name
      )
    `,
      { count: "exact" },
    )
    .eq("coach_id", user!.id)
    .eq(clientId ? "client_id" : "", clientId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching paginated training plans:", error);
    return { data: [], totalCount: 0 };
  }

  return { data: data ?? [], totalCount: count ?? 0 };
}

export async function getTrainingPlanById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("training_plans")
    .select(
      `
      *,
      clients (
        id,
        full_name
      ),
      training_plan_days (
        id,
        day_number,
        name,
        exercises_trainingplans (
          id,
          sets,
          reps,
          weight_kg,
          rest_seconds,
          notes,
          order_index,
          exercises (
            id,
            name,
            muscle_group,
            category,
            equipment,
            difficulty,
            instructions
          )
        )
      )
    `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching training plan:", error);
    return null;
  }

  return data;
}

export async function deleteTrainingPlan(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("training_plans").delete().eq("id", id);

  if (error) {
    console.error("Error deleting training plan:", error);
    return false;
  }

  return true;
}
