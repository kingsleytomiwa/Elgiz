
"use client";

import { Box, FormControl, MenuItem, Select, Typography } from "@mui/material";
import React, { useState } from "react";
import { RequestWithHistory } from "utils/models";
import { useTranslation } from "i18n";
import { CheckCircle, ExpandMore } from "@mui/icons-material";
import { updatePaidStatus } from "../actions";

interface Props {
    request: RequestWithHistory;
}

const PaymentStateButton: React.FC<Props> = ({ request }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation({ ns: "portal" });

    return (
        <FormControl>
            <Select<boolean>
                disabled={isLoading}
                onChange={async (e) => {
                    setIsLoading(true);

                    try {
                        await updatePaidStatus(request.id, !!e.target.value);
                    } catch (error) {
                        console.error(error);
                    }

                    setIsLoading(false);
                }}
                value={!!request.isPaid}
                IconComponent={ExpandMore}
                renderValue={() => (
                    <Typography
                        sx={{ color: request.isPaid ? "black" : "#676E76", fontSize: "14px", fontWeight: 500 }}
                    >
                        {request.isPaid ? (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <CheckCircle
                                    sx={{ fontSize: "20px", fill: "#3F51B5", opacity: isLoading ? 0.5 : 1 }}
                                />
                                <Typography sx={{ fontSize: "14px", color: "#121828" }}>{t("paid")}</Typography>
                            </Box>
                        ) : (
                            <Typography sx={{ fontSize: "14px", color: "#121828", opacity: 0.5 }}>
                                {t("not_paid")}
                            </Typography>
                        )}
                    </Typography>
                )}
                sx={{
                    height: "22px",
                    border: "none !important",
                    alignSelf: "baseline",
                    "& .MuiOutlinedInput-notchedOutline": { display: "none" },
                }}
                inputProps={{
                    sx: {
                        borderColor: "#D9D9D9 !important",
                        lineHeight: 1,
                        p: 0,
                        pr: 6,
                        "&:focus": {
                            boxShadow: "none",
                        },
                    },
                }}
            >
                {[
                    { isPaid: true, label: t("paid") },
                    { isPaid: false, label: t("not_paid") },
                ].map((status) => (
                    <MenuItem
                        // @ts-ignore
                        key={status.isPaid}
                        value={status.isPaid}
                    >
                        {status.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default PaymentStateButton;
