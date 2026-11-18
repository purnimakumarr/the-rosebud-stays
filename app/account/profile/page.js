import SelectCountry from '@/app/_components/SelectCountry';
import UpdateProfileForm from '@/app/_components/UpdateProfileForm';
import { getGuest } from '@/app/_lib/data-service';
import { auth } from '@/app/_lib/auth';

export const metadata = {
  title: 'Update Profile',
};

export default async function Page() {
  const session = await auth();
  const guest = await getGuest(session.user.email);

  return (
    <div>
      <h2 className='text-3xl uppercase text-accent-300 mb-4'>
        Update your guest profile
      </h2>

      <p className='text-lg mb-8 text-primary-200'>
        Providing the following information will make your check-in process
        faster and smoother. See you soon!
      </p>

      <UpdateProfileForm guest={guest}>
        <SelectCountry
          name='nationality'
          id='nationality'
          className='px-5 py-3 bg-primary-950 border border-primary-700 text-primary-100 placeholder:text-primary-500 w-full rounded-xl focus:outline-none focus:border-accent-500 focus:shadow-glow'
          defaultCountry={guest.nationality}
        />
      </UpdateProfileForm>
    </div>
  );
}
