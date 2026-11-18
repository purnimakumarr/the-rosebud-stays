import Link from 'next/link';
import { auth } from '../_lib/auth';
import MobileMenu from './MobileMenu';

const linkClass =
  'rounded-full px-3 py-1.5 lg:px-4 text-primary-200 hover:text-accent-200 hover:bg-accent-500/10 transition-colors';

export default async function Navigation() {
  const session = await auth();
  const user = session?.user;

  return (
    <nav className='z-10 text-sm lg:text-base'>
      <ul className='hidden sm:flex items-center gap-1 lg:gap-3'>
        <li>
          <Link href='/rooms' className={linkClass}>
            Rooms
          </Link>
        </li>
        <li>
          <a href='/about' className={linkClass}>
            About
          </a>
        </li>
        <li className='ml-1 lg:ml-2'>
          <Link
            href='/account'
            className='flex items-center gap-2 rounded-full border border-accent-500/70 px-4 py-1.5 text-accent-200 hover:shadow-glow hover:text-accent-50 transition-shadow whitespace-nowrap'
          >
            {user?.image ? (
              <img
                className='h-6 rounded-full'
                src={user.image}
                alt={user.name}
                referrerPolicy='no-referrer'
              />
            ) : null}
            <span>Guest area</span>
          </Link>
        </li>
      </ul>

      <MobileMenu user={user ? { name: user.name, image: user.image } : null} />
    </nav>
  );
}
