import { createClient } from "@/lib/supabase/server";
import type { CreateAvailabilitySlotInput, CreateRecurringAvailabilitySlotsInput } from "./types";

function addDaysToDate(dateStr: string, days: number): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

export async function getAvailabilitySlots(from?: string, to?: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let query = supabase
    .from("availability_slots")
    .select("*")
    .eq("coach_id", user!.id)
    .eq("is_booked", false)
    .order("date", { ascending: true })
    .order("start_time", { ascending: true });

  if (from) query = query.gte("date", from);
  if (to) query = query.lte("date", to);

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching availability slots:", error);
    return [];
  }

  return data;
}

export async function createAvailabilitySlot({ date, startTime, endTime, type, clientId }: CreateAvailabilitySlotInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("availability_slots").insert({
    coach_id: user?.id,
    date,
    start_time: startTime,
    end_time: endTime,
    type,
    client_id: clientId || null,
    is_booked: false,
  });

  if (error) {
    console.error("Error creating availability slot:", error);
    return { error: "Tijdslot aanmaken mislukt" };
  }

  return { success: true };
}

export async function createRecurringAvailabilitySlots({
  startDate,
  startTime,
  endTime,
  type,
  clientId,
  interval,
  occurrences,
}: CreateRecurringAvailabilitySlotsInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const intervalDays = interval === "weekly" ? 7 : 14;
  const slots = Array.from({ length: occurrences }, (_, i) => ({
    coach_id: user?.id,
    date: addDaysToDate(startDate, i * intervalDays),
    start_time: startTime,
    end_time: endTime,
    type,
    client_id: clientId || null,
    is_booked: false,
  }));

  const { error } = await supabase.from("availability_slots").insert(slots);

  if (error) {
    console.error("Error creating recurring availability slots:", error);
    return { error: "Recurrente tijdslots aanmaken mislukt" };
  }

  return { success: true };
}

export async function deleteAvailabilitySlot(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("availability_slots")
    .delete()
    .eq("id", id)
    .eq("coach_id", user!.id);

  if (error) {
    console.error("Error deleting availability slot:", error);
    return false;
  }

  return true;
}
