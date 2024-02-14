export const USER_SELECT = {
  id: true,
  email: true,
  name: true,
  image: true,
  position: true,
  hotelId: true,
};

export const GUEST_SELECT = {
  id: true,
  name: true,
  email: true,
  phone: true,
  code: true,
  startDate: true,
  endDate: true,
  room: true,
  suspended: true,

  _count: {
    select: {
      requests: true,
    },
  },
};
