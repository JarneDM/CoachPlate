import { createClient } from "@/lib/supabase/server";

export async function getExercises() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("exercises")
    .select("*")
    .or(`coach_id.eq.${user!.id},coach_id.is.null`)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching exercises:", error);
    return [];
  }

  return data;
}
