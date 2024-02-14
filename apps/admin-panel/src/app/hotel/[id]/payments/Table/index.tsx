"use client";

import {
    Paper,
    TableContainer,
    Table as MuiTable,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Box,
    Button,
    Typography,
} from "@mui/material";
import Image from "next/image";
import { useParams } from "next/navigation";
import DownloadIcon from "public/downoload.svg";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import React from "react";
import { Dialog } from "ui";
import { onDeletePayment, confirmPayment, uploadReceipt } from "../../actions";
import Dropzone from "components/Dropzone";
import { Payment } from "@prisma/client";

const COLUMNS = [
    { id: "startDate", label: "Дата платежа", minWidth: 200 },
    { id: "period", label: "Количество месяцев", minWidth: 200 },
    { id: "endDate", label: "Оплачено до (включительно)", minWidth: 200 },
    { id: "amount", label: "Сумма платежа", minWidth: 200 },
    { id: "receipt", label: "квитанция", minWidth: 200 },
    { id: "isPaid", label: "", minWidth: 100 },
];

type Props = {
    data: Payment[];
};

const Table: React.FC<Props> = ({ data }) => {
    const [payId, setPaiId] = React.useState("");
    const [confirmModal, setConfirmModal] = React.useState(false);
    const [rejectModal, setRejectModal] = React.useState(false);
    const params = useParams();

    const handleSetPaid = async (id: string) => {
        try {
            await confirmPayment(id, params?.id as string);
        } catch (error) {
            console.log("error:", error);
        }
    };

    const handleReceiptUpdate = async (id: string, event: File) => {
        if (event.size > 5 * 1024 * 1024) {
            alert("ваш файл слишком большой");
        } else {
            if (typeof event === "string") {
                await uploadReceipt(id, params?.id as string, event);
            } else {
                const fileForm = new FormData();
                fileForm.append("file", event!);
                await uploadReceipt(id, params?.id as string, fileForm);
            }
        }
    };

    return (
        <>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <TableContainer
                    sx={{
                        maxHeight: 440,
                        scrollbarWidth: "thin",
                        "&::-webkit-scrollbar": {
                            width: "0.4em",
                        },
                        "&::-webkit-scrollbar-track": {
                            background: "white",
                        },
                        "&::-webkit-scrollbar-thumb": {
                            background: "#bfbfbf",
                            borderRadius: "10px",
                        },
                    }}
                >
                    <MuiTable stickyHeader>
                        <TableHead>
                            <TableRow>
                                {COLUMNS.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        style={{
                                            minWidth: column.minWidth,
                                            backgroundColor: "#F3F4F6",
                                            fontSize: "12px",
                                            fontWeight: 600,
                                            color: "#374151",
                                        }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((payment) => {
                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={payment.id}
                                        sx={{ cursor: "pointer" }}
                                    >
                                        <TableCell>
                                            <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                                {!payment.isPaid && <Image src={DownloadIcon} alt="download icon" />}
                                                {payment.startDate as any}
                                            </Box>
                                        </TableCell>

                                        <TableCell>
                                            {payment.period}
                                        </TableCell>

                                        <TableCell>
                                            {payment.endDate as any}
                                        </TableCell>

                                        <TableCell>
                                            EUR {payment.amount}
                                        </TableCell>

                                        <TableCell>
                                            {payment.isPaid && (
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "8px",
                                                        color: "#3F51B5",
                                                    }}
                                                >
                                                    {payment.receipt ? (
                                                        <>
                                                            <Typography>Квитанция загружена</Typography>
                                                            <a
                                                                href={payment.receipt}
                                                                download
                                                                style={{
                                                                    textDecoration: "none",
                                                                    color: "#3F51B5",
                                                                    fontSize: "14px",
                                                                    fontWeight: "400",
                                                                }}
                                                            >
                                                                <Button
                                                                    sx={{
                                                                        p: 0,
                                                                        borderBottom: "1px solid #3F51B5",
                                                                        borderRadius: "0",
                                                                        lineHeight: "21px",
                                                                        color: "#3F51B5",
                                                                        textDecoration: "none",
                                                                        fontSize: "14px",
                                                                        fontWeight: "400",
                                                                    }}
                                                                >

                                                                    Посмотреть
                                                                </Button>
                                                            </a>
                                                            <Dropzone
                                                                label="Заменить"
                                                                onChange={(event) =>
                                                                    handleReceiptUpdate(
                                                                        payment.id,
                                                                        event.target.files?.[0] || null
                                                                    )
                                                                }
                                                            />
                                                        </>
                                                    ) : (
                                                        <Dropzone
                                                            label="Загрузить"
                                                            onChange={(event) =>
                                                                handleReceiptUpdate(payment.id, event.target.files?.[0] || null)
                                                            }
                                                        />
                                                    )}
                                                </Box>
                                            )}
                                        </TableCell>

                                        {!payment.isPaid && <TableCell>
                                            <Box sx={{ display: "flex", gap: "24px" }}>
                                                <Button
                                                    onClick={() => {
                                                        setConfirmModal(true);
                                                        setPaiId(payment.id);
                                                    }}
                                                    sx={{ p: 0, minWidth: 0 }}
                                                >
                                                    <CheckCircleOutlineIcon sx={{ color: "#2F79EB" }} />
                                                </Button>
                                                <Button
                                                    sx={{ p: 0, minWidth: 0 }}
                                                    onClick={() => {
                                                        setRejectModal(true);
                                                        setPaiId(payment.id);
                                                    }}
                                                >
                                                    <HighlightOffIcon sx={{ color: "#535961" }} />
                                                </Button>
                                            </Box>
                                        </TableCell>}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </MuiTable>
                </TableContainer>
            </Paper>

            <Dialog
                sx={{ minWidth: "543px", height: "316px" }}
                isOpened={confirmModal}
                isDisabled={false}
                onCancel={() => setConfirmModal(false)}
                onSubmit={async () => {
                    try {
                        await handleSetPaid(payId);
                        setConfirmModal(false);
                    } catch (error) {
                        console.log("error:", error);
                    }
                }}
            >
                <Typography sx={{ fontWeight: "600", fontSize: "14px" }}>
                    Вы уверены, что хотите подтвердить банковский перевод?
                </Typography>
            </Dialog>
            <Dialog
                sx={{ minWidth: "543px", height: "316px" }}
                isOpened={rejectModal}
                isDisabled={false}
                onCancel={() => setRejectModal(false)}
                onSubmit={async () => {
                    try {
                        await onDeletePayment(payId, params?.id as string);
                        setRejectModal(false);
                    } catch (error) {
                        console.log("error:", error);
                    }
                }}
            >
                <Typography sx={{ fontWeight: "600", fontSize: "14px" }}>
                    Вы уверены, что хотите отклонить банковский перевод?
                </Typography>
            </Dialog>
        </>
    );
};

export default Table;
