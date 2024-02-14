const PRICE_PER_ROOM = 10;
export type Period = 3 | 6 | 12;

function getPeriodDiscount(period: Period) {
  switch (period) {
    case 3:
      return 0;
    case 6:
      return 0.1;
    case 12:
      return 0.15;
  }
}

const EXTRAS_DISCOUNTS = [0.3, 0.2, 0.1];

function calculateExtrasPrice(subscription: number, extras: string[]) {
  let setup = 0;

  for (let i = 0; i < extras.length; i++) {
    const discountIndex = Math.floor(i / 3);
    const discount = EXTRAS_DISCOUNTS[discountIndex] || 0;
    setup += subscription * discount;
  }

  return Number(setup?.toFixed(2));
}

export function calculateTotalPrice(rooms: number, period: Period, extras: string[] = []) {
  let subscription = rooms * PRICE_PER_ROOM * period;
  let setup = calculateExtrasPrice(subscription, extras);

  const discount = getPeriodDiscount(period);
  let totalDiscount = 0;

  if (discount) {
    const subscriptionDiscount = subscription * discount;
    const setupDiscount = setup * discount;
    totalDiscount = subscriptionDiscount + setupDiscount;

    subscription -= subscriptionDiscount;
    setup -= setupDiscount;
  }

  return {
    subscription,
    setup,
    total: subscription + setup,
    totalDiscount,
  };
}
