"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

const COACH_LOGO_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_COACH_LOGOS_BUCKET ?? "coach-logos";
const MAX_LOGO_SIZE_BYTES = 2 * 1024 * 1024;
const COACH_LOGO_EXTENSIONS = ["png", "jpg"] as const;

function getLogoExtension(contentType: string) {
  if (contentType === "image/png") return "png";
  if (contentType === "image/jpeg") return "jpg";
  return null;
}

function sanitizeHexColor(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const prefixed = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
  const isValid = /^#[0-9a-fA-F]{6}$/.test(prefixed);
  return isValid ? prefixed.toLowerCase() : null;
}

function appendVersionQuery(url: string, version: string) {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}v=${version}`;
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
  const logoFile = formData.get("logo");

  let logoUrl: string | undefined;

  if (fullName.length < 2) {
    redirect("/settings?error=Naam+is+te+kort");
  }

  if (brandColorRaw.trim() && !brandColor) {
    redirect("/settings?error=Ongeldige+merkkleur");
  }

  if (logoFile instanceof File && logoFile.size > 0) {
    if (!logoFile.type || !["image/png", "image/jpeg"].includes(logoFile.type)) {
      redirect("/settings?error=Gebruik+een+PNG+of+JPG+logo");
    }

    if (logoFile.size > MAX_LOGO_SIZE_BYTES) {
      redirect("/settings?error=Logo+mag+maximaal+2MB+zijn");
    }

    const extension = getLogoExtension(logoFile.type);
    if (!extension) {
      redirect("/settings?error=Ongeldig+logo+formaat");
    }

    const filePath = `${user.id}/logo.${extension}`;
    const staleFilePaths = COACH_LOGO_EXTENSIONS.filter((ext) => ext !== extension).map((ext) => `${user.id}/logo.${ext}`);
    const fileBuffer = Buffer.from(await logoFile.arrayBuffer());

    const hasServiceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
    const storageClient = hasServiceRole
      ? createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
      : supabase;

    const { error: uploadError } = await storageClient.storage.from(COACH_LOGO_BUCKET).upload(filePath, fileBuffer, {
      contentType: logoFile.type,
      upsert: true,
    });

    if (uploadError) {
      console.error("Error uploading coach logo:", uploadError);
      if (!hasServiceRole && (uploadError.message.toLowerCase().includes("row-level security") || uploadError.statusCode === "403")) {
        redirect("/settings?error=Logo+upload+geblokkeerd+door+storage+policy");
      }
      redirect("/settings?error=Logo+upload+mislukt");
    }

    const { error: removeError } = await storageClient.storage.from(COACH_LOGO_BUCKET).remove(staleFilePaths);
    if (removeError) {
      console.error("Error removing old coach logo:", removeError);
    }

    const { data: publicUrlData } = storageClient.storage.from(COACH_LOGO_BUCKET).getPublicUrl(filePath);
    logoUrl = appendVersionQuery(publicUrlData.publicUrl, Date.now().toString());
  }

  const { error } = await supabase
    .from("coaches")
    .update({
      full_name: fullName,
      brand_color: brandColor,
      ...(logoUrl ? { logo_url: logoUrl } : {}),
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
