'use client';

import { useOptimistic, useState } from 'react';
import ReservationCard from './ReservationCard';
import FormMessage from './FormMessage';
import { deleteBooking } from '../_lib/actions';

function ReservationList({ bookings }) {
  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    (curBookings, bookingId) =>
      curBookings.filter((booking) => booking.id !== bookingId),
  );

  const [error, setError] = useState(null);

  async function handleDelete(bookingId) {
    setError(null);
    optimisticDelete(bookingId);

    // If it fails, the optimistic removal is undone when the transition ends
    // and the card reappears, so just explain what happened
    const result = await deleteBooking(bookingId);
    if (result?.error) setError(result.error);
  }

  return (
    <div className='space-y-6'>
      <FormMessage error={error} />

      <ul className='space-y-6'>
        {optimisticBookings.map((booking) => (
          <ReservationCard
            booking={booking}
            key={booking.id}
            onDelete={handleDelete}
          />
        ))}
      </ul>
    </div>
  );
}

export default ReservationList;
