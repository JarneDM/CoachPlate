import { createClient } from "@/lib/supabase/server";
export const getExercises = async () => {
  const supabase = await createClient();
  // const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase.from("exercises").select("*");

    if (error) {
      console.error("Error fetching exercises:", error);
      return [];
    }
    return data;
}