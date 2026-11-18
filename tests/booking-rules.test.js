import { addDays, startOfDay } from 'date-fns';
import { describe, expect, it } from 'vitest';
import {
  cleanObservations,
  isRangeBooked,
  priceStay,
  validateGuestCount,
} from '@/app/_lib/booking-rules';
import { cabin } from './fixtures';

const now = new Date('2030-01-01T12:00:00Z');
const day = (n) => addDays(startOfDay(now), n);
const settings = { minBookingLength: 3, maxBookingLength: 30 };

describe('isRangeBooked', () => {
  it('is false until both ends of the range are picked', () => {
    expect(isRangeBooked({ from: day(5) }, [day(5)])).toBe(false);
    expect(isRangeBooked({}, [day(5)])).toBe(false);
  });

  it('spots a booked day anywhere in the range, including the ends', () => {
    const range = { from: day(5), to: day(9) };

    expect(isRangeBooked(range, [day(7)])).toBe(true);
    expect(isRangeBooked(range, [day(9)])).toBe(true);
    expect(isRangeBooked(range, [day(4), day(10)])).toBe(false);
  });
});

describe('validateGuestCount', () => {
  it('accepts whole numbers from 1 up to the room capacity', () => {
    expect(validateGuestCount('1', 4)).toBe(1);
    expect(validateGuestCount('4', 4)).toBe(4);
  });

  it.each(['0', '5', '2.5', '', null, 'abc'])('rejects %j', (value) => {
    expect(() => validateGuestCount(value, 4)).toThrow(/sleeps between 1 and 4 guests/);
  });
});

describe('cleanObservations', () => {
  it('copes with a missing field and caps the length', () => {
    expect(cleanObservations(null)).toBe('');
    expect(cleanObservations('x'.repeat(2000))).toHaveLength(1000);
  });
});

describe('priceStay', () => {
  const stay = (from, to, bookedDates = []) =>
    priceStay({
      startDate: day(from),
      endDate: day(to),
      cabin,
      settings,
      bookedDates,
      now,
    });

  it('prices the stay from the room rate minus the discount', () => {
    const result = stay(10, 14);

    expect(result.numNights).toBe(4);
    expect(result.cabinPrice).toBe(4 * (cabin.regularPrice - cabin.discount));
  });

  it('accepts dates sent as strings, the way they cross the network', () => {
    const result = priceStay({
      startDate: day(10).toISOString(),
      endDate: day(13).toISOString(),
      cabin,
      settings,
      bookedDates: [],
      now,
    });

    expect(result.numNights).toBe(3);
  });

  it('rejects stays that are too short or too long', () => {
    expect(() => stay(10, 12)).toThrow(/3 to 30 nights long/);
    expect(() => stay(10, 41)).toThrow(/3 to 30 nights long/);
  });

  it('rejects stays that start in the past', () => {
    expect(() => stay(-5, 0)).toThrow(/future date/);
  });

  it('rejects stays that overlap an existing booking', () => {
    expect(() => stay(10, 14, [day(12)])).toThrow(/just booked by another guest/);
  });

  it('rejects missing or invalid dates', () => {
    expect(() =>
      priceStay({
        startDate: undefined,
        endDate: 'not a date',
        cabin,
        settings,
        bookedDates: [],
        now,
      }),
    ).toThrow(/check-in and check-out dates/);
  });
});
