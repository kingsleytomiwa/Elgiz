"use client";

import { Box, FormControl, MenuItem, Select, Typography } from '@mui/material';
import { TransactionType } from '@prisma/client';
import React, { useState } from 'react';

interface Props {
    method: TransactionType;
}

const PaymentMethodSelect: React.FC<Props> = ({ method }) => {
    const [value, setValue] = useState(method);

    return (
        <Box sx={{ flex: 1 }}>
            <Typography
                sx={{
                    color: "#374151",
                    fontSize: "12px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                }}
            >
                Способ оплаты
            </Typography>
            <FormControl
                sx={{
                    width: "100%",
                    marginTop: "16px",
                }}
            >
                <Select
                    onChange={e => setValue(e.target.value as TransactionType)}
                    name='method'
                    value={value}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    sx={{
                        height: "56px",
                        borderRadius: "8px",
                        border: "1px solid #E6E8F0",
                        boxShadow: "none",
                    }}
                >
                    <MenuItem value={TransactionType.PAYPAL}>Банковская карта/PayPal</MenuItem>
                    <MenuItem value={TransactionType.BANK_TRANSFER}>Трансфер</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
};

export default PaymentMethodSelect;
