"use client";

import { Button, Typography } from '@mui/material';
import React from 'react';
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import { useHandleParams } from 'src/hooks';

const ShowPaymentHistoryButton: React.FC = () => {
    const handleParams = useHandleParams();

    return (
        <Button
            onClick={() => handleParams([['history', 'true']])}
            sx={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                paddingX: "16px",
                paddingY: "4px",
                borderRadius: "5px",
                border: "1px solid #2B3467",
            }}
        >
            <WatchLaterIcon sx={{ color: "#2B3467" }} />
            <Typography sx={{ fontSize: "13px", color: "#2B3467" }}>
                История платежей
            </Typography>
        </Button>
    );
};

export default ShowPaymentHistoryButton;
