import { auth } from '../_lib/auth';

export const metadata = {
  title: 'Guest Area',
};

async function Page() {
  const session = await auth();
  const firstName = session?.user?.name?.split(' ').at(0);

  return (
    <h2 className='text-3xl uppercase text-accent-300 mb-7'>
      Welcome, {firstName}
    </h2>
  );
}

export default Page;
