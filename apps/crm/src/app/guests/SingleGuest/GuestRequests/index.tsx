import React, { cache } from 'react';
import prisma from 'db';
import { getUserSession } from 'src/app/layout';
import GuestRequestsTable from './Table';

interface Props {
    id: string;
}

const getGuestRequests = cache(async (id: string, hotelId: string) => {
    return await prisma.request.findMany({
        where: {
            guestId: id,
            hotelId,
        },

        select: {
            section: true,
            id: true,
            status: true,
            createdAt: true,
        },

        take: 5,
        orderBy: {
            createdAt: "desc",
        }
    });
});

const GuestRequests: React.FC<Props> = async ({ id }) => {
    const session = await getUserSession();
    const requests = await getGuestRequests(id, session?.user.hotelId as string);

    if (!requests.length) {
        return null;
    }

    return (
        <GuestRequestsTable requests={requests} />
    );
};

export default GuestRequests;
