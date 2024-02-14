import { generateAvailableTimeSlots, getHHMMFromDate, getSettingsDate } from "utils";
import { Category } from "@prisma/client";
import { isToday } from "date-fns";
import prisma from "db";

export async function getAvailableTimeSlots(hotelId: string, date: Date, positionId: string) {
  const hotel = await prisma.hotel.findUnique({
    where: { id: hotelId },
    include: {
      parameters: true,
    },
  });
  const spaParameter = hotel?.parameters.find((p) => p.type === Category.SPA);

  const reserveStart = getSettingsDate(getHHMMFromDate(spaParameter?.spaOpeningTime!), date);
  const currentDate = new Date();

  if (isToday(reserveStart) && reserveStart.getHours() < currentDate.getHours()) {
    reserveStart.setHours(currentDate.getHours() + 2);
    reserveStart.setMinutes(0);
    reserveStart.setSeconds(0);
  }

  const reserveEnd = getSettingsDate(getHHMMFromDate(spaParameter?.spaClosingTime!), date);

  const [data, position] = await prisma.$transaction([
    prisma.request.findMany({
      select: {
        reserveEnd: true,
        reserveStart: true,
      },

      where: {
        section: Category.SPA,
        reserveStart: {
          gte: reserveStart,
        },
        reserveEnd: {
          lte: reserveEnd,
        },

        positionId,
        hotelId,
      },
    }),
    prisma.spaPosition.findFirst({
      where: { id: positionId, hotelId },
      select: {
        duration: true,
        _count: {
          select: { staff: true },
        },
        guestsLimit: true,
      },
    }),
  ]);

  return generateAvailableTimeSlots(
    data.map((d) => ({
      start: d.reserveStart!,
      end: d.reserveEnd!,
    })),
    reserveStart,
    reserveEnd,
    position?._count.staff || position?.guestsLimit!,
    position?.duration ? position?.duration / 60000 : 30
  );
}
