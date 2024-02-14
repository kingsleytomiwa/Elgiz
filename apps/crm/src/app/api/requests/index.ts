import { parseQuery } from "backend-utils";
import prisma from "db";
import { Category, Prisma, RequestStatus, RequestType } from "@prisma/client";
import { Session } from "next-auth";
import { addDays } from "date-fns";
import { cache } from "react";

export const getRequests = cache((where: Prisma.RequestWhereInput, take: number, page: number) => {
  return prisma.$transaction([
    prisma.request.findMany({
      include: {
        worker: { select: { name: true, color: true } },
        guest: { select: { name: true, room: true } },
        history: { include: { staff: { select: { name: true } } } },
      },
      where,
      take: take,
      skip: page * take,
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.request.count({
      where,
    }),
  ]);
});

export type TableRequest = Awaited<ReturnType<typeof getRequests>>[0][0];

export function getRequestsArgs(query: any, user: Session) {
  const {
    startDate,
    endDate,
    reserveStart,
    reserveEnd,
    category,
    type,
    showCompleted,
    take,
    page,
    search,
    position,
    workerId,
    noWorkers,
    guestId,
  } = parseQuery(query);

  const isPeriodChosen = startDate && endDate;
  const isReservePeriodChosen = reserveStart && reserveEnd;

  const sections = category?.split(",") as Category[];
  const types = type?.split(",") as RequestType[];
  const positionIds = position?.split(",") as string[];
  const workerIds = workerId?.split(",") as string[];

  const where: Prisma.RequestWhereInput = {
    ...(sections?.length > 0 && {
      section: {
        in: sections,
      },
    }),
    ...(types?.length > 0 && {
      type: {
        in: types,
      },
    }),
    ...(positionIds?.length > 0 && {
      positionId: {
        in: positionIds,
      },
    }),
    hotelId: user?.user.hotelId!,
    ...(noWorkers === "false"
      ? {
          // workerId: {
          workerId: {
            not: null,
            ...(workerIds?.length > 0 && {
              in: workerIds,
            }),
          },
          // },
        }
      : {}),

    ...(isPeriodChosen && {
      createdAt: {
        lte: new Date(endDate),
        gte: new Date(startDate),
      },
    }),
    ...(isReservePeriodChosen && {
      OR: [
        {
          reserveStart: {
            lte: new Date(reserveEnd),
            gte: new Date(reserveStart),
          },
        },
        {
          reserveEnd: {
            lte: addDays(new Date(reserveEnd), +1),
            gte: new Date(reserveStart),
          },
        },
      ],
    }),
    guest: {
      ...(search
        ? {
            name: {
              contains: search as string | undefined,
              mode: "insensitive",
            },
          }
        : {}),
      ...(guestId
        ? {
            id: guestId,
          }
        : {}),
    },
    ...(showCompleted === "true"
      ? { status: RequestStatus.COMPLETED }
      : {
          status: { not: RequestStatus.COMPLETED },
        }),
  };

  return { where, take, page };
}
