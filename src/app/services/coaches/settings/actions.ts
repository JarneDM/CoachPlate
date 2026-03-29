"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function sanitizeHexColor(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const prefixed = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
  const isValid = /^#[0-9a-fA-F]{6}$/.test(prefixed);
  return isValid ? prefixed.toLowerCase() : null;
}

export async function updateCoachProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const fullName = String(formData.get("full_name") ?? "").trim();
  const brandColorRaw = String(formData.get("brand_color") ?? "");
  const brandColor = sanitizeHexColor(brandColorRaw);

  if (fullName.length < 2) {
    redirect("/settings?error=Naam+is+te+kort");
  }

  if (brandColorRaw.trim() && !brandColor) {
    redirect("/settings?error=Ongeldige+merkkleur");
  }

  const { error } = await supabase
    .from("coaches")
    .update({
      full_name: fullName,
      brand_color: brandColor,
    })
    .eq("id", user.id);

  if (error) {
    console.error("Error updating coach profile:", error);
    redirect("/settings?error=Profiel+opslaan+mislukt");
  }

  const { error: authUpdateError } = await supabase.auth.updateUser({
    data: { full_name: fullName },
  });

  if (authUpdateError) {
    console.error("Error syncing auth metadata:", authUpdateError);
  }

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  redirect("/settings?saved=profile");
}

export async function updateCoachPassword(formData: FormData) {
  const supabase = await createClient();

  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirm_password") ?? "");

  if (password.length < 8) {
    redirect("/settings?error=Wachtwoord+moet+minstens+8+tekens+hebben");
  }

  if (password !== confirmPassword) {
    redirect("/settings?error=Wachtwoorden+komen+niet+overeen");
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    console.error("Error updating password:", error);
    redirect("/settings?error=Wachtwoord+updaten+mislukt");
  }

  redirect("/settings?saved=password");
}
