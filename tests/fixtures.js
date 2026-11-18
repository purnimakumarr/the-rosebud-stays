export const cabin = {
  id: 1,
  name: '001',
  maxCapacity: 4,
  regularPrice: 250,
  discount: 50,
  image: '/room.jpg',
  description:
    'A cozy motel room with two queen beds, floral spreads, a coffee maker, and the shortest walk to the ice machine.',
};

export const booking = {
  id: 10,
  guestId: 1,
  startDate: '2030-06-01',
  endDate: '2030-06-06',
  numNights: 5,
  totalPrice: 1000,
  numGuests: 2,
  status: 'unconfirmed',
  created_at: '2026-01-01T10:00:00.000Z',
  cabins: { name: '001', image: '/room.jpg' },
};

export const guest = {
  fullName: 'Alex Guest',
  email: 'alex@example.com',
  nationality: 'Canada',
  nationalID: 'ABC123',
  countryFlag: '/flag.png',
};
