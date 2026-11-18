import Link from 'next/link';
import Image from 'next/image';
import logo from '@/public/logo.svg';

function Logo() {
  return (
    <Link href='/' className='group flex items-center gap-2 sm:gap-3 z-10 min-w-0'>
      <Image
        src={logo}
        height='44'
        width='44'
        alt='The Rosebud Stays logo'
        className='h-9 w-9 sm:h-11 sm:w-11 shrink-0 transition-transform group-hover:rotate-12'
      />
      <span className='font-display text-lg sm:text-xl tracking-[0.12em] sm:tracking-[0.18em] whitespace-nowrap uppercase text-primary-50 group-hover:text-cream-300 transition-colors'>
        The Rosebud Stays
      </span>
    </Link>
  );
}

export default Logo;
