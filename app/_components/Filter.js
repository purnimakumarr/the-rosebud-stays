'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';

function Filter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeFilter = searchParams.get('capacity');

  function handleFilter(filter) {
    const params = new URLSearchParams(searchParams);
    params.set('capacity', filter);

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }
  return (
    <div className='flex flex-wrap gap-2 w-full sm:w-auto'>
      <Button
        filter={'all'}
        activeFilter={activeFilter}
        handleFilter={handleFilter}
      >
        All rooms
      </Button>
      <Button
        filter={'small'}
        activeFilter={activeFilter}
        handleFilter={handleFilter}
      >
        1&mdash;3 guests
      </Button>
      <Button
        filter={'medium'}
        activeFilter={activeFilter}
        handleFilter={handleFilter}
      >
        4&mdash;7 guests
      </Button>
      <Button
        filter={'large'}
        activeFilter={activeFilter}
        handleFilter={handleFilter}
      >
        8&mdash;12 guests
      </Button>
    </div>
  );
}

function Button({ filter, activeFilter, handleFilter, children }) {
  return (
    <button
      className={`rounded-full border px-3 py-2 text-sm sm:px-5 sm:text-base grow sm:grow-0 basis-[calc(50%-0.25rem)] sm:basis-auto transition-all ${
        activeFilter === filter || (!activeFilter && filter === 'all')
          ? 'border-accent-500 bg-accent-500/15 text-accent-100 shadow-glow'
          : 'border-primary-700 text-primary-300 hover:border-accent-500/60 hover:text-accent-200'
      }`}
      onClick={() => handleFilter(filter)}
    >
      {children}
    </button>
  );
}

export default Filter;
