"use client";

import EntityTable from 'components/EntityTable';
import React, { useMemo } from 'react';
import {
    Box,
    Typography,
} from "@mui/material";
import { CellStatus } from "ui";
import { RequestStatus } from "@prisma/client";
import { CategoryLabel, RequestTypeLabel, dateTimeFormat } from "utils";
import { CheckCircle } from "@mui/icons-material";
import { format } from "date-fns";
import { TableRequest } from 'src/app/api/requests';
import { useTranslation } from 'i18n';
import i18next from "i18next";
import RequestTimer from 'components/RequestTimer';

interface Props {
    requests: TableRequest[];
    total: number;
    take: number;
    page: number;
    exclude?: string[];
    needsPagination?: boolean;
}

const Table: React.FC<Props> = ({
    requests,
    exclude = ["waiting_time", "service", "master"],
    ...props
}) => {
    const { t } = useTranslation({ ns: "portal" });
    const columns = useMemo(() => {
        const columns = [
            {
                key: "data",
                label: "service",
                minWidth: 200,
                format: (value) => {
                    const service = value?.products?.[0]?.name?.[i18next.language];
                    return typeof service === "string" ? service : "";
                },
            },
            {
                key: "worker",
                label: "master",
                minWidth: 200,
                format: (value) => value?.name ?? "",
            },
            {
                key: "section",
                label: "request_category",
                minWidth: 200,
                // @ts-ignore
                format: (value) => t(CategoryLabel[value]),
            },
            // @ts-ignore
            { key: "type", label: "request", minWidth: 200, format: (value) => t(RequestTypeLabel[value]) },
            {
                key: "guest",
                label: "guest",
                minWidth: 200,
                format: (value: { room: string; name: string; }) => value.name,
            },
            {
                key: "guest",
                label: "room",
                minWidth: 200,
                format: (value: { room: string; name: string; }) => value.room,
            },
            {
                key: "createdAt",
                label: "request_time",
                minWidth: 220,
                // @ts-ignore
                format: (value: Date) => {
                    if (!value) return;
                    return format(new Date(value), dateTimeFormat);
                },
            },
            {
                key: "createdAt",
                label: "waiting_time",
                minWidth: 250,
                format: (value: Date, request) => {
                    if (!value) return;

                    return (
                        <RequestTimer
                            createdAt={request.createdAt}
                            completedAt={request.completedAt}
                        />
                    );
                },
            },
            {
                key: "status",
                label: "status",
                minWidth: 200,
                // @ts-ignore
                format: (status: string) => (
                    <CellStatus
                        text={`${Object.values(RequestStatus).findIndex((el) => el === status) + 1
                            } - ${t(status.toLowerCase())}`}
                    />
                ),
            },
            {
                key: "isPaid",
                label: "payment",
                minWidth: 200,
                // @ts-ignore
                format: (value) => (
                    <>
                        {value ? (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <CheckCircle sx={{ fontSize: "20px", fill: "#3F51B5" }} />
                                <Typography sx={{ fontSize: "14px", color: "#121828" }}>{t("paid")}</Typography>
                            </Box>
                        ) : (
                            <Typography sx={{ fontSize: "14px", color: "#121828", opacity: 0.5 }}>
                                {t("not_paid")}
                            </Typography>
                        )}
                    </>
                ),
            },
        ];

        if (exclude) {
            return columns.filter((column) => !exclude.includes(column.label));
        }

        return columns;
    }, [t, exclude]);

    return (
        <EntityTable
            data={requests}
            // @ts-ignore
            columns={columns}
            {...props}
        />
    );
};

export default Table;
