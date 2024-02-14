"use client";

import { ArrowRight } from "@mui/icons-material";
import { Box, Button, Paper, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "i18n";
import Link from "next/link";

const DashboardWrap: React.FC<React.PropsWithChildren> = ({ children }) => {
    const i18n = useTranslation({ ns: "portal" });

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', py: 4, px: 3 }}>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 6, mb: 3 }}>
                <Typography
                    variant="h6"
                    sx={{ lineHeight: "24px" }}
                >
                    {i18n?.t("the_latest_active_requests")}
                </Typography>

                <Button
                    variant="text"
                    sx={{ px: 1.5, py: 1 }}
                    LinkComponent={Link}
                    href="/requests"
                >
                    <Typography sx={{ fontSize: "13px", lineHeight: "22px", fontWeight: 600, mr: 1 }}>
                        {i18n?.t("all_requests")}
                    </Typography>
                    <ArrowRight sx={{ fontSize: "18px" }} />
                </Button>
            </Box>

            {children}
        </Paper>
    );
};

export default DashboardWrap;
