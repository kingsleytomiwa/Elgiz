"use server";

import { ownerAuthOptions } from "backend-utils";
import { createHotelRequest, createHotelRequests } from "db";
import { getServerSession } from "next-auth";
import { revalidateRequests } from "src/app/requests/RequestDetails/actions";

export const onCreateRequest = async (data: any) => {
  const session = await getServerSession(ownerAuthOptions);

  const result = await createHotelRequest({
    data: {
      ...data,
      hotelId: session?.user?.hotelId,
    },
  });

  await revalidateRequests();

  return result;
};

export const onCreateRequests = async (data: Array<any>) => {
  const session = await getServerSession(ownerAuthOptions);

  const result = await createHotelRequests({
    data: data.map((el) => ({
      ...el,
      hotelId: session?.user?.hotelId,
    })),
  });

  await revalidateRequests();

  return result;
};
