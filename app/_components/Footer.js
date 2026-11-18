const GITHUB_URL = 'https://github.com/purnimakumarr';

function GitHubIcon(props) {
  return (
    <svg viewBox='0 0 24 24' fill='currentColor' aria-hidden='true' {...props}>
      <path d='M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a10.9 10.9 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.82 1.19 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z' />
    </svg>
  );
}

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className='relative z-10 bg-primary-950 border-t border-primary-900 px-4 py-8 sm:px-6 lg:px-8 text-sm text-primary-400'>
      <div
        aria-hidden='true'
        className='absolute inset-x-0 -top-px mx-auto h-px max-w-3xl bg-gradient-to-r from-transparent via-accent-500/60 to-transparent'
      />

      <div className='max-w-7xl mx-auto flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-center text-center sm:text-left'>
        <div className='space-y-1'>
          <p className='font-display text-lg tracking-[0.2em] uppercase text-primary-100'>
            The Rosebud Stays
          </p>
          <p>
            <span className='block sm:inline'>
              &copy; {year} The Rosebud Stays.
            </span>{' '}
            <span className='whitespace-nowrap'>
              <span className='text-accent-400' aria-hidden='true'>
                &#10047;
              </span>{' '}
              Created by <span className='text-primary-200'>Purnima Kumar</span>.
            </span>
          </p>
        </div>

        <a
          href={GITHUB_URL}
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex items-center justify-center gap-2 self-center rounded-full border border-primary-700 px-4 py-2 text-primary-200 hover:border-accent-500/60 hover:text-accent-200 transition-colors'
        >
          <GitHubIcon className='h-4 w-4' />
          <span>@purnimakumarr</span>
        </a>
      </div>

      <p className='max-w-7xl mx-auto mt-6 pt-6 border-t border-primary-900 text-xs text-primary-500 text-center sm:text-left'>
        A fan-made project inspired by the Rosebud Motel from{' '}
        <span className='italic'>Schitt&apos;s Creek</span>. Not affiliated
        with or endorsed by the show or its creators.
      </p>
    </footer>
  );
}

export default Footer;
