import { createClient } from "@/lib/supabase/server";
import type { CreateAppointmentInput, UpdateAppointmentInput } from "./types";

export async function getAppointments() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("appointments")
    .select(
      `
      *,
      clients (
        id,
        full_name,
        email
      ),
      appointment_types (
        id,
        type,
        color,
        duration_minutes
      )
    `,
    )
    .eq("coach_id", user!.id)
    .order("date", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }

  return data;
}

export async function getUpcomingAppointments(limit = 10) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("appointments")
    .select(
      `
      *,
      clients (
        id,
        full_name,
        email
      ),
      appointment_types (
        id,
        type,
        color,
        duration_minutes
      )
    `,
    )
    .eq("coach_id", user!.id)
    .gte("date", today)
    .in("status", ["scheduled"])
    .order("date", { ascending: true })
    .order("start_time", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Error fetching upcoming appointments:", error);
    return [];
  }

  return data;
}

export async function getAppointmentsByDateRange(from: string, to: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("appointments")
    .select(
      `
      *,
      clients (
        id,
        full_name,
        email
      ),
      appointment_types (
        id,
        type,
        color,
        duration_minutes
      )
    `,
    )
    .eq("coach_id", user!.id)
    .gte("date", from)
    .lte("date", to)
    .order("date", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) {
    console.error("Error fetching appointments by date range:", error);
    return [];
  }

  return data;
}

export async function getAppointmentById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("appointments")
    .select(
      `
      *,
      clients (
        id,
        full_name,
        email,
        birth_date,
        goal,
        notes
      ),
      appointment_types (
        id,
        type,
        color,
        duration_minutes,
        notes
      )
    `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching appointment:", error);
    return null;
  }

  return data;
}

export async function createAppointment({
  date,
  startTime,
  endTime,
  clientId,
  typeId,
  notes,
  meetingUrl,
  status = "scheduled",
}: CreateAppointmentInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return supabase.from("appointments").insert({
    coach_id: user?.id,
    client_id: clientId,
    date,
    start_time: startTime,
    end_time: endTime,
    type_id: typeId,
    notes,
    meeting_url: meetingUrl,
    status,
  });
}

export async function updateAppointment(id: string, updates: UpdateAppointmentInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const payload: Record<string, unknown> = {};
  if (updates.status !== undefined) payload.status = updates.status;
  if (updates.notes !== undefined) payload.notes = updates.notes;
  if (updates.meetingUrl !== undefined) payload.meeting_url = updates.meetingUrl;
  if (updates.date !== undefined) payload.date = updates.date;
  if (updates.startTime !== undefined) payload.start_time = updates.startTime;
  if (updates.endTime !== undefined) payload.end_time = updates.endTime;
  if (updates.typeId !== undefined) payload.type_id = updates.typeId;

  return supabase.from("appointments").update(payload).eq("id", id).eq("coach_id", user!.id);
}

export async function deleteAppointment(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("appointments")
    .delete()
    .eq("id", id)
    .eq("coach_id", user!.id);

  if (error) {
    console.error("Error deleting appointment:", error);
    return false;
  }

  return true;
}
