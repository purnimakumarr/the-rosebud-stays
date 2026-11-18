function LoginMessage() {
  return (
    <div className='grid bg-primary-800/50 px-4'>
      <p className='text-center text-lg sm:text-xl py-12 self-center'>
        Please{' '}
        <a href='/login' className='underline decoration-2 underline-offset-4 text-accent-300 hover:text-accent-100'>
          login
        </a>{' '}
        to reserve this
        <br /> room right now
      </p>
    </div>
  );
}

export default LoginMessage;
