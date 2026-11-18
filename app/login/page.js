import SignInButton from '../_components/SignInButton';

export const metadata = {
  title: 'Login',
};

export default function Page() {
  return (
    <div className='flex min-h-[50vh] items-center justify-center py-6 sm:py-12'>
      <div className='flex w-full max-w-md flex-col items-center gap-6 sm:gap-8 rounded-3xl border border-primary-800 bg-primary-900/50 px-5 py-10 sm:px-10 sm:py-14 text-center'>
        <div className='space-y-3'>
          <h2 className='text-2xl sm:text-3xl uppercase tracking-wider text-center text-primary-50'>
            Sign in to access your guest area
          </h2>
          <p className='text-sm sm:text-base text-primary-400'>
            Manage your reservations and guest profile. The front desk promises
            not to judge your luggage.
          </p>
        </div>

        <SignInButton />
      </div>
    </div>
  );
}
