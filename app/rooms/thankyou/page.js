import Link from 'next/link';

export default function Page() {
  return (
    <div className='text-center space-y-6 mt-4'>
      <h1 className='neon-pink text-4xl uppercase'>
        Thank you for your reservation!
      </h1>
      <p className='text-lg text-primary-300'>
        Your key will be waiting at the front desk.
      </p>
      <Link
        href='/account/reservations'
        className='underline decoration-2 underline-offset-4 text-xl text-accent-300 inline-block'
      >
        Manage your reservations &rarr;
      </Link>
    </div>
  );
}
