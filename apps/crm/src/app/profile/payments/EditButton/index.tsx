"use client";

import React from 'react';
import {
    Button,
    Typography,
} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import { useHandleParams } from 'src/hooks';
import { useTranslation } from 'i18n';

interface Props {

}

const EditButton: React.FC<Props> = () => {
    const { t } = useTranslation({ ns: "portal" });
    const handleParams = useHandleParams();

    return (
        <Button
            sx={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                paddingX: "16px",
                paddingY: "4px",
                borderRadius: "5px",
                border: "1px solid #2B3467",
            }}
            onClick={() => handleParams([['edit', 'true']])}
        >
            <CreateIcon sx={{ color: "#2B3467" }} />
            <Typography sx={{ fontSize: "13px", color: "#2B3467" }}>{t("edit")}</Typography>
        </Button >
    );
};

export default EditButton;
