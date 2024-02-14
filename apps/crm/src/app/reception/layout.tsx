import { redirect } from "next/navigation";
import { getUserSession } from "../layout";
import * as React from "react";
import {
    Box,
    Toolbar,
} from "@mui/material";
import { LinkTabs } from "ui";
import ParametersForm from "components/ParametersForm";
import Heading from "../../../components/Heading";

export default async function Layout({ children }) {
    const session = await getUserSession();

    if (!session) {
        redirect('/login');
    }

    return (
        <>
            <Toolbar />
            <Box sx={{ display: "flex", gap: 3 }}>
                <Heading label="reception" />
                <ParametersForm
                    type="RECEPTION"
                    title="Параметры “Рецепции”"
                    fields={["reception"]}
                />
            </Box>

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
                        links={[
                            {
                                path: "/reception",
                                label: "applications",
                            },
                            {
                                path: "/reception/reviews",
                                label: "reviews",
                            },
                        ]}
                    />
                </Box>

                {children}
            </Box>
        </>
    );
}
