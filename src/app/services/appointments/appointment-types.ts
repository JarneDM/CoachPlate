import { createClient } from "@/lib/supabase/server";
import type { CreateAppointmentTypeInput, UpdateAppointmentTypeInput } from "./types";

export async function getAppointmentTypes() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("appointment_types")
    .select("*")
    .eq("coach_id", user!.id)
    .order("type", { ascending: true });

  if (error) {
    console.error("Error fetching appointment types:", error);
    return [];
  }

  return data;
}

export async function createAppointmentType({
  type,
  durationMinutes,
  color,
  notes,
}: CreateAppointmentTypeInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return supabase.from("appointment_types").insert({
    coach_id: user?.id,
    type,
    duration_minutes: durationMinutes,
    color,
    notes,
  });
}

export async function updateAppointmentType(id: string, updates: UpdateAppointmentTypeInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const payload: Record<string, unknown> = {};
  if (updates.type !== undefined) payload.type = updates.type;
  if (updates.durationMinutes !== undefined) payload.duration_minutes = updates.durationMinutes;
  if (updates.color !== undefined) payload.color = updates.color;
  if (updates.notes !== undefined) payload.notes = updates.notes;

  return supabase
    .from("appointment_types")
    .update(payload)
    .eq("id", id)
    .eq("coach_id", user!.id);
}

export async function deleteAppointmentType(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("appointment_types")
    .delete()
    .eq("id", id)
    .eq("coach_id", user!.id);

  if (error) {
    console.error("Error deleting appointment type:", error);
    return false;
  }

  return true;
}
