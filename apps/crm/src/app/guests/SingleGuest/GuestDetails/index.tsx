"use client";

import { Box, Button, Typography } from '@mui/material';
import Detail from 'components/Detail';
import React from 'react';
import { format } from "date-fns";
import EditButton from '../EditButton';
import { TableGuest } from 'db';
import { BackHand, ThumbUpOutlined } from '@mui/icons-material';
import { suspendGuest } from '../actions';
import { useTranslation } from 'i18n';

type Props = {
    guest: TableGuest;
};

const GuestDetails: React.FC<Props> = ({ guest }) => {
    const { t } = useTranslation({ ns: "portal" });

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: "auto auto",
                gap: 6,
                pl: 9,
                pb: 5,
                borderBottom: "1px solid #868A91",
            }}
        >
            {(
                [
                    {
                        title: "name",
                        description: guest.name,
                    },
                    {
                        title: "guest_code",
                        description: guest.code,
                    },
                    {
                        title: "room",
                        description: guest.room,
                    },
                    {
                        title: "mail",
                        description: guest.email,
                    },
                    {
                        title: "telephone",
                        description: guest.phone,
                    },
                    {
                        title: "arrival_date",
                        description: format(new Date(guest.startDate), 'dd/MM/yyyy HH:mm'),
                    },
                    {
                        title: "date_of_departure",
                        description: format(new Date(guest.endDate), 'dd/MM/yyyy HH:mm'),
                    },
                ]
            ).map((detail) => (
                <Detail
                    key={detail.title}
                    {...detail}
                />
            ))}

            <EditButton guest={guest} />

            {guest.suspended ? (
                <Button
                    startIcon={<ThumbUpOutlined sx={{ fill: "#2B3467", fontSize: 24, margin: 0 }} />}
                    sx={{
                        "& .MuiButton-startIcon": { mr: 0, ml: 0, "&>*:nth-of-type(1)": { fontSize: 24 } },
                        borderRadius: "5px",
                        height: "32px",
                        width: 180,
                        minWidth: 0
                    }}
                    onClick={async () => {
                        await suspendGuest(guest.id, false);
                    }}
                >
                    <Typography sx={{ color: "#2B3467", ml: 0.5, fontSize: "13px" }}>
                        Разблокировать
                    </Typography>
                </Button>
            ) : (
                <Button
                    startIcon={<BackHand sx={{ fill: "#F23838", fontSize: 24 }} />}
                    sx={{
                        "& .MuiButton-startIcon": { mr: 0, ml: 0, "&>*:nth-of-type(1)": { fontSize: 24 } },
                        borderRadius: "5px",
                        height: "32px",
                        width: 180,
                        minWidth: 0
                    }}
                    onClick={async () => {
                        await suspendGuest(guest.id, true);
                    }}
                >
                    <Typography sx={{ color: "#F23838", ml: 0.5, fontSize: "13px" }}>
                        {t("block")}
                    </Typography>
                </Button>
            )}
        </Box>
    );
};

export default GuestDetails;
