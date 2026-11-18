'use client';

import { useFormState } from 'react-dom';
import { updateBooking } from '@/app/_lib/actions';
import SubmitButton from './SubmitButton';
import FormMessage from './FormMessage';

function UpdateReservationForm({
  maxCapacity,
  bookingId,
  numGuests,
  observations,
}) {
  const updateBookingWithId = updateBooking.bind(null, Number(bookingId));

  // On success the action redirects; otherwise it returns { error }
  const [state, formAction] = useFormState(
    (_prevState, formData) => updateBookingWithId(formData),
    null,
  );

  return (
    <form
      action={formAction}
      className='bg-primary-900 py-8 px-4 sm:px-8 lg:px-12 text-base sm:text-lg flex gap-6 flex-col'
    >
      <div className='space-y-2'>
        <label htmlFor='numGuests'>How many guests?</label>
        <select
          name='numGuests'
          id='numGuests'
          defaultValue={numGuests}
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
          id='observations'
          name='observations'
          defaultValue={observations}
          className='px-5 py-3 bg-primary-950 border border-primary-700 text-primary-100 placeholder:text-primary-500 w-full rounded-xl focus:outline-none focus:border-accent-500 focus:shadow-glow'
        />
      </div>

      <FormMessage error={state?.error} />

      <div className='flex justify-end items-center gap-6'>
        <SubmitButton pendingLabel='Updating...'>
          Update Reservation
        </SubmitButton>
      </div>
    </form>
  );
}

export default UpdateReservationForm;
