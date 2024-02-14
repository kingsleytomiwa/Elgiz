import { Request } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "db";
import RequestContainer from "../../../../components/RequestContainer";
import { ownerAuthOptions } from "backend-utils";

export default async function Request({
  params,
}: {
  params: { slug: string };
}) {
  const session = await getServerSession(ownerAuthOptions);

  if (!session) {
    redirect("/login");
  }

  const request = await prisma.request.findUnique({
    include: {
      guest: { select: { name: true, room: true } },
    },
    where: { id: params.slug },
  });

  return <RequestContainer request={request!} />;
}
