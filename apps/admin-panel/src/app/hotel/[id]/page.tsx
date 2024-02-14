import { cache } from "react";
import HotelStatistics from "./HotelStatistics";
import { getHotel as _getHotel } from "db";

export const metadata = {
  title: "Hotel details",
};

const getHotel = cache(_getHotel);

export default async function HotelDetails({ params }: { params: { id: string; }; }) {
  const hotel = await getHotel(params.id);
  return <HotelStatistics hotel={hotel!} />;
}
