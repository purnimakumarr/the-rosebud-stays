'use client';

import { useFormState } from 'react-dom';
import { useReservation } from './ReservationContext';
import { createBooking } from '../_lib/actions';
import { isRangeBooked, rangeKey } from '../_lib/booking-rules';
import SubmitButton from './SubmitButton';
import FormMessage from './FormMessage';

function ReservationForm({ cabin, user, bookedDates = [] }) {
  const { maxCapacity, id } = cabin;
  const { range, resetRange } = useReservation();

  // Same rule the calendar uses: a range over booked days is not bookable
  const hasBookableRange =
    Boolean(range.from && range.to) && !isRangeBooked(range, bookedDates);

  // Only the room and the dates come from the browser; the server works out
  // the price and checks availability itself.
  const createBookingWithData = createBooking.bind(null, {
    cabinId: id,
    startDate: range.from,
    endDate: range.to,
  });

  // On success the action redirects; otherwise it returns { error }. The
  // error remembers which dates it was about, so it disappears as soon as the
  // guest picks different ones.
  const currentRangeKey = rangeKey(range);
  const [state, formAction] = useFormState(async (_prevState, formData) => {
    const result = await createBookingWithData(formData);
    if (result?.error) return { ...result, rangeKey: currentRangeKey };

    resetRange();
    return null;
  }, null);
  const error = state?.rangeKey === currentRangeKey ? state.error : null;

  return (
    <div className='xl:scale-[1.01] min-w-0'>
      <div className='bg-primary-800/70 text-primary-300 px-4 py-3 sm:px-8 lg:px-16 sm:py-2 flex flex-col items-start gap-3 sm:flex-row sm:justify-between sm:items-center'>
        <p>Logged in as</p>

        <div className='flex gap-4 items-center'>
          <img
            // Important to display google profile images
            referrerPolicy='no-referrer'
            className='h-8 rounded-full'
            src={user.image}
            alt={user.name}
          />
          <p>{user.name}</p>
        </div>
      </div>

      <form
        action={formAction}
        className='bg-primary-900/60 py-8 px-4 sm:px-8 lg:px-16 text-base sm:text-lg flex gap-5 flex-col'
      >
        <div className='space-y-2'>
          <label htmlFor='numGuests'>How many guests?</label>
          <select
            name='numGuests'
            id='numGuests'
            className='px-5 py-3 bg-primary-950 border border-primary-700 text-primary-100 placeholder:text-primary-500 w-full rounded-xl focus:outline-none focus:border-accent-500 focus:shadow-glow'
            required
          >
            <option value='' key=''>
              Select number of guests...
            </option>
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>
        </div>

        <div className='space-y-2'>
          <label htmlFor='observations'>
            Anything we should know about your stay?
          </label>
          <textarea
            name='observations'
            id='observations'
            className='px-5 py-3 bg-primary-950 border border-primary-700 text-primary-100 placeholder:text-primary-500 w-full rounded-xl focus:outline-none focus:border-accent-500 focus:shadow-glow'
            placeholder='Any pets, allergies, special requirements, etc.?'
          />
        </div>

        <FormMessage error={error} />

        <div className='flex flex-col sm:flex-row sm:justify-end sm:items-center gap-4 sm:gap-6'>
          {!hasBookableRange ? (
            <p className='text-primary-300 text-base'>
              Start by selecting dates
            </p>
          ) : (
            <SubmitButton pendingLabel={'Reserving...'}>
              Reserve now
            </SubmitButton>
          )}
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;
