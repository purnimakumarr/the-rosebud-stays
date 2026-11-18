import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Room from '@/app/_components/Room';
import RoomList from '@/app/_components/RoomList';
import DateSelector from '@/app/_components/DateSelector';
import Filter from '@/app/_components/Filter';
import LoginMessage from '@/app/_components/LoginMessage';
import Reservation from '@/app/_components/Reservation';
import ReservationForm from '@/app/_components/ReservationForm';
import { ReservationProvider } from '@/app/_components/ReservationContext';
import RoomsPage from '@/app/rooms/page';
import RoomDetailPage from '@/app/rooms/[roomId]/page';
import { tokens } from './class-names';
import { findElements } from './element-tree';
import { cabin } from './fixtures';
import { setViewport } from './viewport';

const root = path.dirname(fileURLToPath(import.meta.url));

function renderSelector() {
  return render(
    <ReservationProvider>
      <DateSelector
        settings={{ minBookingLength: 3, maxBookingLength: 30 }}
        bookedDates={[]}
        cabin={{ regularPrice: 250, discount: 50 }}
      />
    </ReservationProvider>,
  );
}

describe('rooms page', () => {
  it('uses a smaller heading and a filter that can wrap to two columns on phones', () => {
    const page = RoomsPage({ searchParams: { capacity: 'all' } });
    const heading = findElements(page, (node) => node.type === 'h1')[0];
    const intro = findElements(page, (node) => node.type === 'p')[0];

    expect(tokens(heading)).toContain('text-3xl');
    expect(tokens(heading)).toContain('sm:text-4xl');
    expect(tokens(heading)).not.toContain('text-4xl');
    expect(tokens(intro)).toContain('text-base');
    expect(tokens(intro)).toContain('sm:text-lg');
    expect(tokens(intro)).not.toContain('text-lg');

    render(<Filter />);
    const filter = screen.getByRole('button', { name: /all rooms/i }).parentElement;
    const button = screen.getByRole('button', { name: /8—12 guests/i });

    expect(tokens(filter)).toEqual(
      expect.arrayContaining(['flex', 'flex-wrap', 'w-full', 'sm:w-auto']),
    );
    expect(tokens(button)).toEqual(
      expect.arrayContaining([
        'basis-[calc(50%-0.25rem)]',
        'sm:basis-auto',
        'text-sm',
        'sm:text-base',
        'px-3',
        'sm:px-5',
      ]),
    );
    expect(tokens(button)).not.toContain('px-5');
  });

  it('shows one room card per row on phones, two on tablets and three on laptops', async () => {
    const { container } = render(await RoomList({ filter: 'all' }));
    const grid = container.firstElementChild;
    const card = grid.firstElementChild;

    expect(tokens(grid)).toContain('grid-cols-1');
    expect(tokens(grid)).toContain('sm:grid-cols-2');
    expect(tokens(grid)).toContain('lg:grid-cols-3');
    expect(tokens(grid)).not.toContain('grid-cols-2');
    expect(tokens(card)).toContain('flex-col');
    expect(tokens(card)).not.toContain('flex-row');
    expect(card).toHaveAttribute('href', `/rooms/${cabin.id}`);

    const photo = card.querySelector('img');
    expect(tokens(photo.parentElement)).toContain('h-56');
    expect(tokens(photo.parentElement)).toContain('sm:h-52');
    expect(tokens(screen.getByText('$200').parentElement)).toContain('flex-wrap');
  });
});

