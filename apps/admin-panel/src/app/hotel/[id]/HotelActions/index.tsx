"use client";

import * as React from "react";
import {
    Box,
    Button,
    Typography,
} from "@mui/material";
import {
    Edit,
    BackHand,
    Delete,
    BackHandOutlined,
    ThumbUpOutlined,
    TurnLeft,
} from "@mui/icons-material";
import { Hotel } from "@prisma/client";
import Link from "next/link";
import { onUpdateHotel } from "../actions";

const buttonStyles = {
    "& .MuiButton-startIcon": { mr: 0, ml: 0, "&>*:nth-of-type(1)": { fontSize: 24 } },
    border: "1px solid #2B3467",
    borderRadius: "5px",
    height: "32px",
    px: 2,
    py: 0.5,
};

interface Props {
    hotel: Hotel;
}

const HotelActions: React.FC<Props> = ({ hotel }) => {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {hotel.suspended && !hotel.deleted && (
                    <>
                        <BackHandOutlined sx={{ color: "#FFA700", fontSize: "32px" }} />
                        <Typography
                            variant="h5"
                            sx={{
                                color: "#FFA700",
                                fontWeight: 600,
                                fontSize: "12px",
                                lineHeight: "30px",
                                letterSpacing: "0.5px",
                                textTransform: "uppercase",
                            }}
                        >
                            Остановлен
                        </Typography>
                    </>
                )}
                {hotel.deleted && (
                    <>
                        <Delete sx={{ color: "#F23838", fontSize: "32px" }} />
                        <Typography
                            variant="h5"
                            sx={{
                                color: "#F23838",
                                fontWeight: 600,
                                fontSize: "12px",
                                lineHeight: "30px",
                                letterSpacing: "0.5px",
                                textTransform: "uppercase",
                            }}
                        >
                            Удален
                        </Typography>
                    </>
                )}
            </Box>
            <Typography variant="h4" sx={{ position: "relative" }}>
                {hotel.name}
            </Typography>

            {hotel.deleted ? (
                <Button
                    startIcon={<TurnLeft sx={{ fill: "#2B3467", fontSize: 24 }} />}
                    sx={buttonStyles}
                    onClick={() => onUpdateHotel(hotel.id, { deleted: false })}
                >
                    <Typography sx={{ color: "#2B3467", ml: 0.5, fontSize: "13px" }}>
                        Восстановить
                    </Typography>
                </Button>
            ) : (
                <>
                    <Link href={`/add-hotel?id=${hotel.id}`}>
                        <Button
                            startIcon={<Edit sx={{ fill: "#2B3467", fontSize: 24 }} />}
                            sx={buttonStyles}
                        >
                            <Typography sx={{ color: "#2B3467", ml: 0.5, fontSize: "13px" }}>
                                Редактировать
                            </Typography>
                        </Button>
                    </Link>

                    {hotel.suspended ? (
                        <Button
                            startIcon={<ThumbUpOutlined sx={{ fill: "#2B3467", fontSize: 24, margin: 0 }} />}
                            sx={buttonStyles}
                            onClick={() => onUpdateHotel(hotel.id, { suspended: false })}
                        >
                            <Typography sx={{ color: "#2B3467", ml: 0.5, fontSize: "13px" }}>
                                Продолжить подписку
                            </Typography>
                        </Button>
                    ) : (
                        <Button
                            startIcon={<BackHand sx={{ fill: "#2B3467", fontSize: 24 }} />}
                            sx={buttonStyles}
                            onClick={() => onUpdateHotel(hotel.id, { suspended: true })}
                        >
                            <Typography sx={{ color: "#2B3467", ml: 0.5, fontSize: "13px" }}>
                                Остановить подписку
                            </Typography>
                        </Button>
                    )}

                    <Button
                        startIcon={<Delete sx={{ fill: "#2B3467", fontSize: 24 }} />}
                        sx={buttonStyles}
                        onClick={() => onUpdateHotel(hotel.id, { deleted: true })}
                    >
                        <Typography sx={{ color: "#2B3467", ml: 0.5, fontSize: "13px" }}>
                            Удалить отель
                        </Typography>
                    </Button>
                </>
            )}
        </Box>
    );
};

export default HotelActions;
