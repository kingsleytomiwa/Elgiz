import { Prisma } from "@prisma/client";
import { adminAuthOptions, parseQuery } from "backend-utils";
import prisma from "db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(adminAuthOptions);

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const [notifications, count] = await prisma?.$transaction([
      prisma.adminNotification.findMany({
        where: {
          wasRemoved: false,
        },
        include: {
          hotel: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.adminNotification.count({
        where: {
          wasRemoved: false,
        },
      }),
    ]);

    return new NextResponse(JSON.stringify({ notifications, count }));
  } catch (error) {
    console.error(error);
    return new NextResponse("", { status: 403 });
  }
}
