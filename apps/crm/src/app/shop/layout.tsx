import { Box, Toolbar } from "@mui/material";
import Heading from "components/Heading";
import ParametersForm from "components/ParametersForm";
import { LinkTabs } from "ui";

export default function Layout({
    children,
}) {
    return (
        <>
            <Toolbar />
            <Box sx={{ display: "flex", gap: 3 }}>
                <Heading label="shop" />
                <ParametersForm type="SHOP" title={"the_parameters_of_hotel_store"} fields={["isDeliveryFree", "paymentMethods"]} />
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
                                path: "/shop",
                                label: "orders",
                            },
                            {
                                path: "/shop/catalog",
                                label: "catalog",
                            },
                        ]}
                    />
                </Box>

                {children}
            </Box>
        </>
    );
}
