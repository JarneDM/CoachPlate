import { createClient } from "@/lib/supabase/server";

export const getTrainingPlans = async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("training_plans")
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
    console.error("Error fetching training plans:", error);
    return [];
  }

  return data;
}