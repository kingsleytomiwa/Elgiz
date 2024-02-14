import { Box, Toolbar } from "@mui/material";
import Heading from "components/Heading";
import Filters from "./Filters";

export default function Layout({
    children,
}) {
    return (
        <>
            <Toolbar />

            <Box sx={{ display: "flex" }}>
                <Heading label="requests" />
            </Box>

            <Filters />

            {children}
        </>
    );
}
