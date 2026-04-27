import { createClient } from "@supabase/supabase-js";

export const getStudioInfo = async () => {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const studio = await supabase.from("studio").select("*").eq("owner_id", user?.id).single();
  return studio;
}