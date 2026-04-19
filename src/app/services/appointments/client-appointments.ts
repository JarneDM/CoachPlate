import { createClient } from "@/lib/supabase/server";

export async function getAvailableSlotsForCoach(coachId: string, from: string, to: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("availability_slots")
    .select("*")
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

  if (!user) {
    return { error: "Niet ingelogd" };
  }

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

  if (slot.client_id && slot.client_id !== clientRow.id) {
    return { error: "Dit tijdslot is gereserveerd voor een andere klant" };
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
    slot_id: slotId,
    status: "scheduled",
    notes: null,
  });

  if (appointmentError) {
    console.error("Error creating appointment from slot:", appointmentError);
    return { error: "Afspraak aanmaken mislukt" };
  }

  return { success: true };
}

export async function getClientAppointmentSlots(from?: string, to?: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { coach: null, slots: [], appointments: [] };
  }

  const { data: clientRow } = await supabase.from("clients").select("id, coach_id, full_name, email").eq("user_id", user.id).maybeSingle();

  if (!clientRow?.coach_id) {
    return { coach: null, slots: [], appointments: [] };
  }

  const [coachResult, slotsResult, appointmentsResult] = await Promise.all([
    supabase.from("coaches").select("id, full_name, email").eq("id", clientRow.coach_id).maybeSingle(),
    (() => {
      let query = supabase
        .from("availability_slots")
        .select("*")
        .eq("coach_id", clientRow.coach_id)
        .eq("is_booked", false)
        .or(`client_id.is.null,client_id.eq.${clientRow.id}`)
        .order("date", { ascending: true })
        .order("start_time", { ascending: true });

      if (from) query = query.gte("date", from);
      if (to) query = query.lte("date", to);

      return query;
    })(),
    (() => {
      const query = supabase
        .from("appointments")
        .select(
          `
          *, 
          availability_slots (
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
        .eq("client_id", clientRow.id);
      return query;
    })(),
  ]);

  console.log("Fetched client appointment data:", {
    coach: coachResult.data,
    slots: slotsResult.data,
    appointments: appointmentsResult.data,
    errors: {
      coachError: coachResult.error,
      slotsError: slotsResult.error,
      appointmentsError: appointmentsResult.error,
    },
  });

  return {
    coach: coachResult.data ?? null,
    slots: slotsResult.data ?? [],
    appointments: appointmentsResult.data ?? [],
  };
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
    .eq("client_id", clientRow.id)
    .order("date", { ascending: true, referencedTable: "availability_slots" })
    .order("start_time", { ascending: true, referencedTable: "availability_slots" });

  if (error) {
    console.error("Error fetching client appointments:", error);
    return [];
  }

  return data;
}
