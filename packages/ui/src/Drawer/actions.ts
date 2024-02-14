"use server";

import { getServerSession } from "next-auth";
import { ownerAuthOptions, adminAuthOptions } from "backend-utils";
import prisma from "db";
import { v4 } from "uuid";

export const readAllNotifications = async (isAdmin: boolean) => {
  const session = await getServerSession(
    isAdmin ? adminAuthOptions : ownerAuthOptions
  );

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const unreadNotifications = !isAdmin ? await prisma.notification.findMany({
    include: {
      userNotifications: true,
    },
  }) : [];

  return isAdmin
    ? await prisma.adminNotification.updateMany({
        data: {
          wasRead: true,
        },
      })
    : await prisma.$transaction(
        unreadNotifications?.map((notif) => {
          return prisma.userNotification.upsert({
            where: {
              id: notif.userNotifications?.find(
                (el) => el.userId === session.user.id
              )?.id,
              hotelId: notif?.hotelId!,
              notificationId: notif?.id,
            },
            create: {
              wasRead: true,
              hotelId: notif?.hotelId!,
              guestId: notif?.guestId,
              userId: session?.user?.id,
              notificationId: notif?.id,
            },
            update: {
              wasRead: true,
            },
          });
        })
      );
};

type UpdateNotificationData = {
  id?: string;
  guestId?: string | null;
  roleNotificationId?: string;
  hotelId?: string;
};
// data for guestId and notificationId
export const onUpdateNotification = async (
  isAdmin: boolean,
  data: UpdateNotificationData,
  updateData: {
    wasRead?: boolean;
    wasRemoved?: boolean;
  }
) => {
  const session = await getServerSession(
    isAdmin ? adminAuthOptions : ownerAuthOptions
  );

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const roleNotificationId = data?.roleNotificationId ?? v4();

  const whereData = {
    id: roleNotificationId,
    hotelId: session?.user?.hotelId! ?? data?.hotelId,
  };

  return isAdmin
    ? await prisma.adminNotification.update({
        where: whereData,
        data: updateData,
      })
    : await prisma.userNotification.upsert({
        where: {
          ...whereData,
          notificationId: data?.id,
          userId: session?.user?.id,
        },
        create: {
          ...updateData,
          id: roleNotificationId,
          // hotel: {
          //   connect: {
          //     id: session?.user?.hotelId! ?? data?.hotelId,
          //   },
          // },
          user: {
            connect: {
              id: session?.user?.id,
            },
          },
          notification: {
            connect: {
              id: data?.id,
            },
          },
          hotel: {
            connect: {
              id: session?.user?.hotelId! ?? data?.hotelId,
            },
          },
          guest: {
            connect: {
              id: data!.guestId!,
            },
          },
        },
        update: updateData,
      });
};

export const onDeleteNotification = async (
  isAdmin: boolean,
  data: UpdateNotificationData
) =>
  await onUpdateNotification(isAdmin, data, {
    wasRead: true,
    wasRemoved: true,
  });

export const onReadNotification = async (
  isAdmin: boolean,
  data: UpdateNotificationData
) =>
  await onUpdateNotification(isAdmin, data, {
    wasRead: true,
  });
