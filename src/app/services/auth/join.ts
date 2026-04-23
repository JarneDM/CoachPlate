"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function joinViaCode({
  code,
  email,
  password,
  fullName,
  birthday,
  goal,
}: {
  code: string;
  email: string;
  password: string;
  fullName: string;
  birthday: string;
  goal?: string;
}) {
  const supabase = await createClient();
  const admin = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  const { data: coach, error: codeError } = await admin.from("coaches").select("id").eq("invite_code", code).maybeSingle();

  if (codeError || !coach) {
    return { error: "Ongeldige code" };
  }

  const { data, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: "client",
      },
    },
  });

  if (authError || !data.user) {
    if (authError?.message.includes("already registered")) {
      return { error: "Dit e-mailadres is al geregistreerd" };
    }
    return { error: "Account aanmaken mislukt" };
  }

  const { data: existingClient } = await admin.from("clients").select("id").eq("coach_id", coach.id).eq("email", email).maybeSingle();

  if (existingClient) {
    await admin
      .from("clients")
      .update({
        user_id: data.user.id,
        has_account: true,
      })
      .eq("id", existingClient.id);
  } else {
    await admin.from("clients").insert({
      coach_id: coach.id,
      user_id: data.user.id,
      full_name: fullName,
      email,
      birth_date: birthday,
      has_account: true,
      goal,
    });
  }

  return { success: true };
}
