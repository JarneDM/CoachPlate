export type AppointmentStatus = "scheduled" | "completed" | "cancelled" | "no_show";
export type RecurrenceInterval = "weekly" | "biweekly";

export interface CreateAppointmentInput {
  date: string;
  startTime: string;
  endTime: string;
  clientId: string;
  typeId?: string;
  notes?: string;
  meetingUrl?: string;
  status?: AppointmentStatus;
}

export interface UpdateAppointmentInput {
  status?: AppointmentStatus;
  notes?: string;
  meetingUrl?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  typeId?: string;
}

export interface CreateAvailabilitySlotInput {
  date: string;
  startTime: string;
  endTime: string;
  type?: string;
}

export interface CreateRecurringAvailabilitySlotsInput {
  startDate: string;
  startTime: string;
  endTime: string;
  type?: string;
  interval: RecurrenceInterval;
  occurrences: number;
}

export interface CreateAppointmentTypeInput {
  type: string;
  durationMinutes: number;
  color: string;
  notes?: string;
}

export interface UpdateAppointmentTypeInput {
  type?: string;
  durationMinutes?: number;
  color?: string;
  notes?: string;
}
