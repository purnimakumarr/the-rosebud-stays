'use client';

import { useEffect } from 'react';

// Shown when a page fails to load. The raw error stays in the console; in
// production Next.js hides server error details anyway, so the guest gets a
// friendly explanation and a way to retry.
export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className='flex flex-col items-center justify-center gap-6 py-12 text-center'>
      <h1 className='text-3xl sm:text-4xl uppercase text-primary-50'>
        Something went wrong
      </h1>
      <p className='max-w-md text-base sm:text-lg text-primary-300'>
        We couldn&apos;t load this page just now. It&apos;s probably a hiccup
        on our side, so please try again in a moment.
      </p>

      <div className='flex flex-col sm:flex-row items-center gap-4'>
        <button
          className='inline-block rounded-full bg-accent-500 text-primary-950 font-semibold uppercase tracking-wider shadow-glow hover:bg-accent-400 transition-all px-6 py-3 text-lg'
          onClick={reset}
        >
          Try again
        </button>
        <a
          href='/'
          className='underline decoration-2 underline-offset-4 text-accent-300 hover:text-accent-100'
        >
          Back to the front desk
        </a>
      </div>
    </div>
  );
}
