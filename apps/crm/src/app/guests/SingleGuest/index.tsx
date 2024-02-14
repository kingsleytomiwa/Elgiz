import Sidebar from "./Sidebar";
import { Suspense, cache } from "react";
import GuestDetails from "./GuestDetails";
import prisma, { GUEST_SELECT } from "db";
import { getUserSession } from "src/app/layout";
import GuestRequests from "./GuestRequests";
import Link from "next/link";
import { Box } from "@mui/material";

export const getGuest = cache(async (id: string, hotelId: string) => {
    return await prisma.guest.findFirst({
        where: {
            id,
            hotelId: hotelId as string,
        },

        select: GUEST_SELECT,
    });
});

const SingleGuest = async ({
    searchParams
}: {
    searchParams: { selected: string; };
}) => {
    if (!searchParams.selected) {
        return <></>;
    }

    const session = await getUserSession();
    const guest = await getGuest(searchParams.selected, session?.user.hotelId as string);

    if (!guest) {
        return null;
    }

    return (
        <Sidebar>
            <GuestDetails guest={guest as any} />

            <Suspense>
                <GuestRequests id={guest?.id!} />
            </Suspense>

            {guest._count.requests > 5 &&
                <Box sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mt: 2,
                    mb: 5,
                    textDecoration: "underline",
                }}>
                    <Link href={encodeURI(`/requests?guestId=${guest.id}`)}>Смотреть еще</Link>
                </Box>
            }
        </Sidebar >
    );
};

export default SingleGuest;
