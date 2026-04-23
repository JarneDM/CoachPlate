import { createClient } from "@/lib/supabase/server";
import type { CreateAppointmentInput, UpdateAppointmentInput } from "./types";

async function enrichAppointmentsWithSlotType<
  T extends {
    availability_slots?: {
      date?: string | null;
      start_time?: string | null;
      end_time?: string | null;
      type?: string | null;
    } | null;
  },
>(appointments: T[]) {
  if (appointments.length === 0) {
    return [];
  }

  return appointments.map((appointment) => ({
    ...appointment,
    date: appointment.availability_slots?.date ?? null,
    start_time: appointment.availability_slots?.start_time ?? null,
    end_time: appointment.availability_slots?.end_time ?? null,
    slot_type: appointment.availability_slots?.type ?? null,
  }));
}

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
      availability_slots (
        id,
        coach_id,
        client_id,
        date,
        start_time,
        end_time,
        type,
        is_booked
      )
    `,
    )
    .eq("coach_id", user!.id)
    .order("date", { ascending: true, referencedTable: "availability_slots" })
    .order("start_time", { ascending: true, referencedTable: "availability_slots" });

  if (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }

  return enrichAppointmentsWithSlotType(data ?? []);
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
      availability_slots (
        id,
        coach_id,
        client_id,
        date,
        start_time,
        end_time,
        type,
        is_booked
      )
    `,
    )
    .eq("coach_id", user!.id)
    .in("status", ["scheduled"])
    .order("date", { ascending: true, referencedTable: "availability_slots" })
    .order("start_time", { ascending: true, referencedTable: "availability_slots" });

  if (error) {
    console.error("Error fetching upcoming appointments:", error);
    return [];
  }

  const enriched = await enrichAppointmentsWithSlotType(data ?? []);
  return enriched.filter((appointment) => typeof appointment.date === "string" && appointment.date >= today).slice(0, limit);
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
      availability_slots (
        id,
        client_id,
        coach_id,
        date,
        start_time,
        end_time,
        type,
        is_booked
      )
    `,
    )
    .eq("coach_id", user!.id)
    .order("date", { ascending: true, referencedTable: "availability_slots" })
    .order("start_time", { ascending: true, referencedTable: "availability_slots" });

  if (error) {
    console.error("Error fetching appointments by date range:", error);
    return [];
  }

  const enriched = await enrichAppointmentsWithSlotType(data ?? []);
  return enriched.filter((appointment) => typeof appointment.date === "string" && appointment.date >= from && appointment.date <= to);
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
      availability_slots (
        id,
        coach_id,
        client_id,
        date,
        start_time,
        end_time,
        type,
        is_booked
      )
    `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching appointment:", error);
    return null;
  }

  if (!data) {
    return null;
  }

  const enriched = await enrichAppointmentsWithSlotType([data]);
  return enriched[0] ?? null;
}

export async function createAppointment(input: CreateAppointmentInput) {
  const { clientId, notes, meetingUrl, status = "scheduled" } = input;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return supabase.from("appointments").insert({
    coach_id: user?.id,
    client_id: clientId,
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

export async function getAppointmentsForClient(clientId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("appointments")
    .select(
      `
      *,
      availability_slots (
        coach_id,
        client_id,
        date,
        start_time,
        end_time,
        type,
        is_booked
      )
    `,
    )
    .eq("client_id", clientId)
    .order("date", { ascending: false, referencedTable: "availability_slots" })
    .order("start_time", { ascending: false, referencedTable: "availability_slots" });

  if (error) {
    console.error("Error fetching appointments for client:", error);
    return [];
  }

  return enrichAppointmentsWithSlotType(data ?? []);
}
