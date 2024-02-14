import { Box } from "@mui/material";
import Notification from "./Notification";
import { cache } from "react";
import prisma from "db";

export const metadata = {
    title: "Hotel details",
};

const getNotifications = cache((hotelId: string) => prisma.adminNotification.findMany({
    where: {
        hotelId,
    },

    include: {
        payment: true,
    },

    orderBy: { createdAt: "desc" },
}));

export default async function Page({ params }: { params: { id: string; }; }) {
    const notifications = await getNotifications(params.id);

    return (
        <Box sx={{ maxWidth: "1000px", width: "100%", mt: 4 }}>
            {notifications.map((item, i) => (
                <Notification
                    key={item.id}
                    notification={item}
                />
            ))}
        </Box>
    );
}
