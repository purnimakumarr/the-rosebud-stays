import DateSelector from '@/app/_components/DateSelector';
import ReservationForm from '@/app/_components/ReservationForm';
import { getSettings, getBookedDatesByCabinId } from '@/app/_lib/data-service';
import { auth } from '../_lib/auth';
import LoginMessage from './LoginMessage';

async function Reservation({ cabin }) {
  const [settings, bookedDates] = await Promise.all([
    getSettings(),
    getBookedDatesByCabinId(cabin.id),
  ]);

  const session = await auth();

  return (
    <div className='grid grid-cols-1 xl:grid-cols-2 overflow-hidden rounded-3xl border border-accent-500/25 shadow-[0_0_48px_-24px_theme(colors.accent.500/30%)] bg-primary-900/40 min-h-[400px]'>
      <DateSelector
        settings={settings}
        bookedDates={bookedDates}
        cabin={cabin}
      />
      {session?.user ? (
        <ReservationForm
          cabin={cabin}
          user={session.user}
          bookedDates={bookedDates}
        />
      ) : (
        <LoginMessage></LoginMessage>
      )}
    </div>
  );
}

export default Reservation;
