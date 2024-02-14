"use server";

import { PeopleOutlined, TrackChanges } from '@mui/icons-material';
import { RequestStatus } from '@prisma/client';
import LocalizedCardsRow from 'components/LocalizedCardsRow';
import { subDays } from 'date-fns';
import prisma from 'db';
import React, { cache } from 'react';
import { getUserSession } from 'src/app/layout';

const getMetrics = cache(async (hotelId: string) => {
    return prisma.$transaction([
        prisma.guest.count({
            where: {
                hotelId,
                suspended: false,

                endDate: {
                    gte: new Date(),
                },
            },
        }),

        prisma.request.count({
            where: {
                hotelId,
                status: { not: { equals: RequestStatus.COMPLETED } },
            },
        }),

        prisma.request.count({
            where: {
                hotelId,
                status: { equals: RequestStatus.COMPLETED },
                createdAt: {
                    lte: new Date(),
                    gte: subDays(new Date(), 30),
                },
            },
        }),
    ]);
});

const DashboardMetrics: React.FC = async () => {
    const session = await getUserSession();
    const [guestsCount, ongoingRequestsCount, doneRequestsCount] = await getMetrics(session?.user.hotelId!);


    return (
        <LocalizedCardsRow cards={[
            { title: "guests", value: guestsCount ?? 0, Icon: PeopleOutlined },
            { title: "active_requests", value: ongoingRequestsCount ?? 0, Icon: TrackChanges },
            { title: "the_latest_active_requests", value: doneRequestsCount ?? 0, hint: "over_the_past_30_days", Icon: TrackChanges, containerStyles: { backgroundColor: "#2B3467" } }]}
        />
    );
};

export default DashboardMetrics;
