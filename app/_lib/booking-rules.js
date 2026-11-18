// Booking rules shared by the browser (to guide the guest) and the server
// actions (to enforce them). Nothing here touches the database, so the rules
// can be unit tested and imported from client components.

import { differenceInDays, isWithinInterval } from 'date-fns';

export const MAX_OBSERVATIONS_LENGTH = 1000;

export const DATES_TAKEN_MESSAGE =
  'Sorry, some of those nights were just booked by another guest. Please choose different dates.';

// A problem the guest can fix (bad dates, too many guests, ...). Its message
// is written for guests and is safe to show them as is. Anything else that
// goes wrong is unexpected and gets a generic message instead.
export class UserError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UserError';
  }
}

// True when the selected range covers at least one day that is already taken.
export function isRangeBooked(range, bookedDates = []) {
  if (!range?.from || !range?.to) return false;

  return bookedDates.some((date) =>
    isWithinInterval(date, { start: range.from, end: range.to }),
  );
}

export function validateGuestCount(value, maxCapacity) {
  const numGuests = Number(value);

  if (!Number.isInteger(numGuests) || numGuests < 1 || numGuests > maxCapacity)
    throw new UserError(
      `This room sleeps between 1 and ${maxCapacity} guests. Please choose how many are coming.`,
    );

  return numGuests;
}

export function cleanObservations(value) {
  return String(value ?? '').slice(0, MAX_OBSERVATIONS_LENGTH);
}

// Checks a requested stay against the room, the hotel settings and the
// existing bookings, and works out the price on the server's terms, so
// nothing the browser sends about money or availability is trusted.
export function priceStay({
  startDate,
  endDate,
  cabin,
  settings,
  bookedDates,
  now = new Date(),
}) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()))
    throw new UserError('Please pick your check-in and check-out dates.');

  if (start < now)
    throw new UserError(
      'Check-in has to be a future date. Please pick new dates.',
    );

  const numNights = differenceInDays(end, start);
  const { minBookingLength, maxBookingLength } = settings;

  if (numNights < minBookingLength || numNights > maxBookingLength)
    throw new UserError(
      `Stays can be ${minBookingLength} to ${maxBookingLength} nights long, and you picked ${numNights}. Please adjust your dates.`,
    );

  if (isRangeBooked({ from: start, to: end }, bookedDates))
    throw new UserError(DATES_TAKEN_MESSAGE);

  const cabinPrice = numNights * (cabin.regularPrice - cabin.discount);

  return { startDate: start, endDate: end, numNights, cabinPrice };
}

// Guests can change or cancel a stay online only before it starts; the
// reservation list hides the buttons, and the server enforces the same rule.
export function canChangeBooking(booking, now = new Date()) {
  return new Date(booking.startDate) > now;
}

// A stable key for the selected range, so a message about one set of dates
// can be hidden once the guest picks different ones.
export function rangeKey(range) {
  const time = (date) => (date ? new Date(date).getTime() : '');
  return `${time(range?.from)}-${time(range?.to)}`;
}
