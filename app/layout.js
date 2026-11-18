import '@/app/_styles/globals.css';
import { Bebas_Neue, DM_Sans } from 'next/font/google';
import Header from './_components/Header';
import Footer from './_components/Footer';
import { ReservationProvider } from './_components/ReservationContext';

const display = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-display',
});

const body = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

export const metadata = {
  title: {
    template: '%s / The Rosebud Stays',
    default: 'Welcome / The Rosebud Stays',
  },
  description:
    "A cozy, family-run motel in the small town of Schitt's Creek. A fan-made booking site inspired by the Rosebud Motel.",
};

function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body
        className={`bg-primary-950 text-primary-100 font-sans antialiased min-h-screen flex flex-col ${display.variable} ${body.variable} relative`}
      >
        <Header />

        <div className='flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12 grid min-w-0'>
          <main className='max-w-7xl mx-auto w-full min-w-0'>
            <ReservationProvider>{children}</ReservationProvider>
          </main>
        </div>

        <Footer />
      </body>
    </html>
  );
}

export default RootLayout;
