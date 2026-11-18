import Image from 'next/image';
import Link from 'next/link';
import image1 from '@/public/about-1.jpg';
import image2 from '@/public/about-2.jpg';
import { getCabins } from '../_lib/data-service';

export const revalidate = 86400;

export const metadata = {
  title: 'About',
};

export default async function Page() {
  const rooms = await getCabins();

  return (
    <div className='grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-x-10 lg:gap-x-24 gap-y-12 md:gap-y-16 lg:gap-y-32 text-base md:text-lg items-center'>
      <div className='md:col-span-3'>
        <h1 className='neon-pink text-3xl md:text-4xl lg:text-5xl uppercase leading-tight mb-10'>
          Welcome to The Rosebud Stays
        </h1>

        <div className='space-y-8'>
          <p>
            If you&apos;ve ever watched{' '}
            <span className='italic'>Schitt&apos;s Creek</span>, you already
            know this place. A very rich family loses everything, except for a
            tiny town they once bought as a joke. They move into two adjoining
            rooms at the local motel, and somewhere between the bad Wi-Fi and
            the worse coffee, they find out what home really means.
          </p>
          <p>
            The Rosebud Stays is our love letter to that motel. Our{' '}
            {rooms.length} rooms come with wood-panelled walls, floral
            bedspreads, and the kind of front desk where someone remembers your
            name (and quietly judges your luggage). It&apos;s cozy, it&apos;s a
            little quirky, and it&apos;s exactly as fancy as it needs to be.
          </p>
          <p>
            Grab breakfast at the café down the road, pick up something
            beautifully overpriced at The Rose Apothecary, and catch a choir
            rehearsal if you&apos;re lucky. Fair warning: people come for one
            night and somehow never leave.
          </p>
        </div>
      </div>

      <div className='md:col-span-2'>
        <Image
          src={image1}
          placeholder='blur'
          quality={80}
          className='w-full h-auto rounded-3xl border border-primary-800 shadow-[0_0_48px_-24px_theme(colors.accent.500/40%)]'
          alt='Wood-panelled motel lobby with a stone fireplace and the front desk'
        />
      </div>

      <div className='md:col-span-2'>
        <Image
          src={image2}
          placeholder='blur'
          quality={80}
          className='w-full h-auto rounded-3xl border border-primary-800 shadow-[0_0_48px_-24px_theme(colors.accent.500/40%)]'
          alt='The motel porch and rooms lit up at dusk'
        />
      </div>

      <div className='md:col-span-3'>
        <h1 className='neon-pink text-3xl md:text-4xl lg:text-5xl uppercase leading-tight mb-10'>
          Run by a family that learned the hard way
        </h1>

        <div className='space-y-8'>
          <p>
            We like to imagine the Rosebud the way the show left it: a former
            video-store mogul handling the business plan, a soap-opera legend
            handling the drama, a son with impeccable taste choosing the throw
            pillows, and a daughter who has somehow been everywhere and knows
            someone in every town. Behind the desk, a deadpan manager keeps it
            all running and has opinions about all of it.
          </p>
          <p>
            We&apos;re not a luxury resort, and we never wanted to be.
            We&apos;re the motel that turns strangers into family. Check in, put
            your feet up, and stay a while.
          </p>

          <div>
            <Link
              href='/rooms'
              className='inline-block mt-4 rounded-full bg-accent-500 px-8 py-5 text-primary-950 text-lg font-semibold uppercase tracking-wider shadow-glow hover:bg-accent-400 transition-all'
            >
              Explore our rooms
            </Link>
          </div>

          <p className='text-sm text-primary-400'>
            The Rosebud Stays is a fan project inspired by{' '}
            <span className='italic'>Schitt&apos;s Creek</span>. It is not
            affiliated with or endorsed by the show or its creators.
          </p>
        </div>
      </div>
    </div>
  );
}
