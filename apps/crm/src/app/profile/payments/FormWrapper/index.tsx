"use client";

import React, { useState } from 'react';
import { useHandleParams } from 'src/hooks';
import { updatePaymentData } from '../../actions';
import { TransactionType } from '@prisma/client';
import { Alert, Snackbar } from '@mui/material';

const FormWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
    const handleParams = useHandleParams();
    const [snack, setSnack] = useState(false);

    async function handleSubmit(formData: FormData) {
        try {
            setSnack(await updatePaymentData({
                rooms: +(formData.get('rooms') || 0) as number,
                method: (formData.get('method') || TransactionType.BANK_TRANSFER) as TransactionType,
                autoRenewal: formData.get('autoRenewal') === 'true',
            }));

            handleParams([['edit', 'false']]);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <form action={handleSubmit}>
            {children}

            <Snackbar
                open={snack}
                autoHideDuration={3000}
                onClose={() => setSnack(false)}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    severity="success"
                    variant="filled"
                >
                    Запрос в обработке...
                </Alert>
            </Snackbar>
        </form>
    );
};

export default FormWrapper;
