import { fireEvent, render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { notFound } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import RoomList from '@/app/_components/RoomList';
import TextExpander from '@/app/_components/TextExpander';
import ReservationCard from '@/app/_components/ReservationCard';
import ReservationReminder from '@/app/_components/ReservationReminder';
import EditReservationPage from '@/app/account/reservations/edit/[bookingId]/page';
import NotFound from '@/app/not-found';
import UpdateProfileForm from '@/app/_components/UpdateProfileForm';
import UpdateReservationForm from '@/app/_components/UpdateReservationForm';
import SelectCountry from '@/app/_components/SelectCountry';
import RoomNotFound from '@/app/rooms/[roomId]/not-found';
import { ReservationProvider, useReservation } from '@/app/_components/ReservationContext';
import { auth } from '@/app/_lib/auth';
import { getBooking, getCabins } from '@/app/_lib/data-service';
import { canChangeBooking, rangeKey } from '@/app/_lib/booking-rules';
import { useEffect } from 'react';
import { booking, cabin, guest } from './fixtures';

const root = path.dirname(fileURLToPath(import.meta.url));

const rooms = [
  { ...cabin, id: 1, name: '001', maxCapacity: 2 },
  { ...cabin, id: 2, name: '002', maxCapacity: 6 },
];

beforeEach(() => {
  vi.clearAllMocks();
  getCabins.mockResolvedValue(rooms);
  notFound.mockImplementation(() => {
    throw new Error('NEXT_NOT_FOUND');
  });
});

describe('room filter', () => {
  it('shows every room for an unknown filter instead of crashing', async () => {
    render(await RoomList({ filter: 'xl' }));

    expect(screen.getByText('Room 001')).toBeInTheDocument();
    expect(screen.getByText('Room 002')).toBeInTheDocument();
  });

  it('explains when no room fits the chosen group size', async () => {
    render(await RoomList({ filter: 'large' }));

    expect(screen.getByText(/no rooms fit that group size/i)).toBeInTheDocument();
  });

  it('still filters by capacity', async () => {
    render(await RoomList({ filter: 'medium' }));

    expect(screen.queryByText('Room 001')).toBeNull();
    expect(screen.getByText('Room 002')).toBeInTheDocument();
  });
});

describe('changing a stay', () => {
  const now = new Date('2030-06-01T12:00:00Z');

  it('is allowed only before it starts', () => {
    expect(canChangeBooking({ startDate: '2030-06-02T00:00:00Z' }, now)).toBe(true);
    expect(canChangeBooking({ startDate: '2030-06-01T00:00:00Z' }, now)).toBe(false);
    expect(canChangeBooking({ startDate: '2030-05-20T00:00:00Z' }, now)).toBe(false);
  });

  it('hides edit and cancel on a past reservation card', () => {
    render(<ReservationCard booking={{ ...booking, startDate: '2020-01-01' }} />);

    expect(screen.queryByRole('link', { name: /edit/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /delete/i })).toBeNull();
  });

  it('shows an explanation instead of the form on the edit page', async () => {
    auth.mockResolvedValue({ user: { guestId: 1 } });
    getBooking.mockResolvedValue({ ...booking, guestId: 1, startDate: '2020-01-01' });

    render(await EditReservationPage({ params: { bookingId: '10' } }));

    expect(screen.getByRole('alert')).toHaveTextContent(/already started/);
    expect(screen.queryByRole('button', { name: /update reservation/i })).toBeNull();
  });
});

describe('range keys', () => {
  it('match for the same dates and differ when the dates change', () => {
    const a = { from: new Date(2030, 0, 1), to: new Date(2030, 0, 5) };

    expect(rangeKey(a)).toBe(rangeKey({ ...a }));
    expect(rangeKey(a)).not.toBe(rangeKey({ ...a, to: new Date(2030, 0, 6) }));
    expect(rangeKey({})).toBe('-');
  });
});

describe('room description', () => {
  it('shows a short description in full, without a "Show more" button', () => {
    render(<TextExpander>A cozy room by the ice machine.</TextExpander>);

    expect(screen.getByText('A cozy room by the ice machine.')).toBeInTheDocument();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('trims a long description and expands it on request', () => {
    const long = Array.from({ length: 60 }, (_, i) => `word${i}`).join(' ');
    render(<TextExpander>{long}</TextExpander>);

    const button = screen.getByRole('button', { name: /show more/i });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText(/word59/)).toBeNull();

    fireEvent.click(button);
    expect(screen.getByText(/word59/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show less/i })).toBeInTheDocument();
  });

  it('copes with a room that has no description', () => {
    expect(() => render(<TextExpander>{null}</TextExpander>)).not.toThrow();
  });
});

describe('date reminder', () => {
  function PickDates() {
    const { setRange } = useReservation();
    useEffect(() => {
      setRange({ from: new Date(2030, 0, 1), to: new Date(2030, 0, 5) });
    }, [setRange]);
    return null;
  }

  it('has a dismiss button screen readers can name, and it clears the dates', async () => {
    render(
      <ReservationProvider>
        <PickDates />
        <ReservationReminder />
      </ReservationProvider>,
    );

    fireEvent.click(await screen.findByRole('button', { name: /dismiss reminder/i }));
    expect(screen.queryByText(/forget to reserve/i)).toBeNull();
  });
});

describe('not-found pages', () => {
  it.each([
    ['site', NotFound],
    ['room', RoomNotFound],
  ])('the %s page adds no second <main> landmark', (_name, Page) => {
    const { container } = render(<Page />);

    expect(container.querySelector('main')).toBeNull();
    expect(screen.getByRole('heading', { level: 1 })).not.toHaveClass('font-semibold');
  });
});

describe('form labels', () => {
  it('every profile field can be found by its label', async () => {
    render(
      <UpdateProfileForm guest={guest}>
        {await SelectCountry({
          name: 'nationality',
          id: 'nationality',
          defaultCountry: 'Canada',
        })}
      </UpdateProfileForm>,
    );

    expect(screen.getByLabelText('Full name')).toHaveValue(guest.fullName);
    expect(screen.getByLabelText('Email address')).toHaveValue(guest.email);
    expect(screen.getByLabelText('Where are you from?')).toHaveValue('Canada');
    expect(screen.getByLabelText('National ID number')).toHaveValue(guest.nationalID);
  });

  it('the edit reservation notes field can be found by its label', () => {
    render(
      <UpdateReservationForm
        maxCapacity={4}
        bookingId='10'
        numGuests={2}
        observations='Late arrival'
      />,
    );

    expect(screen.getByLabelText(/anything we should know/i)).toHaveValue('Late arrival');
    expect(screen.getByLabelText(/how many guests/i)).toHaveValue('2');
  });
});

describe('country picker', () => {
  it('submits only the country name, with nothing selected for a new guest', async () => {
    const { container } = render(
      await SelectCountry({ name: 'nationality', id: 'nationality', defaultCountry: null }),
    );
    const select = container.querySelector('select');

    expect(select).toHaveValue('');
    expect([...select.options].map((o) => o.value)).toEqual(['', 'Canada', 'India']);
  });
});

describe('leftovers', () => {
  it.each([
    'app/_components/Counter.js',
    'app/_components/Price.js',
    'app/api/rooms/[roomId]/route.js',
  ])('%s is gone', (file) => {
    expect(() => readFileSync(path.join(root, '..', file))).toThrow();
  });

  it('data-service no longer has an unchecked createBooking', () => {
    const source = readFileSync(path.join(root, '../app/_lib/data-service.js'), 'utf8');

    expect(source).not.toMatch(/export async function createBooking/);
    expect(source).not.toMatch(/getCabinPrice/);
  });
});
