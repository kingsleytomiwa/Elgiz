"use client";

import { Box, Typography } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { useHandleParams } from 'src/hooks';
import { Dialog } from 'ui';
import { createPaymentIntent } from '../../actions';

interface Props {
    open: boolean;
    cycle: string;
    hotelEmail: string;
}

const PaymentModal: React.FC<Props> = ({ open, cycle, hotelEmail }) => {
    const [isLoading, setIsLoading] = useState(false);
    const handleParams = useHandleParams();

    const handleSubmit = useCallback(async () => {
        try {
            await createPaymentIntent();
            handleParams([['pay', '']]);
        } catch (error) {
            console.error(error);
        }

        setIsLoading(false);
    }, [handleParams]);

    return (
        <Dialog
            isOpened={open}
            isDisabled={isLoading}
            onCancel={() => handleParams([['pay', '']])}
            onSubmit={handleSubmit}
        >
            <Box sx={{ width: "543px" }}>
                <Typography sx={{ fontWeight: "600", fontSize: "14px" }}>
                    ELGIZ получит уведомление, что вы совершили банковский перевод за расчетный период {cycle}.
                </Typography>
                <Typography sx={{ marginTop: "24px", fontSize: "16px", color: "#F23838" }}>
                    Укажите в описании перевода емэйл вашего отеля {hotelEmail}. Так нам будет легче
                    понять, что это ваш платеж.
                </Typography>
            </Box>
        </Dialog>
    );
};

export default PaymentModal;
