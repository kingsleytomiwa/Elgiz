import { NextRequest, NextResponse } from "next/server";
import prisma from "db";
import { getGuestPayload } from "src/utils/middleware";
import { Category, RequestStatus } from "@prisma/client";
import { v4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const [guest, { subModuleId, workerId, ...body }] = await Promise.all([
      getGuestPayload(req),
      req.json(),
    ]);

    try {
      // checking if this module is active
      const subModule = await prisma.subModule.findFirstOrThrow({
        where: {
          name: subModuleId === "SHOP" ? "HIDDEN_SHOP" : subModuleId,
          hotelId: guest.hotelId,
          value: true,
        },
        include: {
          module: {
            select: {
              name: true,
            },
          },
        },
      });

      const section = subModule?.module.name as Category;
      const id = v4();
      const request = await prisma.$transaction([
        prisma.request.create({
          data: {
            ...body,
            ...(workerId && {
              worker: {
                connect: {
                  id: workerId,
                },
              },
            }),
            id,
            section,
            type: subModuleId,
            status: RequestStatus.CREATED,
            history: {
              create: {
                status: RequestStatus.CREATED,
                staffId: null,
              },
            },
            guest: { connect: { id: guest.id } },
            hotel: { connect: { id: guest.hotelId } },
          },
        }),

        prisma.notification.create({
          data: {
            type: "HOTEL_REQUEST_CREATED",
            section,
            hotelId: guest.hotelId,
            guestId: guest.id,
            data: {
              type: subModuleId,
              status: "CREATED",
              section,
              requestId: id,
            },
          },
        }),
      ]);
      return new NextResponse(JSON.stringify(request));
    } catch (err) {
      console.error(err);
      return new NextResponse("", { status: 400 });
    }
  } catch (err) {
    console.error(err);
    return new NextResponse("", { status: 401 });
  }
}

export async function GET(req: NextRequest & { noStatus?: RequestStatus }) {
  try {
    const [guest, { noStatus, ...body }] = await Promise.all([getGuestPayload(req), req]);

    try {
      const data = await prisma.request.findFirst({
        where: {
          hotelId: guest.hotelId,
          guestId: guest.id,
          status: {
            not: noStatus,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (!data) {
        return new NextResponse("", { status: 403, statusText: "Unauthorized" });
      }

      return new NextResponse(JSON.stringify(data));
    } catch (err) {
      console.error(err);
      return new NextResponse("", { status: 400 });
    }
  } catch (err) {
    console.error(err);
    return new NextResponse("", { status: 401 });
  }
}
