"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function updateClientProfile(data: {
  full_name: string;
  email: string;
  weight_kg: number | null;
  height_cm: number | null;
  birth_date: string | null;
  gender: string | null;
  goal: string | null;
  preferences: string | null;
  allergies: string[];
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Niet ingelogd" };

  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await admin
    .from("clients")
    .update({
      full_name: data.full_name,
      email: data.email,
      weight_kg: data.weight_kg,
      height_cm: data.height_cm,
      birth_date: parseBirthDate(data.birth_date),
      gender: data.gender || null,
      goal: data.goal || null,
      preferences: data.preferences || null,
      allergies: data.allergies,
    })
    .eq("user_id", user.id);

  if (error) return { error: "Opslaan mislukt" };

  revalidatePath("/client/settings");
  revalidatePath("/client/dashboard");

  return { success: true };
}

// Accepts DD/MM/JJJJ or YYYY-MM-DD, returns YYYY-MM-DD or null
function parseBirthDate(value: string | null): string | null {
  if (!value) return null;
  const dmyMatch = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dmyMatch) return `${dmyMatch[3]}-${dmyMatch[2].padStart(2, "0")}-${dmyMatch[1].padStart(2, "0")}`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  return null;
}

export async function changeCoach(data: { coach_id: string }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!data.coach_id) return { error: "Coach code is vereist" };

  if (!user) return { error: "Niet ingelogd" };

  const admin = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  const { data: coach, error: coachError } = await admin
    .from("coaches")
    .select("id")
    .eq("invite_code", data.coach_id.toUpperCase())
    .maybeSingle();

  if (coachError || !coach) return { error: "Coach niet gevonden" };

  if (coach) {
    const { error } = await admin
      .from("clients")
      .update({ coach_id: coach?.id || null })
      .eq("user_id", user.id);

    if (error) return { error: "Opslaan mislukt" };
  }


  revalidatePath("/client/settings");
  revalidatePath("/client/dashboard");

  return { success: true };
}

export async function getCoach() {
  const admin = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: clientData } = await admin.from("clients").select("coach_id").eq("user_id", user?.id).maybeSingle();
  const coach_id = clientData?.coach_id;

  if (!coach_id) return null;

  const { data: coach } = await admin.from("coaches").select("*").eq("id", coach_id).maybeSingle();

  return coach;
}
