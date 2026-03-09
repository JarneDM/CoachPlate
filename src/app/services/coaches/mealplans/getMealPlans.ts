import { createClient } from "@/lib/supabase/server";
export const getMealPlans = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const data = await supabase.from("meal_plans").select("*", { count: "exact", head: true }).eq("coach_id", user?.id);

  return data;
};