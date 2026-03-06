import { createClient } from "@/lib/supabase/server";

export const getCoach = async (user: { id: string }) => {
  const supabase = await createClient();
  const data = await supabase.from("coaches").select("*").eq("id", user.id).single();

  return data;
}