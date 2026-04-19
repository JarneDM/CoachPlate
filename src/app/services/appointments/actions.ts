"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { createAvailabilitySlot, createRecurringAvailabilitySlots, deleteAvailabilitySlot } from "./availability-slots";
import { bookSlot } from "./client-appointments";
import { updateAppointment } from "./appointments";
import type { AppointmentStatus } from "./types";
import { sendAppointmentConfirmationEmail } from "@/app/services/email/sendAppointmentConfirmation";

export async function createAppointmentAvailabilityAction(formData: {
  date: string;
  startTime: string;
  endTime: string;
  type?: string;
  clientId?: string;
}) {
  const result = await createAvailabilitySlot({
    date: formData.date,
    startTime: formData.startTime,
    endTime: formData.endTime,
    type: formData.type,
    clientId: formData.clientId,
  });

  if (result.error) {
    return { error: "Tijdslot aanmaken mislukt" };
  }

  revalidatePath("/appointments");
  revalidatePath("/appointments/availability");
  return { success: true };
}

export async function createRecurringAppointmentAvailabilityAction(formData: {
  startDate: string;
  startTime: string;
  endTime: string;
  type?: string;
  clientId?: string;
  interval: "weekly" | "biweekly";
  occurrences: number;
}) {
  const result = await createRecurringAvailabilitySlots(formData);

  if (result.error) {
    return { error: "Herhalende tijdsloten aanmaken mislukt" };
  }

  revalidatePath("/appointments");
  revalidatePath("/appointments/availability");
  return { success: true };
}

export async function deleteAppointmentAvailabilityAction(id: string) {
  const success = await deleteAvailabilitySlot(id);

  if (!success) {
    console.error("Tijdslot verwijderen mislukt");
    return;
  }

  revalidatePath("/appointments");
  revalidatePath("/appointments/availability");
}

export async function confirmAppointmentBookingAction(slotId: string) {
  const bookingResult = await bookSlot(slotId);

  if (bookingResult.error) {
    return bookingResult;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Niet ingelogd" };
  }

  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data: clientRow } = await admin
    .from("clients")
    .select("id, full_name, email, coach_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!clientRow?.email || !clientRow.coach_id) {
    revalidatePath("/client/dashboard");
    revalidatePath("/client/appointments");
    revalidatePath("/appointments");
    return { success: true };
  }

  const { data: slot } = await admin
    .from("availability_slots")
    .select("id, date, start_time, end_time, type, coach_id")
    .eq("id", slotId)
    .maybeSingle();

  const { data: coach } = await admin
    .from("coaches")
    .select("id, full_name, email")
    .eq("id", clientRow.coach_id)
    .maybeSingle();

  // if (slot && coach?.email) {
  //   await sendAppointmentConfirmationEmail({
  //     clientName: clientRow.full_name,
  //     clientEmail: clientRow.email,
  //     coachName: coach.full_name,
  //     coachEmail: coach.email,
  //     date: slot.date,
  //     startTime: slot.start_time,
  //     endTime: slot.end_time,
  //     type: slot.type ?? "Check-in call",
  //   });
  // }

  revalidatePath("/client/dashboard");
  revalidatePath("/client/appointments");
  revalidatePath("/appointments");

  return { success: true };
}

export async function updateAppointmentNotesAction(
  appointmentId: string,
  updates: { notes?: string; status?: AppointmentStatus; meetingUrl?: string },
) {
  const supabase = await createClient();
  const { data: appointment } = await supabase.from("appointments").select("client_id").eq("id", appointmentId).maybeSingle();
  const result = await updateAppointment(appointmentId, updates);

  if (result.error) {
    return { error: "Afspraak bijwerken mislukt" };
  }

  revalidatePath("/appointments");
  revalidatePath(`/appointments/${appointmentId}`);
  revalidatePath("/dashboard/clients");
  if (appointment?.client_id) {
    revalidatePath(`/dashboard/clients/${appointment.client_id}`);
  }
  return { success: true };
}