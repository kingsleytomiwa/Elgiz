import { Period } from "utils/billing";
import CheckoutForm from "./CheckoutForm";

export default async function Page({
  searchParams
}: {
  searchParams: { period?: string; rooms?: string; extras?: string[]; };
}) {
  let rooms = searchParams.rooms && !isNaN(Number(searchParams.rooms)) ? +searchParams.rooms : undefined;
  let period = searchParams.period && ['3', '6', '12'].includes(searchParams.period) ? +searchParams.period : undefined;

  if (rooms && !isNaN(Number(rooms))) {
    rooms = +rooms;
  }

  return (
    <CheckoutForm
      rooms={rooms}
      period={period as Period}
      extras={searchParams.extras}
    />
  );
}

export const metadata = {
  title: 'Checkout'
};
