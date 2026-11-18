import { Suspense } from 'react';
import RoomList from '@/app/_components/RoomList';
import Spinner from '@/app/_components/Spinner';
import Filter from '../_components/Filter';
import ReservationReminder from '../_components/ReservationReminder';

export const revalidate = 3600;

export const metadata = {
  title: 'Rooms',
};

export default function Page({ searchParams }) {
  const filter = searchParams?.capacity ?? 'all';

  return (
    <div>
      <span className='block font-display text-base tracking-[0.3em] uppercase text-leaf-400 mb-2'>
        Rooms &amp; rates
      </span>
      <h1 className='neon-pink text-3xl sm:text-4xl uppercase mb-5'>
        Our Rooms
      </h1>
      <p className='text-primary-300 text-base sm:text-lg mb-10 max-w-3xl'>
        Cozy, wood-panelled rooms right on the main road of Schitt&apos;s Creek.
        Every one has been freshly renovated, with floral bedspreads, plaid
        armchairs, and a warm glow from the neon sign outside. Spend your days
        at the café, browse The Rose Apothecary, or just curl up by the fire.
        Extra towels are available from the front desk, with an eye-roll at no
        extra charge.
      </p>

      <div className='flex justify-start mb-8'>
        <Filter />
      </div>

      <Suspense fallback={<Spinner />} key={filter}>
        <RoomList filter={filter} />
        <ReservationReminder />
      </Suspense>
    </div>
  );
}
