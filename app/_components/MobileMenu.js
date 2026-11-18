'use client';

import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

function MobileMenu({ user }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close after navigating, and on Escape
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const close = () => setOpen(false);
  const itemClass =
    'flex items-center gap-3 rounded-xl px-4 py-3 text-base text-primary-100 hover:bg-primary-900 transition-colors';

  return (
    <div className='sm:hidden'>
      <button
        type='button'
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls='mobile-menu'
        aria-label={open ? 'Close menu' : 'Open menu'}
        className='grid h-10 w-10 place-items-center rounded-full border border-primary-700 text-primary-100 hover:border-accent-500/60 transition-colors'
      >
        {open ? <XMarkIcon className='h-5 w-5' /> : <Bars3Icon className='h-5 w-5' />}
      </button>

      {open ? (
        <ul
          id='mobile-menu'
          className='absolute inset-x-0 top-full flex flex-col gap-1 border-b border-primary-800 bg-primary-950/95 backdrop-blur-md px-4 py-3 shadow-xl'
        >
          <li>
            <Link href='/rooms' className={itemClass} onClick={close}>
              Rooms
            </Link>
          </li>
          <li>
            <a href='/about' className={itemClass} onClick={close}>
              About
            </a>
          </li>
          <li>
            <Link
              href='/account'
              onClick={close}
              className={`${itemClass} border border-accent-500/50 text-accent-200`}
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
      ) : null}
    </div>
  );
}

export default MobileMenu;
