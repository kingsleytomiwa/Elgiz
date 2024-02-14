"use client";

import { Typography } from '@mui/material';
import { useTranslation } from 'i18n';
import React from 'react';

interface Props {
    label: string;
}

const Heading: React.FC<Props> = ({ label }) => {
    const { t } = useTranslation({ ns: "portal" });

    return (
        <Typography variant="h4">{t(label)}</Typography>
    );
};

export default Heading;
