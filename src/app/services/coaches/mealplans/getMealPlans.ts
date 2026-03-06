import { createClient } from "@/lib/supabase/server";
export const getMealPlans = async (user: { id: string }) => {
  const supabase = await createClient();
  const data = await supabase.from("meal_plans").select("*", { count: "exact", head: true }).eq("coach_id", user.id);

  return data;
};