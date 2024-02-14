"use client";

import React from 'react';
import {
    Button,
} from "@mui/material";
import { useHandleParams } from 'src/hooks';

interface Props {

}

const CancelButton: React.FC<Props> = () => {
    const handleParams = useHandleParams();

    return (
        <Button
            onClick={() => handleParams([['edit', '']])}
            sx={{ color: "black", padding: "16px 24px" }}
        >
            Отмена
        </Button>
    );
};

export default CancelButton;
