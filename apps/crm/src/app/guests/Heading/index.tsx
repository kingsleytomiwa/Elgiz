'use client';

import { Toolbar, Typography } from '@mui/material';
import React from 'react';
import Filters from '../Filters';
import { useTranslation } from 'i18n';

const Heading: React.FC = () => {
    const { t } = useTranslation({ ns: "portal" });
    
    return (
        <>
            <Toolbar />

            <Typography variant="h4">
                {t("guests")}
            </Typography>

            <Filters />
        </>
    );
};

export default Heading;
