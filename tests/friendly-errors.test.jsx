import { act, fireEvent, render, screen } from '@testing-library/react';
import { useFormState } from 'react-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import FormMessage from '@/app/_components/FormMessage';
import ReservationForm from '@/app/_components/ReservationForm';
import ReservationList from '@/app/_components/ReservationList';
import UpdateProfileForm from '@/app/_components/UpdateProfileForm';
import UpdateReservationForm from '@/app/_components/UpdateReservationForm';
import { ReservationProvider } from '@/app/_components/ReservationContext';
import { deleteBooking } from '@/app/_lib/actions';
import { rangeKey } from '@/app/_lib/booking-rules';
import { booking, cabin, guest } from './fixtures';

// useOptimistic ships in the React build bundled with Next.js, not in stock
// React 18; a pass-through is enough to exercise the list's error handling
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return { ...actual, useOptimistic: (state) => [state, () => {}] };
});

// Pretend the form's server action has just returned this result
function withActionResult(result) {
  useFormState.mockImplementation((action) => [result, action]);
}

beforeEach(() => {
  vi.clearAllMocks();
  useFormState.mockImplementation((action, initialState) => [initialState, action]);
  vi.spyOn(window, 'confirm').mockReturnValue(true);
});

describe('FormMessage', () => {
  it('renders nothing when there is nothing to say', () => {
    const { container } = render(<FormMessage />);
    expect(container).toBeEmptyDOMElement();
  });

  it('announces errors as alerts and successes as status updates', () => {
    const { rerender } = render(<FormMessage error='Please pick new dates.' />);
    expect(screen.getByRole('alert')).toHaveTextContent('Please pick new dates.');

    rerender(<FormMessage success='Your profile has been updated.' />);
    expect(screen.getByRole('status')).toHaveTextContent(
      'Your profile has been updated.',
    );
  });
});

describe('forms show what went wrong', () => {
  const renderBookingForm = () =>
    render(
      <ReservationProvider>
        <ReservationForm cabin={cabin} user={{ name: 'Alex Guest', image: '/a.jpg' }} />
      </ReservationProvider>,
    );

  it('booking form', () => {
    // No dates picked yet in this render, so the range key is empty
    withActionResult({
      error: 'Sorry, some of those nights were just booked.',
      rangeKey: rangeKey({}),
    });
    renderBookingForm();

    expect(screen.getByRole('alert')).toHaveTextContent(/just booked/);
  });

  it('booking form hides an error about dates the guest has since changed', () => {
    withActionResult({
      error: 'Sorry, some of those nights were just booked.',
      rangeKey: rangeKey({ from: new Date(2030, 0, 1), to: new Date(2030, 0, 5) }),
    });
    renderBookingForm();

    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('edit reservation form', () => {
    withActionResult({ error: 'This room sleeps between 1 and 4 guests.' });
    render(
      <UpdateReservationForm
        maxCapacity={4}
        bookingId='10'
        numGuests={2}
        observations=''
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent(/sleeps between 1 and 4/);
  });

  it('profile form, for both errors and a successful save', () => {
    withActionResult({ error: 'Your national ID should be 6 to 12 letters or numbers.' });
    const { unmount } = render(<UpdateProfileForm guest={guest} />);
    expect(screen.getByRole('alert')).toHaveTextContent(/national ID/);
    unmount();

    withActionResult({ success: 'Your profile has been updated.' });
    render(<UpdateProfileForm guest={guest} />);
    expect(screen.getByRole('status')).toHaveTextContent(/profile has been updated/);
  });

  it('shows no message before the guest has submitted', () => {
    render(<UpdateProfileForm guest={guest} />);
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.queryByRole('status')).toBeNull();
  });
});

describe('reservation list', () => {
  it('explains when a cancellation fails', async () => {
    deleteBooking.mockResolvedValue({
      error: "We couldn't cancel that reservation just now. Please try again in a moment.",
    });
    render(<ReservationList bookings={[booking]} />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    });

    expect(deleteBooking).toHaveBeenCalledWith(booking.id);
    expect(await screen.findByRole('alert')).toHaveTextContent(
      /couldn't cancel that reservation/,
    );
  });
});
