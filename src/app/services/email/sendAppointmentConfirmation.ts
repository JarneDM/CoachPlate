import { AppointmentConfirmationEmail } from "@/components/email/appointment-confirmation-email";
import { createElement } from "react";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAppointmentConfirmationEmail(params: {
  clientName: string;
  clientEmail: string;
  coachName: string;
  coachEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
}) {
  const subject = `Afspraak bevestigd: ${params.date} ${params.startTime}`;

  const [clientResult, coachResult] = await Promise.all([
    resend.emails.send({
      from: "info@coachplate.com",
      to: [params.clientEmail],
      subject,
      react: createElement(AppointmentConfirmationEmail, {
        recipientName: params.clientName,
        role: "afspraak",
        counterpartName: params.coachName,
        date: params.date,
        startTime: params.startTime,
        endTime: params.endTime,
        type: params.type,
      }),
    }),
    resend.emails.send({
      from: "info@coachplate.com",
      to: [params.coachEmail],
      subject,
      react: createElement(AppointmentConfirmationEmail, {
        recipientName: params.coachName,
        role: "afspraak",
        counterpartName: params.clientName,
        date: params.date,
        startTime: params.startTime,
        endTime: params.endTime,
        type: params.type,
      }),
    }),
  ]);

  if (clientResult.error || coachResult.error) {
    console.error("Error sending appointment confirmation", clientResult.error ?? coachResult.error);
  }

  return { success: true };
}