import ReservationList from '@/app/_components/ReservationList';
import { auth } from '@/app/_lib/auth';
import { getBookings } from '@/app/_lib/data-service';
import Link from 'next/link';

export const metadata = {
  title: 'Reservations',
};

export default async function Page() {
  const session = await auth();
  const bookings = await getBookings(session.user.guestId);

  return (
    <div>
      <h2 className='text-3xl uppercase text-accent-300 mb-7'>
        Your reservations
      </h2>

      {bookings.length === 0 ? (
        <p className='text-lg'>
          You have no reservations yet. Check out our{' '}
          <Link className='underline decoration-2 underline-offset-4 text-accent-300' href='/rooms'>
            rooms &rarr;
          </Link>
        </p>
      ) : (
        <ReservationList bookings={bookings} />
      )}
    </div>
  );
}
