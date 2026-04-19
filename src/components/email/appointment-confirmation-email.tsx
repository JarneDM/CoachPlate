import * as React from "react";

interface AppointmentConfirmationEmailProps {
  recipientName: string;
  role: string;
  counterpartName: string;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
}

export function AppointmentConfirmationEmail({ recipientName, role, counterpartName, date, startTime, endTime, type }: AppointmentConfirmationEmailProps) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", lineHeight: 1.5, color: "#111827" }}>
      <h1 style={{ fontSize: 24, marginBottom: 12 }}>Afspraak bevestigd</h1>
      <p>Hallo {recipientName},</p>
      <p>
        Je {role} voor {type} met {counterpartName} staat vast op {date} van {startTime} tot {endTime}.
      </p>
      <p>CoachPlate heeft deze bevestiging ook naar de andere partij verstuurd.</p>
    </div>
  );
}