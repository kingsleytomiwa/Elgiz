import { Prisma } from "@prisma/client";
import { parseQuery } from "backend-utils";
import prisma from "db";
import { ownerAuthOptions } from "backend-utils";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = (await getServerSession(ownerAuthOptions))?.user;

    const where = {
      hotelId: user?.hotelId!,
      type: "HOTEL_REQUEST_CREATED",
			section: {
				in: user?.sections
			},
      userNotifications: {
        every: {
					wasRemoved: false,
        },
      },
    } as Prisma.NotificationWhereInput;

    const [notifications, count] = await prisma?.$transaction([
      prisma.notification.findMany({
        where,
        include: {
          guest: true,
          userNotifications: {
            where: {
              wasRemoved: false,
              userId: user?.id,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.notification.count({
        where,
      }),
    ]);

    return new NextResponse(JSON.stringify({ notifications, count }));
  } catch (error) {
    console.error(error);
    return new NextResponse("", { status: 403 });
  }
}