describe('room detail', () => {
  it('shows a photo banner, then stacks the description and features until large screens', () => {
    const { container } = render(<Room cabin={cabin} />);
    const article = container.firstElementChild;
    const [banner, details] = article.children;
    const heading = screen.getByRole('heading', { name: /room 001/i });

    expect(tokens(banner)).toContain('h-64');
    expect(tokens(banner)).toContain('sm:h-80');
    expect(tokens(banner)).toContain('lg:h-[28rem]');
    expect(tokens(banner)).not.toContain('h-[28rem]');
    expect(heading.parentElement).toBe(banner);

    expect(tokens(heading)).toContain('text-5xl');
    expect(tokens(heading)).toContain('xl:text-8xl');
    expect(tokens(heading)).not.toContain('text-8xl');

    expect(tokens(details)).toContain('grid-cols-1');
    expect(tokens(details)).toContain('lg:grid-cols-[3fr_2fr]');
    expect(tokens(details)).not.toContain('grid-cols-[3fr_2fr]');
  });

  it('shrinks the reservation heading on phones', async () => {
    const page = await RoomDetailPage({ params: { roomId: '1' } });
    const heading = findElements(page, (node) => node.type === 'h2')[0];

    expect(tokens(heading)).toContain('text-3xl');
    expect(tokens(heading)).toContain('sm:text-4xl');
    expect(tokens(heading)).toContain('lg:text-5xl');
    expect(tokens(heading)).not.toContain('text-5xl');
  });

  it('places the calendar and the booking form in one column until laptop width', async () => {
    const { container } = render(
      <ReservationProvider>{await Reservation({ cabin })}</ReservationProvider>,
    );

    expect(tokens(container.firstElementChild)).toContain('grid-cols-1');
    expect(tokens(container.firstElementChild)).toContain('xl:grid-cols-2');
    expect(tokens(container.firstElementChild)).not.toContain('grid-cols-2');
  });

  it('shows one calendar month on a phone and two months from tablet width up', () => {
    setViewport(390);
    const phone = renderSelector();
    expect(screen.getByTestId('day-picker')).toHaveAttribute('data-months', '1');
    phone.unmount();

    setViewport(768);
    const tablet = renderSelector();
    expect(screen.getByTestId('day-picker')).toHaveAttribute('data-months', '2');
    tablet.unmount();

    setViewport(1280);
    renderSelector();
    expect(screen.getByTestId('day-picker')).toHaveAttribute('data-months', '2');
  });

  it('lets the nightly price wrap instead of clipping it to one fixed row', () => {
    setViewport(390);
    renderSelector();
    const nightly = screen.getByText('/night');
    const priceRow = nightly.closest('div');
    const summary = priceRow.parentElement;

    expect(tokens(summary)).toContain('flex-col');
    expect(tokens(summary)).toContain('sm:flex-row');
    expect(tokens(summary)).toContain('sm:h-[72px]');
    expect(tokens(summary)).not.toContain('h-[72px]');
    expect(tokens(priceRow)).toContain('flex-wrap');
    expect(tokens(screen.getByTestId('day-picker').parentElement)).toContain(
      'overflow-x-auto',
    );
    expect(tokens(screen.getByTestId('day-picker'))).toContain('max-w-full');
  });

  it('sizes the day cells for touch and shrinks them so one month fits on a narrow phone', () => {
    const css = readFileSync(path.join(root, '../app/_styles/globals.css'), 'utf8');

    expect(css).toMatch(/max-width:\s*100%/);
    expect(css).toMatch(/--rdp-day-width:\s*40px/);
    expect(css).toMatch(
      /@media\s*\(\s*max-width:\s*400px\s*\)\s*\{\s*\.rdp-root\s*\{\s*--rdp-day-width:\s*36px/,
    );
    expect(css).toMatch(
      /@media\s*\(\s*max-width:\s*340px\s*\)\s*\{\s*\.rdp-root\s*\{\s*--rdp-day-width:\s*32px/,
    );
  });

  it('pads the signed-out reservation message on a phone', () => {
    render(<LoginMessage />);
    const message = screen.getByText(/to reserve this/i);

    expect(tokens(message.parentElement)).toContain('px-4');
    expect(tokens(message)).toContain('text-lg');
    expect(tokens(message)).toContain('sm:text-xl');
    expect(tokens(message)).not.toContain('text-xl');
  });

  it('reduces the booking form padding and stacks the guest header on phones', () => {
    const { container } = render(
      <ReservationProvider>
        <ReservationForm
          cabin={cabin}
          user={{ name: 'Alex Guest', image: '/guest.jpg' }}
        />
      </ReservationProvider>,
    );
    const form = container.querySelector('form');
    const signedIn = screen.getByText(/logged in as/i).parentElement;

    expect(tokens(form)).toContain('px-4');
    expect(tokens(form)).toContain('sm:px-8');
    expect(tokens(form)).toContain('lg:px-16');
    expect(tokens(form)).not.toContain('px-16');
    expect(tokens(form)).toContain('text-base');
    expect(tokens(form)).toContain('sm:text-lg');

    expect(tokens(signedIn)).toContain('flex-col');
    expect(tokens(signedIn)).toContain('sm:flex-row');
    expect(tokens(signedIn)).toContain('px-4');
    expect(tokens(signedIn)).toContain('lg:px-16');
    expect(tokens(signedIn)).not.toContain('px-16');
  });
});
