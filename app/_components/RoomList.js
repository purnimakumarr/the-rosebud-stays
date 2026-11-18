import RoomCard from '@/app/_components/RoomCard';
import { getCabins } from '../_lib/data-service';

const CAPACITY_FILTERS = {
  all: () => true,
  small: (capacity) => capacity <= 3,
  medium: (capacity) => capacity >= 4 && capacity <= 7,
  large: (capacity) => capacity >= 8,
};

async function RoomList({ filter }) {
  const cabins = await getCabins();

  if (!cabins.length) return null;

  // Unknown values (an old link, a typo in the URL) show every room
  const matchesFilter = CAPACITY_FILTERS[filter] ?? CAPACITY_FILTERS.all;
  const displayedCabins = cabins.filter((cabin) =>
    matchesFilter(cabin.maxCapacity),
  );

  if (!displayedCabins.length)
    return (
      <p className='rounded-2xl border border-primary-800 bg-primary-900/50 px-5 py-8 text-center text-primary-300'>
        No rooms fit that group size right now. Try another filter, or ask the
        front desk about booking adjoining rooms.
      </p>
    );

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'>
      {displayedCabins.map((cabin) => (
        <RoomCard cabin={cabin} key={cabin.id} />
      ))}
    </div>
  );
}

export default RoomList;
