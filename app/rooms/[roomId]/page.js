import Reservation from '@/app/_components/Reservation';
import Spinner from '@/app/_components/Spinner';
import { getCabin, getCabins } from '@/app/_lib/data-service';
import Room from '@/app/_components/Room';
import { Suspense } from 'react';

export async function generateMetadata({ params }) {
  const { name } = await getCabin(params.roomId);

  return { title: `Room ${name}` };
}

export async function generateStaticParams({ params }) {
  const cabins = await getCabins();

  const ids = cabins.map((cabin) => ({ roomId: String(cabin.id) }));

  return ids;
}

export default async function Page({ params }) {
  const cabin = await getCabin(params.roomId);

  return (
    <div className='max-w-6xl mx-auto mt-8'>
      <Room cabin={cabin} />

      <div>
        <h2 className='text-3xl sm:text-4xl lg:text-5xl uppercase text-center mb-8 lg:mb-10 text-primary-50 px-2'>
          Reserve Room {cabin.name} today.{' '}
          <span className='neon-leaf block sm:inline'>Pay on arrival.</span>
        </h2>
        <Suspense fallback={<Spinner />}>
          <Reservation cabin={cabin} />
        </Suspense>
      </div>
    </div>
  );
}
