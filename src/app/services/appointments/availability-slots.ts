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

export async function createAvailabilitySlot({
  date,
  startTime,
  endTime,
  type,
}: CreateAvailabilitySlotInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return supabase.from("availability_slots").insert({
    coach_id: user?.id,
    date,
    start_time: startTime,
    end_time: endTime,
    type,
    is_booked: false,
  });
}

export async function createRecurringAvailabilitySlots({
  startDate,
  startTime,
  endTime,
  type,
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
    is_booked: false,
  }));

  return supabase.from("availability_slots").insert(slots);
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
