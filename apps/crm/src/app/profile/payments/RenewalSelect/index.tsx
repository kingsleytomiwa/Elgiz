"use client";

import { Box, FormControl, MenuItem, Select, Typography } from '@mui/material';
import React, { useState } from 'react';

interface Props {
    autoRenewal: boolean;
}

const RenewalSelect: React.FC<Props> = ({ autoRenewal }) => {
    const [value, setValue] = useState(String(autoRenewal));

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
                Автопродление
            </Typography>
            <FormControl
                sx={{
                    width: "100%",
                    marginTop: "16px",
                }}
            >
                <Select
                    onChange={(e) => setValue(e.target.value)}
                    value={value}
                    name='autoRenewal'
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    sx={{
                        height: "56px",
                        borderRadius: "8px",
                        border: "1px solid #E6E8F0",
                        boxShadow: "none",
                    }}
                >
                    <MenuItem value={'true'}>Включено</MenuItem>
                    <MenuItem value={'false'}>Выключено</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
};

export default RenewalSelect;
