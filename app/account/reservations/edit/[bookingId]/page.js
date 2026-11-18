import { notFound } from 'next/navigation';
import UpdateReservationForm from '@/app/_components/UpdateReservationForm';
import { auth } from '@/app/_lib/auth';
import { canChangeBooking } from '@/app/_lib/booking-rules';
import FormMessage from '@/app/_components/FormMessage';
import { getBooking, getCabin } from '@/app/_lib/data-service';

export default async function Page({ params }) {
  const session = await auth();
  const guestId = session?.user?.guestId;
  if (!guestId) notFound();

  const { bookingId } = params;
  const booking = await getBooking(bookingId);

  // Another guest's booking looks exactly like one that doesn't exist
  if (booking.guestId !== guestId) notFound();

  if (!canChangeBooking(booking))
    return (
      <div className='space-y-6'>
        <h2 className='text-3xl uppercase text-accent-300'>
          Reservation #{bookingId}
        </h2>
        <FormMessage error="This stay has already started, so it can't be changed online. Please contact the front desk." />
        <a
          href='/account/reservations'
          className='inline-block underline decoration-2 underline-offset-4 text-accent-300 hover:text-accent-100'
        >
          &larr; Back to your reservations
        </a>
      </div>
    );

  const { cabinId, numGuests, observations } = booking;
  const { maxCapacity } = await getCabin(cabinId);

  return (
    <div>
      <h2 className='text-3xl uppercase text-accent-300 mb-7'>
        Edit Reservation #{bookingId}
      </h2>

      <UpdateReservationForm
        maxCapacity={maxCapacity}
        bookingId={bookingId}
        numGuests={numGuests}
        observations={observations}
      />
    </div>
  );
}
