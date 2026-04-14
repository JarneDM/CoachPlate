import { createClient } from "@/lib/supabase/server";

export async function getAvailableSlotsForCoach(coachId: string, from: string, to: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("availability_slots")
    .select(
      `
      *,
      appointment_types (
        id,
        type,
        color,
        duration_minutes
      )
    `,
    )
    .eq("coach_id", coachId)
    .eq("is_booked", false)
    .gte("date", from)
    .lte("date", to)
    .order("date", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) {
    console.error("Error fetching available slots:", error);
    return [];
  }

  return data;
}

export async function bookSlot(slotId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: slot, error: slotError } = await supabase
    .from("availability_slots")
    .select("*")
    .eq("id", slotId)
    .eq("is_booked", false)
    .maybeSingle();

  if (slotError || !slot) {
    console.error("Slot not found or already booked");
    return { error: "Tijdslot is niet beschikbaar" };
  }

  const { data: clientRow, error: clientError } = await supabase
    .from("clients")
    .select("id")
    .eq("user_id", user!.id)
    .maybeSingle();

  if (clientError || !clientRow) {
    console.error("Client profile not found:", clientError);
    return { error: "Klantprofiel niet gevonden" };
  }

  const { error: bookingError } = await supabase
    .from("availability_slots")
    .update({ is_booked: true, client_id: clientRow.id })
    .eq("id", slotId);

  if (bookingError) {
    console.error("Error booking slot:", bookingError);
    return { error: "Tijdslot reserveren mislukt" };
  }

  const { error: appointmentError } = await supabase.from("appointments").insert({
    coach_id: slot.coach_id,
    client_id: clientRow.id,
    date: slot.date,
    start_time: slot.start_time,
    end_time: slot.end_time,
    status: "scheduled",
  });

  if (appointmentError) {
    console.error("Error creating appointment from slot:", appointmentError);
    return { error: "Afspraak aanmaken mislukt" };
  }

  return { success: true };
}

export async function getClientAppointments() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: clientRow, error: clientError } = await supabase
    .from("clients")
    .select("id")
    .eq("user_id", user!.id)
    .maybeSingle();

  if (clientError || !clientRow) {
    console.error("Client profile not found:", clientError);
    return [];
  }

  const { data, error } = await supabase
    .from("appointments")
    .select(
      `
      *,
      appointment_types (
        id,
        type,
        color,
        duration_minutes
      )
    `,
    )
    .eq("client_id", clientRow.id)
    .order("date", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) {
    console.error("Error fetching client appointments:", error);
    return [];
  }

  return data;
}
