'use client';

import { XMarkIcon } from '@heroicons/react/24/solid';
import { format } from 'date-fns';
import { useReservation } from './ReservationContext';

function ReservationReminder() {
  const { range, resetRange } = useReservation();

  if (!range.from || !range.to) return null;

  return (
    // z-40: floats above the footer (z-10) and the sticky header (z-30)
    <div className='fixed z-40 bottom-4 left-4 right-4 sm:bottom-6 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 py-4 px-4 sm:py-5 sm:px-8 rounded-2xl sm:rounded-full border border-accent-500/70 bg-primary-950/90 backdrop-blur text-accent-100 text-sm sm:text-base font-semibold shadow-glow flex gap-4 sm:gap-8 items-center max-w-full'>
      <p>
        <span>👋</span> Don't forget to reserve your room from{' '}
        {format(new Date(range.from), 'MMM dd yyyy')} to{' '}
        {format(new Date(range.to), 'MMM dd yyyy')}
      </p>
      <button
        type='button'
        aria-label='Dismiss reminder'
        className='rounded-full p-1 hover:bg-accent-500/20 transition-all'
        onClick={resetRange}
      >
        <XMarkIcon className='h-5 w-5' aria-hidden='true' />
      </button>
    </div>
  );
}

export default ReservationReminder;
