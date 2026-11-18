import { notFound } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import EditReservationPage from '@/app/account/reservations/edit/[bookingId]/page';
import { auth } from '@/app/_lib/auth';
import { getBooking } from '@/app/_lib/data-service';
import { config as middlewareConfig } from '@/middleware';
import { booking } from './fixtures';

vi.mock('next-auth', () => ({ default: () => ({ auth: vi.fn() }) }));
vi.mock('next-auth/providers/google', () => ({ default: () => ({}) }));

beforeEach(() => {
  vi.clearAllMocks();
  // Like the real notFound(), stop rendering at that point
  notFound.mockImplementation(() => {
    throw new Error('NEXT_NOT_FOUND');
  });
  getBooking.mockResolvedValue({ ...booking, guestId: 1, observations: 'Private note' });
});

describe('edit reservation page', () => {
  it('shows the booking to the guest who owns it', async () => {
    auth.mockResolvedValue({ user: { guestId: 1 } });

    const page = await EditReservationPage({ params: { bookingId: '10' } });

    expect(page.props.children[1].props.observations).toBe('Private note');
  });

  it("responds as not found for another guest's booking", async () => {
    auth.mockResolvedValue({ user: { guestId: 2 } });

    await expect(
      EditReservationPage({ params: { bookingId: '10' } }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
  });

  it('responds as not found when nobody is signed in', async () => {
    auth.mockResolvedValue(null);

    await expect(
      EditReservationPage({ params: { bookingId: '10' } }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
    expect(getBooking).not.toHaveBeenCalled();
  });
});

describe('middleware', () => {
  it('guards every page under /account, not just /account itself', () => {
    expect(middlewareConfig.matcher).toEqual(['/account/:path*']);
  });
});
