import { NextResponse, NextRequest } from "next/server";
import { parseQuery } from "backend-utils";
import prisma from "db";

export async function GET(req: NextRequest) {
  const query = Object.fromEntries(new URL(req.url).searchParams);
  const config = parseQuery(query);

  const [total, countries, hotels] = await prisma.$transaction([
    prisma.hotel.count(),

    prisma.hotel.findMany({
      select: { country: true },
      distinct: "country",
    }),

    prisma.hotel.findMany({
      include: {
        payments: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
      where: {
        name: {
          contains: config?.search as string | undefined,
          mode: "insensitive",
        },
        ...(config?.showDeleted === "false" && { deleted: false }),
        ...(config?.showSuspended === "false" && { suspended: false }),
        ...(config?.country && { country: { equals: config.country } }),
      },
      take: config.take,
      skip: config.page * config.take,
    }),
  ]);

  return new NextResponse(
    JSON.stringify({
      total,
      data: [countries, hotels],
      ...config
    })
  );
}
