import prisma from "db";
import { ownerAuthOptions } from "backend-utils";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession(ownerAuthOptions);
  // const query = Object.fromEntries(new URL(req.url).searchParams);

	if (!session?.user) {
    throw new Error("Unauthorized");
  }

	const data = await prisma.module.findMany({
		where: {
			hotelId: session?.user.hotelId!
		},
		include: {
			subModules: true
		}
	});

  return new Response(JSON.stringify(data));
}
