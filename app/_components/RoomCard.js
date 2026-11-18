import { UsersIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';

function RoomCard({ cabin: room }) {
  const { id, name, maxCapacity, regularPrice, discount, image } = room;

  return (
    <Link
      href={`/rooms/${id}`}
      className='group flex flex-col overflow-hidden rounded-2xl border border-primary-800 bg-primary-900/60 transition-all hover:-translate-y-1 hover:border-accent-500/70 hover:shadow-glow'
    >
      <div className='relative h-56 sm:h-52 lg:h-56 overflow-hidden'>
        <Image
          src={image}
          fill
          alt={`Room ${name}`}
          className='object-cover transition-transform duration-500 group-hover:scale-105'
        />
        <div
          aria-hidden='true'
          className='absolute inset-0 bg-gradient-to-t from-primary-950/90 via-primary-950/10 to-transparent'
        />
        <h3 className='absolute bottom-3 left-4 font-display text-3xl tracking-wider uppercase text-primary-50 group-hover:neon-pink transition-colors'>
          Room {name}
        </h3>
        {discount > 0 ? (
          <span className='absolute top-3 left-3 rounded-full bg-cream-300 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-950'>
            Save ${discount}
          </span>
        ) : null}
      </div>

      <div className='flex flex-1 flex-col gap-4 p-4 sm:p-5'>
        <div className='flex items-center gap-2 text-primary-300'>
          <UsersIcon className='h-5 w-5 text-leaf-400' />
          <p>
            Up to <span className='font-semibold text-primary-100'>{maxCapacity}</span>{' '}
            guests
          </p>
        </div>

        <div className='mt-auto flex items-end justify-between gap-3'>
          <p className='flex gap-2 items-baseline flex-wrap'>
            {discount > 0 ? (
              <>
                <span className='text-3xl font-semibold text-cream-200'>
                  ${regularPrice - discount}
                </span>
                <span className='line-through text-primary-500'>${regularPrice}</span>
              </>
            ) : (
              <span className='text-3xl font-semibold text-cream-200'>${regularPrice}</span>
            )}
            <span className='text-primary-400'>/ night</span>
          </p>
          <span className='shrink-0 rounded-full border border-accent-500/60 px-3 py-1.5 text-sm text-accent-200 transition-colors group-hover:bg-accent-500 group-hover:text-primary-950'>
            Book &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}

export default RoomCard;
