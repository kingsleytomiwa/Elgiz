"use client";

import { Box, OutlinedInput, Typography } from '@mui/material';
import React, { useState } from 'react';

interface Props {
    rooms: number;
}

const RoomsField: React.FC<Props> = ({ rooms }) => {
    const [value, setValue] = useState(rooms);

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
                Количество номеров
            </Typography>

            <OutlinedInput
                name='rooms'
                onChange={(e) => setValue(+e.target.value)}
                value={value}
                placeholder="Количество номеров"
                componentsProps={{
                    input: {
                        type: "number",
                        min: value,
                        // @ts-ignore
                        sx: {
                            "&:: placeholder": {
                                color: "#9C9EA5",
                                mr: 2,
                            },
                        },
                    },
                }}
                sx={{
                    height: "56px",
                    borderRadius: "8px",
                    border: "1px solid #E6E8F0",
                    boxShadow: "none",
                    width: "100%",
                    marginTop: "16px",
                }}
            />
        </Box>
    );
};

export default RoomsField;
