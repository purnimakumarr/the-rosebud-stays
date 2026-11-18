import Image from 'next/image';
import Link from 'next/link';
import hero from '@/public/hero.jpg';

export default function Page() {
  return (
    <section className='flex flex-col justify-center min-h-[calc(100svh-8rem)] sm:block sm:min-h-0 sm:mt-16 lg:mt-24'>
      {/* Phones: the section fills the screen below the header and centres the
          text in it. From tablet width: a fixed offset from the top. */}
      {/* Phones: the photo fills exactly one screen and is centred, so the
          motel (the middle band of the photo) is in view, not just the sky.
          From tablet width it spans the whole page, anchored to the top. */}
      <div className='absolute inset-x-0 top-0 h-[100svh] sm:h-auto sm:bottom-0'>
        <Image
          src={hero}
          fill
          sizes='100vw'
          placeholder='blur'
          quality={80}
          className='object-cover object-center sm:object-top'
          alt='The Rosebud Stays motel and its neon sign at dusk, with mountains behind'
        />
        {/* Fade the photo into the night so the type stays readable; lighter
            through the middle on phones so the motel shows through */}
        <div
          aria-hidden='true'
          className='absolute inset-0 bg-gradient-to-b from-primary-950/60 via-primary-950/25 to-primary-950/90 sm:from-primary-950/40 sm:via-primary-950/70 sm:to-primary-950'
        />
      </div>

      <div className='relative z-10 text-center px-2 flex flex-col items-center'>
        <h1 className='neon-pink neon-flicker font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl mb-4 sm:mb-6 tracking-wider uppercase leading-none'>
          Welcome to the Rosebud.
        </h1>

        <p className='max-w-xl text-primary-200 text-base sm:text-lg mb-8 sm:mb-12'>
          Wood-panelled rooms, floral bedspreads, and a front desk with opinions.
          Right on the main road of{' '}
          <span className='text-cream-300'>Schitt&apos;s Creek</span>.
        </p>

        <Link
          href='/rooms'
          className='rounded-full bg-accent-500 px-5 py-4 sm:px-8 sm:py-6 text-primary-950 text-base sm:text-lg font-semibold uppercase tracking-widest shadow-glow hover:bg-accent-400 hover:shadow-[0_0_28px_-4px_theme(colors.accent.500/45%)] transition-all'
        >
          Explore our rooms
        </Link>
      </div>
    </section>
  );
}
