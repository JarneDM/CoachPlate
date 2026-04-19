# Appointments Flow

This document explains the current appointments implementation in CoachPlate from end to end.

## Goal

The appointments feature is meant to support this flow:

1. The coach creates available time slots.
2. The client sees available slots and books one.
3. Both coach and client receive a confirmation email.
4. The coach can review all appointments and add notes afterward.
5. Appointment notes are visible in the client profile.

## Main Screens

### Coach side

- [Coach dashboard](../src/app/(dashboard)/dashboard/page.tsx)
- [Appointments overview](../src/app/(dashboard)/appointments/page.tsx)
- [Add availability slot](../src/app/(dashboard)/appointments/add/page.tsx)
- [Availability manager](../src/app/(dashboard)/appointments/availability/page.tsx)
- [Appointment detail and notes](../src/app/(dashboard)/appointments/[id]/page.tsx)

### Client side

- [Client dashboard](../src/app/client/dashboard/page.tsx)
- [Client appointments page](../src/app/client/appointments/page.tsx)

## Data Layer

The appointments feature is backed by three main service areas:

- [Appointment records](../src/app/services/appointments/appointments.ts)
- [Availability slots and booking](../src/app/services/appointments/availability-slots.ts)
- [Client booking helpers](../src/app/services/appointments/client-appointments.ts)
- [Appointment actions](../src/app/services/appointments/actions.ts)
- [Appointment types](../src/app/services/appointments/appointment-types.ts)
- [Appointment service types](../src/app/services/appointments/types.ts)

The code expects these tables or concepts in Supabase:

- appointments
- availability_slots
- appointment_types
- clients
- coaches

## Coach Flow

### 1. Open the appointments section

The coach can reach the feature from the dashboard sidebar and mobile menu. The navigation link points to [src/app/(dashboard)/appointments/page.tsx](../src/app/(dashboard)/appointments/page.tsx).

### 2. View the week overview

The appointments overview page loads:

- appointments for the current week
- open availability slots for the current week
- a list of upcoming appointments

This is done by calling:

- [getAppointmentsByDateRange](../src/app/services/appointments/appointments.ts)
- [getAvailabilitySlots](../src/app/services/appointments/availability-slots.ts)
- [getUpcomingAppointments](../src/app/services/appointments/appointments.ts)

The page then groups items by day and renders:

- open slots as dashed green cards
- booked appointments as clickable cards that open the detail page

### 3. Create a time slot

The add-slot screen uses [AppointmentSlotForm](../src/components/appointments/AppointmentSlotForm.tsx).

The form can create:

- one-off slots
- recurring slots

It submits through these server actions:

- [createAppointmentAvailabilityAction](../src/app/services/appointments/actions.ts)
- [createRecurringAppointmentAvailabilityAction](../src/app/services/appointments/actions.ts)

These actions call:

- [createAvailabilitySlot](../src/app/services/appointments/availability-slots.ts)
- [createRecurringAvailabilitySlots](../src/app/services/appointments/availability-slots.ts)

The form fields include:

- date or start date
- start time
- end time
- type, such as check-in call or intake
- optional linked client

### 4. Manage open availability

The availability page lists all open slots for the week and lets the coach remove them.

The delete button is implemented in [DeleteAvailabilitySlotButton](../src/components/appointments/DeleteAvailabilitySlotButton.tsx) and calls:

- [deleteAppointmentAvailabilityAction](../src/app/services/appointments/actions.ts)

### 5. Inspect a booked appointment

The appointment detail page loads a single appointment through:

- [getAppointmentById](../src/app/services/appointments/appointments.ts)

It shows:

- client name and email
- appointment date and time
- appointment type
- status
- meeting URL if present

### 6. Add notes after the appointment

The notes form is [AppointmentNotesForm](../src/components/appointments/AppointmentNotesForm.tsx).

It updates the appointment through:

- [updateAppointmentNotesAction](../src/app/services/appointments/actions.ts)

That action writes back to the appointments table and revalidates:

- the appointment detail page
- the coach appointments overview
- the relevant client profile page

## Client Flow

### 1. Open the client appointments page

The client dashboard now contains a button that links to [src/app/client/appointments/page.tsx](../src/app/client/appointments/page.tsx).

### 2. Load the client’s coach and available slots

The page uses [getClientAppointmentSlots](../src/app/services/appointments/client-appointments.ts), which:

- finds the logged-in client record
- loads the client’s coach
- loads open availability slots for that coach
- loads the client’s booked appointments

### 3. Book a slot

Each open slot is rendered with [AppointmentBookingCard](../src/components/appointments/AppointmentBookingCard.tsx).

Booking is handled by:

- [confirmAppointmentBookingAction](../src/app/services/appointments/actions.ts)

That action uses [bookSlot](../src/app/services/appointments/client-appointments.ts) to:

- verify the slot exists
- verify the slot is still open
- verify the slot is allowed for this client
- mark the slot as booked
- insert the appointment row

After booking, the UI refreshes so the booked slot disappears from the available list.

## Email Flow

When a booking succeeds, the system sends confirmation emails to both parties.

The email helper is:

- [sendAppointmentConfirmationEmail](../src/app/services/email/sendAppointmentConfirmation.ts)

The template is:

- [AppointmentConfirmationEmail](../src/components/email/appointment-confirmation-email.tsx)

The booking action fetches:

- client name and email
- coach name and email
- slot date and time
- slot type

Then it sends:

- one email to the client
- one email to the coach

## Client Profile Notes

The coach client detail page loads appointment notes through:

- [getAppointmentsForClient](../src/app/services/appointments/appointments.ts)

It renders those notes inside the client profile, so past appointment context stays visible next to the client’s other data.

## Navigation Links

The feature is wired into the main navigation here:

- [Coach layout](../src/app/(dashboard)/layout.tsx)
- [Coach mobile menu](../src/components/MobileDashboardMenu.tsx)
- [Client layout](../src/app/client/layout.tsx)
- [Client mobile menu](../src/components/MobileClientMenu.tsx)

It is also surfaced on both dashboards:

- [Coach dashboard](../src/app/(dashboard)/dashboard/page.tsx)
- [Client dashboard](../src/app/client/dashboard/page.tsx)

## Important Implementation Notes

- The flow is intentionally split between server components for data loading and client components for interactive buttons and forms.
- The booking flow depends on availability slots being created first by the coach.
- The client cannot book a slot that is already reserved for another client.
- Appointment notes are not stored on a separate notes table; they are saved on the appointment record itself.

## Current Shape Of The Feature

In practice, the feature now behaves like this:

- coach creates slots
- client books a slot
- appointment record is created
- confirmation emails are sent
- coach can inspect the booked appointment later
- coach can add notes and status updates
- notes show up again in the client profile
