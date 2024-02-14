"use client";

import { Alert, Button, Snackbar } from '@mui/material';
import { Payment } from '@prisma/client';
import React, { useState } from 'react';
import { requestPaymentReceipt } from 'src/app/profile/actions';

interface Props {
    payment: Payment;
}

const PaymentActionButton: React.FC<Props> = ({ payment }) => {
    const [loading, setLoading] = useState(false);
    const [snack, setSnack] = useState(false);

    if (payment.receipt) {
        return (
            <a
                href={payment.receipt}
                download
            >
                <Button
                    sx={{
                        minWidth: 0,
                        textAlign: "left",
                        width: "fit-content",
                        borderBottom: "1px solid #3F51B5",
                        borderRadius: "0px",
                        padding: "0px",
                    }}
                >
                    Скачать
                </Button>
            </a>
        );
    }

    return (
        <>
            <Button
                disabled={loading}
                onClick={async () => {
                    setLoading(true);

                    try {
                        await requestPaymentReceipt(payment.id);
                        setSnack(true);
                    } catch (error) {
                        console.error(error);
                    }

                    setLoading(false);
                }}
                sx={{
                    minWidth: 0,
                    textAlign: "left",
                    width: "fit-content",
                    borderBottom: "1px solid #3F51B5",
                    borderRadius: "0px",
                    padding: "0px",
                }}
            >
                Запросить
            </Button>

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
        </>
    );
};

export default PaymentActionButton;
