'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth, signIn, signOut } from './auth';
import { supabase } from './supabase';
import {
  getBookedDatesByCabinId,
  getBookings,
  getCabin,
  getCountries,
  getSettings,
} from './data-service';
import {
  DATES_TAKEN_MESSAGE,
  UserError,
  canChangeBooking,
  cleanObservations,
  priceStay,
  validateGuestCount,
} from './booking-rules';

// Postgres "exclusion_violation": raised by the bookings_no_overlap
// exclusion constraint on the bookings table when two bookings for the same
// room overlap, e.g. two guests submitting the same dates at the same time.
const OVERLAP_VIOLATION = '23P01';

// Form actions return `{ error }` with a message for the guest instead of
// throwing, so the form can show it next to the button. Problems the guest
// can fix (UserError) keep their own message; anything unexpected is logged
// and replaced with a polite generic one, so no internals leak to the page.
async function withFriendlyErrors(fallbackMessage, work) {
  try {
    return await work();
  } catch (err) {
    if (err instanceof UserError) return { error: err.message };

    console.error(err);
    return { error: fallbackMessage };
  }
}

async function requireGuestId() {
  const session = await auth();
  const guestId = session?.user?.guestId;
  if (!guestId) throw new UserError('Please sign in to continue.');

  return guestId;
}

// Returns the booking only if it belongs to this guest and hasn't started yet
async function getChangeableBooking(guestId, bookingId) {
  const guestBookings = await getBookings(guestId);
  const booking = guestBookings.find((b) => b.id === bookingId);

  if (!booking)
    throw new UserError("We couldn't find that reservation on your account.");

  if (!canChangeBooking(booking))
    throw new UserError(
      "This stay has already started, so it can't be changed online. Please contact the front desk.",
    );

  return booking;
}

// The browser only says which room and which dates. Price, length of stay,
// capacity and availability are all checked here against the database.
export async function createBooking({ cabinId, startDate, endDate }, formData) {
  const result = await withFriendlyErrors(
    "We couldn't save your reservation just now. Please try again in a moment.",
    async () => {
      const guestId = await requireGuestId();

      const [cabin, settings, bookedDates] = await Promise.all([
        getCabin(cabinId),
        getSettings(),
        getBookedDatesByCabinId(cabinId),
      ]);

      const stay = priceStay({
        startDate,
        endDate,
        cabin,
        settings,
        bookedDates,
      });
      const numGuests = validateGuestCount(
        formData.get('numGuests'),
        cabin.maxCapacity,
      );

      const newBooking = {
        cabinId: cabin.id,
        guestId,
        startDate: stay.startDate,
        endDate: stay.endDate,
        numNights: stay.numNights,
        cabinPrice: stay.cabinPrice,
        numGuests,
        observations: cleanObservations(formData.get('observations')),
        extrasPrice: 0,
        totalPrice: stay.cabinPrice,
        isPaid: false,
        hasBreakfast: false,
        status: 'unconfirmed',
      };

      // The check above can't stop two requests for the same nights that
      // arrive together; the database constraint does, and we explain it.
      const { error } = await supabase.from('bookings').insert([newBooking]);
      if (error?.code === OVERLAP_VIOLATION)
        throw new UserError(DATES_TAKEN_MESSAGE);
      if (error) throw error;

      revalidatePath(`/rooms/${cabin.id}`);
      return null;
    },
  );
  if (result?.error) return result;

  redirect('/rooms/thankyou');
}

export async function updateBooking(bookingId, formData) {
  const result = await withFriendlyErrors(
    "We couldn't update your reservation just now. Please try again in a moment.",
    async () => {
      const guestId = await requireGuestId();
      const booking = await getChangeableBooking(guestId, bookingId);

      const { maxCapacity } = await getCabin(booking.cabinId);
      const updatedFields = {
        numGuests: validateGuestCount(formData.get('numGuests'), maxCapacity),
        observations: cleanObservations(formData.get('observations')),
      };

      const { error } = await supabase
        .from('bookings')
        .update(updatedFields)
        .eq('id', bookingId);
      if (error) throw error;

      revalidatePath('/account/reservations');
      revalidatePath(`/account/reservations/edit/${bookingId}`);
      return null;
    },
  );
  if (result?.error) return result;

  redirect('/account/reservations');
}

export async function deleteBooking(bookingId) {
  return withFriendlyErrors(
    "We couldn't cancel that reservation just now. Please try again in a moment.",
    async () => {
      const guestId = await requireGuestId();
      await getChangeableBooking(guestId, bookingId);

      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);
      if (error) throw error;

      revalidatePath('/account/reservations');
      return null;
    },
  );
}

export async function updateGuest(formData) {
  return withFriendlyErrors(
    "We couldn't save your profile just now. Please try again in a moment.",
    async () => {
      const guestId = await requireGuestId();

      const nationalID = String(formData.get('nationalID') ?? '').trim();
      const nationality = String(formData.get('nationality') ?? '').trim();

      if (!nationality)
        throw new UserError("Please choose the country you're from.");

      // Only countries from the list are accepted, and the flag comes from
      // the list too, never from the form
      const countries = await getCountries();
      const country = countries.find((c) => c.names.common === nationality);
      if (!country)
        throw new UserError(
          "We don't recognise that country. Please choose one from the list.",
        );
      const countryFlag = country.flag.url_svg ?? country.flag.url_png;

      if (!/^[A-Za-z0-9]{6,12}$/.test(nationalID))
        throw new UserError(
          'Your national ID should be 6 to 12 letters or numbers, with no spaces or symbols.',
        );

      const { error } = await supabase
        .from('guests')
        .update({ nationality, countryFlag, nationalID })
        .eq('id', guestId);
      if (error) throw error;

      revalidatePath('/account/profile');
      return { success: 'Your profile has been updated.' };
    },
  );
}

export async function signInAction() {
  await signIn('google', { redirectTo: '/account' });
}

export async function signOutAction() {
  await signOut({ redirectTo: '/' });
}
