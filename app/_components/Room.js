import Image from 'next/image';
import { EyeSlashIcon, MapPinIcon, UsersIcon } from '@heroicons/react/24/solid';
import TextExpander from './TextExpander';

function Room({ cabin: room }) {
  const { name, maxCapacity, image, description } = room;

  const features = [
    {
      icon: UsersIcon,
      text: (
        <>
          For up to <span className='font-semibold text-primary-50'>{maxCapacity}</span>{' '}
          guests
        </>
      ),
    },
    {
      icon: MapPinIcon,
      text: (
        <>
          In <span className='font-semibold text-primary-50'>Schitt&apos;s Creek</span>,
          just down the road from the café
        </>
      ),
    },
    {
      icon: EyeSlashIcon,
      text: (
        <>
          Privacy <span className='font-semibold text-primary-50'>100%</span>{' '}
          guaranteed (unless the mayor drops by)
        </>
      ),
    },
  ];

  return (
    <article className='mb-12 lg:mb-24'>
      <div className='relative h-64 sm:h-80 lg:h-[28rem] overflow-hidden rounded-3xl border border-primary-800'>
        <Image src={image} alt={`Room ${name}`} fill className='object-cover' />
        <div
          aria-hidden='true'
          className='absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/30 to-transparent'
        />
        <h3 className='neon-pink absolute bottom-4 left-5 sm:bottom-6 sm:left-8 font-display uppercase tracking-wider leading-none text-5xl sm:text-6xl lg:text-7xl xl:text-8xl'>
          Room {name}
        </h3>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 lg:gap-12 px-1 sm:px-2 pt-8'>
        <p className='text-base sm:text-lg text-primary-300 leading-relaxed'>
          <TextExpander>{description}</TextExpander>
        </p>

        <ul className='flex flex-col gap-3'>
          {features.map(({ icon: Icon, text }, i) => (
            <li
              key={i}
              className='flex gap-3 items-center rounded-xl border border-primary-800 bg-primary-900/60 px-4 py-3'
            >
              <Icon className='h-5 w-5 shrink-0 text-leaf-400' />
              <span className='text-primary-200'>{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default Room;
