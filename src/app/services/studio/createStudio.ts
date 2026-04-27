"use server";

// when person buys the subscription, create a studio for them
// ex. "Studio #1234" => can change the name of the studio later on
import { createClient } from "@/lib/supabase/server";

export const createStudio = async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Niet ingelogd" };
  }

  const { data: coach, error: coachError } = await supabase.from("coaches").select("*").eq("id", user.id).single();

  if (coachError || !coach) {
    return { error: "Coachprofiel niet gevonden" };
  }

  const { data, error } = await supabase.from("studio").insert({
    name: `Studio #${Math.floor(Math.random() * 10000)}`,
    owner_id: coach.id,
  });

  if (error) {
    console.error("Error creating studio:", error);
    return { error: "Error creating studio" };
  }

  return { data, success: true };
};
