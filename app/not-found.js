import Link from 'next/link';

function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center gap-6 py-12 text-center'>
      <h1 className='text-3xl sm:text-4xl uppercase text-primary-50'>
        This page could not be found
      </h1>
      <p className='max-w-md text-base sm:text-lg text-primary-300'>
        Looks like you took a wrong turn on the way into town.
      </p>
      <Link
        href='/'
        className='inline-block rounded-full bg-accent-500 text-primary-950 font-semibold uppercase tracking-wider shadow-glow hover:bg-accent-400 transition-all px-6 py-3 text-lg'
      >
        Go back home
      </Link>
    </div>
  );
}

export default NotFound;
