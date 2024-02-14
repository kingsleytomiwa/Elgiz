"use server";

import {
  Guest,
  Hotel,
  Payment,
  Position,
  Prisma,
  RequestStatus,
  StatusChange,
} from "@prisma/client";
import prisma from "db";
import { DEFAULT_MODULES, MAILER, getNextStatus } from "utils/constants";
import { GUEST_SELECT, USER_SELECT } from "./selects";
import { hashSync } from "bcryptjs";
import ShortUniqueId from "short-unique-id";
import { sendMail } from "utils/sendgrid";
import { randomBytes } from "crypto";
import { sendPushNotification } from "backend-utils/notification";
import { getServerSession } from "next-auth";
import { ownerAuthOptions } from "backend-utils";

export async function findUser(
  where: Prisma.UserWhereInput,
  select: Prisma.UserSelect = USER_SELECT
) {
  return (await prisma.user.findFirst({ where, select }))!;
}

export async function findHotel(where: Prisma.HotelWhereInput, select?: Prisma.HotelSelect) {
  return (await prisma.hotel.findFirst({ where, select }))!;
}

export const createHotelWithModules = async (
  hotelData: Prisma.HotelCreateArgs["data"],
  password = randomBytes(10).toString("hex")
) => {
  const hashedPassword = hashSync(password, 10);

  const hotel = await prisma.hotel.create({
    data: {
      ...hotelData,
    },
  });

  const userData = {
    email: hotel.email,
    name: hotel.responsiblePersonName,
    position: Position.OWNER,
    password: hashedPassword,
    hotelId: hotel.id,
    suspended: true,
  };

  const modules = await prisma.$transaction(
    DEFAULT_MODULES.map(({ subModules, ...item }) =>
      prisma.module.create({
        data: {
          ...item,
          hotelId: hotel.id,
        },
      })
    )
  );

  await prisma.$transaction([
    prisma.user.create({ data: userData }),
    prisma.subModule.createMany({
      data: modules
        .map((item) => {
          const subModules = DEFAULT_MODULES!.find((it) => it.name === item.name)!.subModules!;
          return subModules.map(({ name, title, value, ...subModule }) => ({
            name,
            hotelId: hotel.id,
            moduleId: item.id,
            title,
            value,
            hidden: subModule?.hidden ?? false,
          }));
        })
        .flat(),
    }),
  ]);

  if (sendMail) {
    await sendMail({
      from: MAILER.noReply,
      to: hotel.email!,
      subject: `Owner account has been created for ${hotel.email}`,
      content: `Your credentials: ${hotel.email} ${password}`,
    });
  }

  return hotel;
};

export async function updateHotel(hotel: Partial<Hotel>) {
  const hotelData = await prisma.hotel.findUnique({ where: { id: hotel.id } });
  const settings = hotel?.settings !== null ? hotel?.settings : Prisma.JsonNull;

  if (hotelData?.email) {
    return await prisma.hotel.update({
      where: { id: hotelData.id },
      data: {
        ...hotel,
        settings,
      },
    });
  }

  return await createHotelWithModules({ ...hotel, settings });
}

export async function updatePayment(where: Prisma.PaymentWhereUniqueInput, data: Partial<Payment>) {
  return await prisma.payment.update({ where, data });
}

export async function deletePayment(where: Prisma.PaymentWhereUniqueInput) {
  return await prisma.payment.delete({ where });
}

export async function getHotels(args?: Prisma.HotelFindManyArgs) {
  return await prisma.hotel.findMany(args);
}

export async function createHotelPayment(args: Prisma.PaymentCreateArgs) {
  return await prisma.payment.create(args);
}

export async function readAllUserNotifications(args: Prisma.UserNotificationUpdateManyArgs) {
  return await prisma.userNotification.updateMany(args);
}

export async function createHotelRequest(args: Prisma.RequestCreateArgs) {
  return await prisma.request.create(args);
}
export async function createHotelRequests(args: Prisma.RequestCreateManyArgs) {
  return await prisma.request.createMany(args);
}

export async function updateHotelRequest(args: Prisma.RequestUpdateArgs) {
  return await prisma.request.update(args);
}

export async function updateStatusRequest(requestId: string, staffId: string, guestId?: string) {
  const request = await prisma.request.findUnique({
    where: {
      id: requestId,
    },

    select: {
      status: true,
    },
  });
  const { nextStatus } = getNextStatus(request!.status!);

  if (!nextStatus) {
    throw new Error("Invalid status");
  }

  const data = {
    status: nextStatus,
    staffId,
    requestId,
  };

  const transactions: any = [prisma.statusChange.create({ data })];

  if (guestId) {
    transactions.push(
      prisma.guest.findUnique({
        where: { id: guestId },
        select: { pushToken: true },
      })
    );
  }

  transactions.push(
    prisma.request.update({
      where: { id: requestId },
      data: {
        status: nextStatus,
        ...(nextStatus === RequestStatus.COMPLETED ? { completedAt: new Date() } : {}),
      },
    })
  );

  const [status, guest] = await prisma.$transaction(transactions);

  if (guest?.pushToken) {
    await sendPushNotification(guest.pushToken, {
      title: "You have a status update!",
      body: "Read an update",
    });
  }

  return status;
}

