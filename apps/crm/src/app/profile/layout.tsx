import {
    Box,
    Toolbar,
} from "@mui/material";
import { getUserSession } from "../layout";
import Tabs from "./Tabs";
import { LinkTabs } from "ui";

export default async function Layout({ children }) {
    const session = await getUserSession();

    return (
        <>
            <Toolbar />
            <Tabs />

            {session?.user?.position === "OWNER" && (
                <Box
                    sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        my: "20px",
                    }}
                >
                    <LinkTabs links={[
                        {
                            path: "/profile",
                            label: "hotel_data",
                        },
                        {
                            path: "/profile/payments",
                            label: "payments",
                        },
                    ]} />
                </Box>
            )}


            {children}
        </>
    );
}
