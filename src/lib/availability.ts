import { format, parse, addMinutes, isBefore, isAfter, isSameDay, set, addHours } from 'date-fns';
import type { Appointment, BlockedDate, BusinessHours, ClinicSettings, Service, TimeSlot } from '../types/database';

/**
 * Format a Date into standard HH:mm:ss for Supabase time column
 */
export function formatTimeForDb(date: Date): string {
  return format(date, 'HH:mm:ss');
}

/**
 * Format a Date into standard YYYY-MM-DD for Supabase date column
 */
export function formatDateForDb(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Parse a database time string (e.g., "09:00:00" or "09:00") into a Date on a specific calendar day
 */
export function parseDbTimeToDate(dateObj: Date, timeStr?: string | null): Date {
  const safeTimeStr = typeof timeStr === 'string' && timeStr.trim() ? timeStr : '00:00:00';
  const parts = safeTimeStr.split(':');
  const hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;
  const seconds = parseInt(parts[2], 10) || 0;

  return set(dateObj, {
    hours,
    minutes,
    seconds,
    milliseconds: 0,
  });
}

/**
 * Checks if a candidate slot overlaps with any active (non-cancelled) existing appointment.
 * Overlap condition: (new_start < existing_end) && (new_end > existing_start)
 */
export function isSlotOverlapping(
  slotStart: Date,
  slotEnd: Date,
  appointmentsOnDate: Appointment[]
): boolean {
  for (const appt of appointmentsOnDate) {
    if (appt.status === 'cancelled') {
      continue;
    }

    // Parse appointment start and end times for this date
    const apptStart = parseDbTimeToDate(slotStart, appt.start_time);
    const apptEnd = parseDbTimeToDate(slotStart, appt.end_time);

    if (isBefore(slotStart, apptEnd) && isAfter(slotEnd, apptStart)) {
      return true; // Overlap detected
    }
  }
  return false;
}

/**
 * Generates all valid, non-overlapping, in-business-hours time slots for a given date and service.
 */
export function generateAvailableTimeSlots({
  targetDate,
  service,
  clinicSettings,
  businessHoursList,
  blockedDatesList,
  existingAppointments,
  now = new Date(),
}: {
  targetDate: Date;
  service: Service;
  clinicSettings: ClinicSettings;
  businessHoursList: BusinessHours[];
  blockedDatesList: BlockedDate[];
  existingAppointments: Appointment[];
  now?: Date;
}): TimeSlot[] {
  const dateStr = formatDateForDb(targetDate);

  // 1. Check if the target date is in the blocked_dates list
  const isBlocked = blockedDatesList.some((bd) => bd.blocked_date === dateStr);
  if (isBlocked) {
    return [];
  }

  // 2. Check if the clinic is open on this weekday (0 = Sunday, 1 = Monday, etc.)
  const weekday = targetDate.getDay();
  const daySchedule = businessHoursList.find((bh) => bh.weekday === weekday);
  if (!daySchedule || !daySchedule.is_open) {
    return [];
  }

  // 3. Parse working hours start and end
  const workStart = parseDbTimeToDate(targetDate, daySchedule.start_time);
  const workEnd = parseDbTimeToDate(targetDate, daySchedule.end_time);

  if (isBefore(workEnd, workStart) || workEnd.getTime() === workStart.getTime()) {
    return [];
  }

  // 4. Calculate earliest allowed booking time based on booking_notice_hours
  const noticeHours = Math.max(0, clinicSettings.booking_notice_hours || 0);
  const minBookingTime = addHours(now, noticeHours);

  // 5. Filter appointments for this date
  const appointmentsToday = existingAppointments.filter(
    (appt) => appt.appointment_date === dateStr && appt.status !== 'cancelled'
  );

  const durationMinutes = Math.max(10, service.duration_minutes || 30);
  const intervalMinutes = Math.max(10, clinicSettings.slot_interval_minutes || 30);

  const validSlots: TimeSlot[] = [];
  let currentSlotStart = new Date(workStart.getTime());

  // Generate slots in increments of slot_interval_minutes until slotEnd exceeds workEnd
  while (true) {
    const currentSlotEnd = addMinutes(currentSlotStart, durationMinutes);

    // If slot extends beyond closing time, break
    if (isAfter(currentSlotEnd, workEnd)) {
      break;
    }

    // Check if slot violates the booking notice buffer for today or past dates
    const isInFutureNotice = isAfter(currentSlotStart, minBookingTime);

    if (isInFutureNotice) {
      // Check for overlap with existing appointments
      const overlaps = isSlotOverlapping(currentSlotStart, currentSlotEnd, appointmentsToday);

      if (!overlaps) {
        validSlots.push({
          start: currentSlotStart,
          end: currentSlotEnd,
          label: `${format(currentSlotStart, 'h:mm a')} – ${format(currentSlotEnd, 'h:mm a')}`,
          startTimeStr: formatTimeForDb(currentSlotStart),
          endTimeStr: formatTimeForDb(currentSlotEnd),
        });
      }
    }

    // Step by interval
    currentSlotStart = addMinutes(currentSlotStart, intervalMinutes);
  }

  return validSlots;
}
