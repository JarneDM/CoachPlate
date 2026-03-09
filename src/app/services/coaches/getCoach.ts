import { createClient } from "@/lib/supabase/server";

export const getCoach = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const data = await supabase.from("coaches").select("*").eq("id", user?.id).single();

  return data;
};