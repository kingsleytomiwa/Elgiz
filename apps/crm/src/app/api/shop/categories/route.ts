import { NextResponse, NextRequest } from "next/server";
import prisma from "db";
import { getServerSession } from "next-auth";
import { ownerAuthOptions } from "backend-utils";

export async function GET(req: NextRequest) {
  const session = await getServerSession(ownerAuthOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const shopCategories = await prisma.shopCategory.findMany({
    where: {
      hotelId: session?.user.hotelId!,
    },
  });

  return new NextResponse(JSON.stringify(shopCategories));
}
