'use client';

import { useFormState } from 'react-dom';
import { updateGuest } from '@/app/_lib/actions';
import SubmitButton from './SubmitButton';
import FormMessage from './FormMessage';

function UpdateProfileForm({ children, guest }) {
  const { fullName, email, nationalID, countryFlag } = guest;

  // Returns { error } or { success } to show above the button
  const [state, formAction] = useFormState(
    (_prevState, formData) => updateGuest(formData),
    null,
  );

  return (
    <form
      action={formAction}
      className='bg-primary-900 py-8 px-4 sm:px-8 lg:px-12 text-base sm:text-lg flex gap-6 flex-col'
    >
      <div className='space-y-2'>
        <label htmlFor='fullName'>Full name</label>
        <input
          id='fullName'
          disabled
          defaultValue={fullName}
          name='fullName'
          className='px-5 py-3 bg-primary-950 border border-primary-700 text-primary-100 placeholder:text-primary-500 w-full rounded-xl focus:outline-none focus:border-accent-500 focus:shadow-glow disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400'
        />
      </div>

      <div className='space-y-2'>
        <label htmlFor='email'>Email address</label>
        <input
          id='email'
          disabled
          defaultValue={email}
          name='email'
          className='px-5 py-3 bg-primary-950 border border-primary-700 text-primary-100 placeholder:text-primary-500 w-full rounded-xl focus:outline-none focus:border-accent-500 focus:shadow-glow disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400'
        />
      </div>

      <div className='space-y-2'>
        <div className='flex items-center justify-between'>
          <label htmlFor='nationality'>Where are you from?</label>
          <img
            src={countryFlag}
            alt='Country flag'
            className='h-5 rounded-sm'
          />
        </div>
        {children}
      </div>

      <div className='space-y-2'>
        <label htmlFor='nationalID'>National ID number</label>
        <input
          defaultValue={nationalID}
          id='nationalID'
          name='nationalID'
          className='px-5 py-3 bg-primary-950 border border-primary-700 text-primary-100 placeholder:text-primary-500 w-full rounded-xl focus:outline-none focus:border-accent-500 focus:shadow-glow'
        />
      </div>

      <FormMessage error={state?.error} success={state?.success} />

      <div className='flex justify-end items-center gap-6'>
        <SubmitButton pendingLabel='Updating...'>Update Profile</SubmitButton>
      </div>
    </form>
  );
}

export default UpdateProfileForm;
