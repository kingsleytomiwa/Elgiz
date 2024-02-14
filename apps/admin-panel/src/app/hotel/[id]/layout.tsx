import { notFound, redirect } from "next/navigation";
import { getHotel as _getHotel } from "db";
import { cache } from "react";
import HotelActions from "./HotelActions";
import { Box, Toolbar } from "@mui/material";
import { LinkTabs } from "ui";
import { getUserSession } from "src/app/layout";

const getHotel = cache(_getHotel);

export default async function Layout({ children, params, }: {
    children: React.ReactNode;
    params: { id: string; };
}) {
    const session = await getUserSession();

    if (!session) {
        redirect("/login");
    }

    if (!params?.id) {
        notFound();
    }

    const hotel = await getHotel(params.id);

    if (!hotel) {
        notFound();
    }

    return (
        <Box>
            <Toolbar />
            <HotelActions hotel={hotel} />
            <Box sx={{ width: "100%" }}>
                <Box
                    sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mt: "70px",
                    }}
                >
                    <LinkTabs
                        isAdmin
                        links={[
                            {
                                path: `/hotel/${params.id}`,
                                label: "Статистика",
                            },
                            {
                                path: `/hotel/${params.id}/payments`,
                                label: "Оплата",
                            },
                            {
                                path: `/hotel/${params.id}/notifications`,
                                label: "Уведомления",
                            }
                        ]}
                        aria-label="basic tabs example"
                    />
                </Box>
            </Box>

            {children}
        </Box>
    );
}
