import { Parameter } from "@prisma/client";
import * as dateFns from "date-fns";

export * from "./constants";
export * from "./schemas";

// export const createEmotionCache = () => {
//   return createCache({ key: "css" });
// };

export const getPriceByParam = (param: Parameter, sum: number) => {
  const type = param?.deliveryType;
  let tax = 0;

  switch (type) {
    case "FIXED":
      tax = param.deliveryValue!;
      break;
    case "PERCENTAGE":
      tax = sum * (param.deliveryValue! / 100);
      break;
  }
  return {
    sum: Number((sum + tax).toFixed(2)),
    tax: Number(tax?.toFixed(2)),
  };
};

export function debounce<F extends (...args: Parameters<F>) => ReturnType<F>>(
  func: F,
  waitFor: number
): (...args: Parameters<F>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<F>): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitFor);
  };
}

export const getHHMMFromDate = (date: Date) => {
  // Get hours and minutes from the Date object
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Pad single-digit hours and minutes with leading zeros
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  // Concatenate hours and minutes with a colon separator
  const formattedTime = `${formattedHours}:${formattedMinutes}`;

  return formattedTime;
};

export const getDateFromHHMM = (timeString: string) => {
  // Split the time string into hours and minutes
  const [hours, minutes] = timeString.split(":").map(Number);

  // Create a new Date object with the current date and the extracted hours and minutes
  const currentDate = new Date();
  currentDate.setHours(hours);
  currentDate.setMinutes(minutes);

  return currentDate;
};

export const generateRandomHex = () =>
  "#" +
  Math.floor(Math.random() * 2 ** 24)
    .toString(16)
    .padStart(6, "0");

export const getTabsBorderRadius = (index: number, total: number) => {
  // last
  if (index === total - 1) {
    return "0px 100px 100px 0px";
  }

  // first
  if (index === 0) {
    return "100px 0px 0px 100px";
  }

  // in-between
  return "none";
};

export type Timeslot = {
  start: Date;
  end: Date;
};

export type TimeslotWithLabel = {
  label: string;
  value: [Date, Date];
};

export const generateAvailableTimeSlots = (
  bookedTimeFrames: Timeslot[],
  workStartTime: Date,
  workEndTime: Date,
  bookingsPerSlotCount = 1,
  intervalDuration = 30
) => {
  const result: TimeslotWithLabel[] = [];
  const current = new Date(workStartTime);
  const end = new Date(workEndTime);

  while (current < end) {
    const nextInterval = new Date(current.getTime() + intervalDuration * 60 * 1000);

    const bookings = bookedTimeFrames.filter((b) => isBooked(current, nextInterval, b));

    if (bookings.length < bookingsPerSlotCount) {
      result.push({
        label: `${formatTime(current)} - ${formatTime(nextInterval)}`,
        value: [new Date(current), nextInterval],
      });
    }

    current.setTime(nextInterval.getTime());
  }

  return result;
};

function isBooked(start: Date, end: Date, bookedInterval: Timeslot) {
  return (
    (start >= bookedInterval.start && start < bookedInterval.end) ||
    (end > bookedInterval.start && end <= bookedInterval.end)
  );
}

export function formatTime(date: Date) {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}
// Example usage:
// const bookedTimeFrames = [
// 	{ start: new Date('2023-01-01T08:00:00'), end: new Date('2023-01-01T12:00:00') },
// 	{ start: new Date('2023-01-01T14:00:00'), end: new Date('2023-01-01T18:00:00') }
// ];

// const workStartTime = '2023-01-01T10:00:00';
// const workEndTime = '2023-01-01T22:00:00';

// const availableTimeFrames = generateAvailableTimeFrames(bookedTimeFrames, workStartTime, workEndTime);
// console.log(availableTimeFrames);

export const getSettingsDate = (stringHours: string, date = new Date()) => {
  return new Date(date.setHours(Number(stringHours.slice(0, 2)), 0));
};

export const getDateTimeTogether = (time: Date, date: Date) => {
  return dateFns.setHours(date, new Date(time).getHours()).setMinutes(new Date(time).getMinutes());
};

// This function is normally used to see if the hotel
// can proceed with a transfer for the upcoming period
// PS: currently for any cycle (period: 3, 6, 12)
// hotel can pay for the transfer 45 days before the new cycle starts
export function isWithinDays(date: Date, days = 45) {
  const currentDate = new Date();
  const diffInDays = dateFns.differenceInDays(date, currentDate);
  return days >= diffInDays;
}

export function getCycleLabel(date: Date, period: number) {
  return `${dateFns.format(date, "dd MMMM yyyy")} - ${dateFns.format(
    dateFns.add(date, { months: period }),
    "dd MMMM yyyy"
  )}`;
}

export function formatTimeDifference(startDate: Date, endDate: Date): string {
  const diffInMilliseconds = dateFns.differenceInMilliseconds(endDate, startDate);

  const seconds = Math.floor((diffInMilliseconds / 1000) % 60);
  const minutes = Math.floor((diffInMilliseconds / (1000 * 60)) % 60);
  const hours = Math.floor((diffInMilliseconds / (1000 * 60 * 60)) % 24);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
}

export const displayNumber = (number: number) =>
  number.toLocaleString("de-DE", { minimumFractionDigits: 2 });