export async function createFoodCategory(args: Prisma.FoodCategoryCreateArgs) {
  return await prisma.foodCategory.create(args);
}

export async function getHotelsCount(args?: Prisma.HotelCountArgs) {
  return await prisma.hotel.count(args);
}

export async function getHotel(id: string) {
  return await prisma.hotel.findUnique({
    where: { id },
    include: {
      _count: {
        select: { requests: true },
      },
      subModules: true,
      parameters: true,
      modules: {
        orderBy: { index: "asc" },
      },
    },
  });
}

export async function getHotelPayments(args?: Prisma.PaymentFindManyArgs) {
  return await prisma.payment.findMany(args);
}

export async function updateUser(
  where: Prisma.UserWhereUniqueInput,
  { create, update }: Partial<Prisma.UserUpsertArgs>
) {
  return (await prisma.user.upsert({
    where,
    update: {
      ...update,
      ...(update?.password && {
        password:
          typeof update?.password === "string" ? hashSync(update.password, 10) : update?.password,
      }),
    },
    create: {
      position: "OWNER",
      ...create,
      password:
        typeof create?.password === "string" ? hashSync(create.password, 10) : create?.password,
    },
  }))!;
}

export type FoundUser = Awaited<ReturnType<typeof findUser>>;

export async function findGuests(
  where: Prisma.GuestWhereInput,
  { skip, take }: { skip: number; take: number }
) {
  const [data, total] = await prisma.$transaction([
    prisma.guest.findMany({
      where,
      select: GUEST_SELECT,

      orderBy: {
        createdAt: "desc",
      },
      skip,
      take,
    }),

    prisma.guest.count({ where }),
  ]);

  return {
    data: data.map((guest) => ({
      ...guest,
      requests: guest._count.requests,
    })),
    total,
  };
}

export type TableGuest = Awaited<ReturnType<typeof findGuests>>["data"][number];

export async function createGuest(data: Omit<Guest, "code" | "id">) {
  const uid = new ShortUniqueId({ length: 10 });
  return (await prisma.guest.create({
    data: { ...data, code: uid.rnd() },
    select: GUEST_SELECT,
  })) as TableGuest;
}

export async function updateGuest(
  where: Prisma.GuestWhereUniqueInput,
  data: Partial<Omit<Guest, "code" | "id">>
) {
  return (await prisma.guest.update({
    where,
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      room: data.room,
      startDate: data.startDate,
      endDate: data.endDate,
      pushToken: data.pushToken,
    },
    select: GUEST_SELECT,
  })) as TableGuest;
}

// add image here too
export async function getGuestSession(where: Prisma.GuestWhereInput) {
  const today = new Date();

  return await prisma.guest.findFirst({
    where: {
      ...where,

      startDate: {
        lte: today,
      },

      endDate: {
        gte: today,
      },

      hotel: {
        suspended: false,
        deleted: false,
      },

      suspended: {
        not: true,
      },
    },

    select: {
      id: true,
      name: true,
      room: true,
      code: true,
      startDate: true,
      endDate: true,
      hotelId: true,
      pushToken: true,
      hotel: {
        select: {
          id: true,
          name: true,
          country: true,
        },
      },
    },
  });
}

export type GuestSession = Awaited<ReturnType<typeof getGuestSession>>;

export async function findGuestRequests(
  where: Prisma.RequestWhereInput,
  { skip, take }: { skip: number; take: number }
) {
  const [data, total] = await prisma.$transaction([
    prisma.request.findMany({
      where,
      select: {
        id: true,
        type: true,
        createdAt: true,
        section: true,
        status: true,
      },

      orderBy: {
        createdAt: "desc",
      },
      skip,
      take,
    }),

    prisma.request.count({ where }),
  ]);

  return {
    data,
    total,
  };
}

export type GuestRequest = Awaited<ReturnType<typeof findGuestRequests>>["data"][number];

export async function findMessages(
  where: Prisma.MessageWhereInput,
  config?: Prisma.MessageFindManyArgs
) {
  const [data, total] = await prisma.$transaction([
    prisma.message.findMany({
      where,

      orderBy: {
        createdAt: "asc",
      },

      ...config,
    }),

    prisma.message.count({ where }),
  ]);

  return { data, total };
}

export async function findHotelMessageThreads(
  where: Prisma.MessageWhereInput,
  config?: Prisma.MessageFindManyArgs
) {
  const [data, total] = await prisma.$transaction([
    prisma.message.findMany({
      where,

      select: {
        id: true,
        senderId: true,
        guestId: true,
        text: true,
        createdAt: true,
        wasRead: true,
        guest: {
          select: { name: true, room: true },
        },
      },

      orderBy: {
        createdAt: "desc",
      },

      distinct: "guestId",

      ...config,
    }),

    prisma.$queryRaw`SELECT COUNT(DISTINCT "guestId") FROM messages WHERE "hotelId" = ${where.hotelId!}`,
  ]);

  return { data, total };
}
