import { FoodPosition, Guest, Hotel, Module, ShopPosition, SpaPosition, SubModule, User } from "@prisma/client";
import { atom } from "jotai";
import {
  RequestPaymentPlaceType,
  RequestPaymentType,
  RequestServeType,
	TimeslotWithLabel,
} from "utils";
import { RequestWithHistory } from "utils/models";
import { SpaWorker } from "../../queries";

export type HotelWithModules = Hotel & {
  modules: Module[];
  subModules: SubModule[];
};

export type PositionType = "PREPARE_SAUNA" | "FOOD_ORDER" | "SHOP";

export const positionsAtom = atom<
  ((ShopPosition | SpaPosition | FoodPosition) & {
    count: number;
    type: PositionType;
  })[]
>([]);
export const spaTimeslotsAtom = atom<TimeslotWithLabel[]>([]);
export const dateAtom = atom<Date | null>(null);
export const guestAtom = atom<Guest | null>(null);
export const spaWorkerAtom = atom<SpaWorker | null>(null);
export const orderAtom = atom<{
  serveTime?: string;
  time?: Date;
  price?: number;
  tax?: {
    name: "%" | "EUR";
    value: number;
  }
  paymentPlace?: RequestPaymentPlaceType;
  paymentType?: RequestPaymentType;
} | null>({
  serveTime: RequestServeType.IMMEDIATELY,
  price: 0,
  paymentPlace: RequestPaymentPlaceType.ROOM,
  paymentType: RequestPaymentType.CASH,
});
export const orderPriceAtom = atom((get) => {
	const positions = get(positionsAtom);
	const timeslotsLength = get(spaTimeslotsAtom)?.length;
	
	// price for spa
	if (timeslotsLength && positions?.[0]) {
    return timeslotsLength * Number(positions[0].price?.toFixed(2));
  }
	
  return positions.reduce((acc, cur) => acc + cur.count * Number(cur.price?.toFixed(2)), 0);
});

export const requestAtom = atom<RequestWithHistory | null>(null);
