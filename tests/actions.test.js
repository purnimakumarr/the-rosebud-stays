import { addDays, startOfDay } from 'date-fns';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { auth } from '@/app/_lib/auth';
import { supabase } from '@/app/_lib/supabase';
import {
  getBookedDatesByCabinId,
  getBookings,
  getCabin,
  getSettings,
} from '@/app/_lib/data-service';
import {
  createBooking,
  deleteBooking,
  updateBooking,
  updateGuest,
} from '@/app/_lib/actions';
import { booking, cabin } from './fixtures';

// The shared setup replaces the actions with stubs; these tests need the real ones
vi.unmock('@/app/_lib/actions');

vi.mock('@/app/_lib/supabase', () => ({ supabase: { from: vi.fn() } }));

const day = (n) => addDays(startOfDay(new Date()), n);

function form(fields) {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
}

// A stand-in for the Supabase table API that records what was written
function mockTable() {
  const eq = vi.fn(async () => ({ error: null }));
  const table = {
    insert: vi.fn(async () => ({ error: null })),
    update: vi.fn(() => ({ eq })),
    delete: vi.fn(() => ({ eq })),
    eq,
  };
  supabase.from.mockReturnValue(table);
  return table;
}

let table;

beforeEach(() => {
  vi.clearAllMocks();
  table = mockTable();
  auth.mockResolvedValue({ user: { guestId: 1, email: 'alex@example.com' } });
  getCabin.mockResolvedValue(cabin);
  getSettings.mockResolvedValue({ minBookingLength: 3, maxBookingLength: 30 });
  getBookedDatesByCabinId.mockResolvedValue([]);
  getBookings.mockResolvedValue([{ ...booking, id: 10, cabinId: cabin.id }]);
});

describe('createBooking', () => {
  const request = (overrides = {}) => ({
    cabinId: cabin.id,
    startDate: day(10),
    endDate: day(14),
    ...overrides,
  });

  it('prices the stay on the server and ignores any price the browser sends', async () => {
    await createBooking(
      // Extra fields a tampered request might add
      { ...request(), cabinPrice: 0, totalPrice: 0, numNights: 1 },
      form({ numGuests: '2', observations: 'Late arrival' }),
    );

    const [[saved]] = table.insert.mock.calls[0];
    const expected = 4 * (cabin.regularPrice - cabin.discount);

    expect(saved.numNights).toBe(4);
    expect(saved.cabinPrice).toBe(expected);
    expect(saved.totalPrice).toBe(expected);
    expect(saved.guestId).toBe(1);
    expect(saved.status).toBe('unconfirmed');
  });

  it('refuses dates that overlap an existing booking', async () => {
    getBookedDatesByCabinId.mockResolvedValue([day(12)]);

    const result = await createBooking(request(), form({ numGuests: '2' }));

    expect(result.error).toMatch(/just booked by another guest/);
    expect(table.insert).not.toHaveBeenCalled();
  });

  it('refuses more guests than the room holds', async () => {
    const result = await createBooking(
      request(),
      form({ numGuests: String(cabin.maxCapacity + 1) }),
    );

    expect(result.error).toMatch(/sleeps between 1 and 4 guests/);
    expect(table.insert).not.toHaveBeenCalled();
  });

  it('refuses stays shorter than the minimum', async () => {
    const result = await createBooking(
      request({ endDate: day(11) }),
      form({ numGuests: '2' }),
    );

    expect(result.error).toMatch(/3 to 30 nights long, and you picked 1/);
    expect(table.insert).not.toHaveBeenCalled();
  });

  it('requires a signed-in guest', async () => {
    auth.mockResolvedValue(null);

    const result = await createBooking(request(), form({ numGuests: '2' }));

    expect(result.error).toBe('Please sign in to continue.');
    expect(table.insert).not.toHaveBeenCalled();
  });
});

