"use client";

import React, { useState } from 'react';
import { Edit } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import CreateEditGuest from '../../CreateEditGuest';
import { TableGuest } from 'db';
import { useTranslation } from 'i18n';

interface Props {
    guest: TableGuest;
}

const EditButton: React.FC<Props> = ({ guest }) => {
    const [modal, setModal] = useState(false);
    const { t } = useTranslation({ ns: "portal" });

    return (
        <>
            <Button
                startIcon={<Edit sx={{ fill: "#2B3467", fontSize: 24 }} />}
                sx={{
                    "& .MuiButton-startIcon": { mr: 0, ml: 0, "&>*:nth-of-type(1)": { fontSize: 24 } },
                    border: "1px solid #2B3467",
                    borderRadius: "5px",
                    height: "32px",
                    width: 180,
                    minWidth: 0
                }}
                onClick={() => setModal(true)}
            >
                <Typography
                    sx={{ color: "#2B3467", ml: 0.5, fontSize: "13px" }}
                >
                    {t("edit")}
                </Typography>
            </Button>

            <CreateEditGuest
                data={guest as any}
                open={modal}
                setOpen={setModal}
                onCancel={() => setModal(false)}
            />
        </>
    );
};

export default EditButton;
