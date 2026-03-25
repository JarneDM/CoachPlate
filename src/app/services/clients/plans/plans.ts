import { createClient } from "@/lib/supabase/server";

export const getClientPlans = async (clientId: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase.from("meal_plans").select("*").eq("client_id", clientId).order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching client plans:", error);
    return [];
  }

  return data;
};

export const getClientWorkoutPlans = async (clientId: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("training_plans")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching client workout plans:", error);
    return [];
  }

  return data;
};