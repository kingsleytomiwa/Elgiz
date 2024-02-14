"use client";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Button, Typography } from '@mui/material';
import React from 'react';
import { useHandleParams } from "src/hooks";

interface Props {
    disabled: boolean;
}

const PayButton: React.FC<Props> = ({ disabled }) => {
    const handleParams = useHandleParams();

    return (
        <Button
            onClick={() => handleParams([['pay', 'true']])}
            disabled={disabled}
            sx={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                paddingX: "16px",
                paddingY: "4px",
                borderRadius: "5px",
                border: "1px solid #2B3467",
                "&.Mui-disabled": {
                    opacity: 0.3,
                },
            }}
        >
            <CheckCircleIcon sx={{ color: "#2B3467" }} />
            <Typography sx={{ fontSize: "13px", color: "#2B3467" }}>Оплатить</Typography>
        </Button>
    );
};

export default PayButton;
