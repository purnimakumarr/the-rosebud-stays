import Navigation from '@/app/_components/Navigation';
import Logo from '@/app/_components/Logo';

function Header() {
  return (
    <header className='sticky top-0 z-30 border-b border-accent-500/20 bg-primary-950/80 backdrop-blur-md shadow-[0_1px_16px_-8px_theme(colors.accent.500/25%)] px-4 py-3 sm:px-6 lg:px-8 lg:py-4'>
      <div className='flex flex-row items-center justify-between gap-4 sm:gap-6 max-w-7xl mx-auto w-full'>
        <Logo />
        <Navigation />
      </div>
    </header>
  );
}

export default Header;
