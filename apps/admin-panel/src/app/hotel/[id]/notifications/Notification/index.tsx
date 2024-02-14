"use client";

import React, { useMemo, useRef } from "react";
import {
    Box,
    Button,
    Typography,
} from "@mui/material";
import { Dialog } from "ui";
import {
    Close,
} from "@mui/icons-material";
import { AdminNotification, AdminNotificationType, Payment } from "@prisma/client";
import { confirmPayment, uploadReceipt } from "../../actions";
import { useParams } from "next/navigation";
import { getCycleLabel } from "utils";

interface Props {
    notification: AdminNotification & { payment?: Payment | null; };
}

const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    };
    return new Intl.DateTimeFormat("ru-RU", options).format(date);
};

const Notification: React.FC<Props> = ({
    notification
}) => {
    const params = useParams<{ id: string; }>();
    const ref = useRef<HTMLInputElement>(null);

    const { title, description, details, fn } = useMemo(() => {
        switch (notification.type!) {
            case AdminNotificationType.PAYMENT: {
                const data = notification.data as {
                    rooms: number,
                    period: number,
                    amount: number,
                };

                return {
                    title: "Уведомление об оплате",
                    description: `Отель совершил банковский перевод EUR ${data.amount} за оплату подписки. Проверьте если перевод был зачислен и подтвердите, чтобы активировать подписку отеля.`,
                    details: (
                        <>
                            <Typography sx={{ fontSize: "14px" }}>
                                <span style={{ opacity: ".5" }}>Длительность: </span>
                                {data.period}
                            </Typography>
                            <Typography sx={{ fontSize: "14px" }}>
                                <span style={{ opacity: ".5" }}>Количество комнат: </span>
                                {data.rooms}
                            </Typography>
                            <Typography sx={{ fontSize: "14px" }}>
                                <span style={{ opacity: ".5" }}>Статус: </span>
                                {notification.payment?.isPaid ? (
                                    <span style={{ color: "#3F51B5" }}>Подтверждено</span>
                                ) : (
                                    <span style={{ opacity: ".5" }}>Не подтверждено</span>
                                )}
                            </Typography>
                        </>
                    ),
                    fn: notification.payment?.isPaid ? undefined : {
                        call: () => confirmPayment(notification.payment?.id!, params?.id!),
                        label: "Подтвердить перевод"
                    }
                };
            }
            case AdminNotificationType.ROOMS_QUANTITY_CHANGE_REQUEST: {
                const data = notification.data as {
                    rooms: number,
                    newRooms: number,
                };

                return {
                    title: "Запрос на увеличение количества номеров",
                    description: "Отель запрашивает увеличить количество номеров в сервисе.",
                    details: (
                        <>
                            <Typography sx={{ fontSize: "14px" }}>
                                <span style={{ opacity: ".5" }}>Сейчас доступно номеров: </span>
                                {data.rooms}
                            </Typography>
                            <Typography sx={{ fontSize: "14px" }}>
                                <span style={{ opacity: ".5" }}>Увеличить на: </span>
                                {data.newRooms - data.rooms}
                            </Typography>
                        </>
                    ),
                };
            }
            case AdminNotificationType.PAYMENT_RECEIPT:
                return {
                    title: "Запрос квитанции об оплате",
                    description: "Отель запрашивает квитанцию об оплате.",
                    details: (
                        <>
                            <Typography sx={{ fontSize: "14px" }}>
                                <span style={{ opacity: ".5" }}>Расчетный период: </span>
                                {getCycleLabel(notification.payment?.startDate!, notification.payment?.period!)}
                            </Typography>
                            <Typography sx={{ fontSize: "14px" }}>
                                <span style={{ opacity: ".5" }}>Сумма к оплате: </span>
                                EUR {notification.payment?.amount!}
                            </Typography>
                        </>
                    ),
                    fn: notification.payment?.receipt ? undefined : {
                        call: () => ref.current?.click(),
                        label: "Загрузить квитанцию"
                    },
                };
            case AdminNotificationType.PAYMENT_METHOD_CHANGE_REQUEST:
                const data = notification.data as {
                    method: string,
                    newMethod: string,
                };

                return {
                    title: "Запрос на изменение способа оплаты",
                    description: "Отель запрашивает изменить способ оплаты.",
                    details: (
                        <>
                            <Typography sx={{ fontSize: "14px" }}>
                                <span style={{ opacity: ".5" }}>Текущий метод: </span>
                                {data.method}
                            </Typography>
                            <Typography sx={{ fontSize: "14px" }}>
                                <span style={{ opacity: ".5" }}>Желаемый метод: </span>
                                {data.newMethod}
                            </Typography>
                        </>
                    ),
                };
        }

    }, [notification.type, notification.data, params?.id, notification.payment, ref]);

    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid #e6e6e6",
                pb: "16px",
                mb: "16px",
            }}
        >
            <Box sx={{ flex: 1 }}>
                <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <Box sx={{ display: "flex", gap: "4px", alignItems: "center" }}>
                        <Box
                            sx={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "100%",
                                background: "#3F51B5",
                                display: notification.wasRead ? "none" : "block",
                            }}
                        />
                        <Typography
                            sx={{
                                fontWeight: 600,
                                fontSize: "12px",
                                textTransform: "uppercase",
                                color: notification.wasRead ? "#65748B" : "#3F51B5",
                            }}
                        >
                            {title}
                        </Typography>
                    </Box>
                    <Typography sx={{ opacity: 0.5, fontSize: "14px" }}>{formatDate(notification.createdAt!)}</Typography>
                </Box>
                <Typography sx={{ py: "12px", fontSize: "16px", maxWidth: "732px" }}>
                    {description}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: "48px" }}>
                    {details}
                </Box>
            </Box>

            {fn && (
                <Button
                    onClick={fn.call}
                    sx={{ borderBottom: "1px solid #3F51B5", p: 0, borderRadius: 0 }}
                >
                    {fn.label}
                </Button>
            )}

            {notification.type === AdminNotificationType.PAYMENT_RECEIPT && !notification.payment?.receipt && (
                <input
                    ref={ref}
                    style={{ display: "none" }}
                    type="file"
                    onChange={async (e) => {
                        const formData = new FormData();
                        formData.append("file", e.target.files?.[0]!);

                        try {
                            await uploadReceipt(notification.payment?.id!, params?.id!, formData);
                        } catch (error) {
                            console.error(error);
                        }
                    }}
                />
            )}
        </Box>
    );
};

export default Notification;