describe('updateBooking', () => {
  it('updates a booking the guest owns', async () => {
    await updateBooking(10, form({ numGuests: '3', observations: 'Crib please' }));

    expect(table.update).toHaveBeenCalledWith({
      numGuests: 3,
      observations: 'Crib please',
    });
    expect(table.eq).toHaveBeenCalledWith('id', 10);
  });

  it("refuses to touch another guest's booking", async () => {
    const result = await updateBooking(99, form({ numGuests: '2', observations: '' }));

    expect(result.error).toMatch(/couldn't find that reservation/);
    expect(table.update).not.toHaveBeenCalled();
  });

  it('refuses more guests than the room holds', async () => {
    const result = await updateBooking(10, form({ numGuests: '50', observations: '' }));

    expect(result.error).toMatch(/sleeps between 1 and/);
    expect(table.update).not.toHaveBeenCalled();
  });

  it('copes with a request that leaves out the notes field', async () => {
    await updateBooking(10, form({ numGuests: '2' }));

    expect(table.update).toHaveBeenCalledWith({ numGuests: 2, observations: '' });
  });
});

describe('deleteBooking', () => {
  it("refuses to delete another guest's booking", async () => {
    const result = await deleteBooking(99);

    expect(result.error).toMatch(/couldn't find that reservation/);
    expect(table.delete).not.toHaveBeenCalled();
  });

  it('deletes a booking the guest owns', async () => {
    await deleteBooking(10);

    expect(table.delete).toHaveBeenCalled();
    expect(table.eq).toHaveBeenCalledWith('id', 10);
  });
});

describe('updateGuest', () => {
  it('rejects an invalid national ID', async () => {
    const result = await updateGuest(
      form({ nationalID: 'no!', nationality: 'Canada' }),
    );

    expect(result.error).toMatch(/6 to 12 letters or numbers/);
    expect(table.update).not.toHaveBeenCalled();
  });

  it('asks for a country when "Select country..." is left selected', async () => {
    const result = await updateGuest(form({ nationalID: 'ABC123', nationality: '' }));

    expect(result.error).toMatch(/choose the country you're from/);
    expect(table.update).not.toHaveBeenCalled();
  });

  it('rejects a country that is not on the list', async () => {
    const result = await updateGuest(
      form({ nationalID: 'ABC123', nationality: 'Atlantis' }),
    );

    expect(result.error).toMatch(/don't recognise that country/);
    expect(table.update).not.toHaveBeenCalled();
  });

  it("saves the flag from the country list, never a URL sent by the form", async () => {
    const result = await updateGuest(
      form({
        nationalID: 'ABC123',
        // A crafted request trying to smuggle in its own image URL
        nationality: 'Canada%https://evil.example/x.png',
      }),
    );
    expect(result.error).toMatch(/don't recognise that country/);

    await updateGuest(form({ nationalID: 'ABC123', nationality: 'India' }));
    expect(table.update).toHaveBeenCalledWith({
      nationality: 'India',
      countryFlag: 'https://flags.example/in.png',
      nationalID: 'ABC123',
    });
  });

  it("only updates the signed-in guest's own profile and confirms it", async () => {
    const result = await updateGuest(
      form({ nationalID: 'ABC123', nationality: 'Canada' }),
    );

    expect(result).toEqual({ success: 'Your profile has been updated.' });
    expect(table.update).toHaveBeenCalledWith({
      nationality: 'Canada',
      countryFlag: 'https://flags.example/ca.svg',
      nationalID: 'ABC123',
    });
    expect(table.eq).toHaveBeenCalledWith('id', 1);
  });
});

describe('unexpected failures', () => {
  it('show a polite generic message and keep database details out of the page', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    table.insert.mockResolvedValue({
      error: { message: 'duplicate key value violates unique constraint "bookings_pkey"' },
    });

    const result = await createBooking(
      { cabinId: cabin.id, startDate: day(10), endDate: day(14) },
      form({ numGuests: '2' }),
    );

    expect(result.error).toBe(
      "We couldn't save your reservation just now. Please try again in a moment.",
    );
    expect(result.error).not.toMatch(/duplicate key/);
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('cover a failed cancellation too', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    table.eq.mockResolvedValue({ error: { message: 'connection reset' } });

    const result = await deleteBooking(10);

    expect(result.error).toMatch(/couldn't cancel that reservation/);
    consoleError.mockRestore();
  });
});

describe('stays that have already started', () => {
  beforeEach(() => {
    getBookings.mockResolvedValue([
      { ...booking, id: 10, cabinId: cabin.id, startDate: day(-2).toISOString() },
    ]);
  });

  it('cannot be edited online', async () => {
    const result = await updateBooking(10, form({ numGuests: '2' }));

    expect(result.error).toMatch(/already started/);
    expect(table.update).not.toHaveBeenCalled();
  });

  it('cannot be cancelled online', async () => {
    const result = await deleteBooking(10);

    expect(result.error).toMatch(/already started/);
    expect(table.delete).not.toHaveBeenCalled();
  });
});

describe('the database overlap guard', () => {
  it('turns a clash between simultaneous bookings into the friendly message', async () => {
    // What Postgres returns when the bookings_no_overlap constraint fires
    table.insert.mockResolvedValue({
      error: { code: '23P01', message: 'conflicting key value violates exclusion constraint' },
    });

    const result = await createBooking(
      { cabinId: cabin.id, startDate: day(10), endDate: day(14) },
      form({ numGuests: '2' }),
    );

    expect(result.error).toMatch(/just booked by another guest/);
    expect(result.error).not.toMatch(/exclusion constraint/);
  });
});
