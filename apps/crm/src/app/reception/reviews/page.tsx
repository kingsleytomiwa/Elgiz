"use client";

import * as React from "react";
import {
    Box,
    Paper,
    OutlinedInput,
} from "@mui/material";
import { DateRangePickerInput } from "ui";
import { Category, RequestType } from "@prisma/client";
import { dateTimeFormat } from "utils";
import { Search } from "@mui/icons-material";
import { useDebounce } from "usehooks-ts";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import EntityTable from "components/EntityTable";
import { useReviews } from "lib/use-fetch";
import { RequestWithHistory } from 'utils/models';
import { useTranslation } from "i18n";
import ReviewRequestDetails, { ReviewWithGuest } from "./ReviewRequestDetails";

export default function Reception() {
    const [activeTab, setActiveTab] = React.useState(0);
    const [openedRequest, setOpenedRequest] = React.useState<RequestWithHistory | null>(null);
    const [review, setReview] = React.useState<ReviewWithGuest>();
    const { t } = useTranslation({ ns: "portal" });

    const [config, setConfig] = React.useState({
        page: 0,
        take: 10,
        search: "",
        type: [] as RequestType[],
        startDate: null,
        endDate: null,
        showCompleted: false,
        category: Category.RECEPTION,
    });
    const [reviewsConfig, setReviewsConfig] = React.useState({
        page: 0,
        take: 10,
        search: "",
        startDate: null,
        endDate: null,
    });

    const debouncedConfig = useDebounce(config, 700);
    const debouncedReviewsConfig = useDebounce(reviewsConfig, 700);
    const { data: reviews, isLoading: isReviewsLoading } = useReviews({ ...debouncedReviewsConfig });

    const onSearch = (e, setState) =>
        config.search !== e.target.value &&
        setState((prevState) => ({ ...prevState, search: e.target.value }));

    const onPeriodChange = (update, setState) => {
        if (update[0] || (update[0] && update[1])) {
            setState((prevState) => ({
                ...prevState,
                startDate: update[0] as never,
                endDate: update[1] ? (update[1] as never) : null,
            }));
        } else {
            setState((prevState) => ({ ...prevState, startDate: null, endDate: null }));
        }
    };

    return (
        <>
            <Paper sx={{ mt: 3, px: 3, py: 4, gap: 2, display: "flex", alignItems: "center" }}>
                <OutlinedInput
                    onChange={(e) => onSearch(e, setReviewsConfig)}
                    placeholder={t("search_by_the_guest")}
                    startAdornment={<Search sx={{ color: "#6B7280", mr: 1 }} />}
                />

                {/* datepicker */}
                <Box sx={{ width: "300px" }}>
                    <DatePicker
                        customInput={<DateRangePickerInput />}
                        placeholderText={t("request_time")}
                        selectsRange={true}
                        startDate={reviewsConfig?.startDate}
                        endDate={reviewsConfig?.endDate}
                        onChange={(update) => onPeriodChange(update, setReviewsConfig)}
                        isClearable={true}
                    />
                </Box>

            </Paper>

            <ReviewRequestDetails
                review={review}
                setReview={setReview}
            />

            {/* TABLE */}
            <EntityTable
                data={reviews?.data?.sort((a, b) => (a.createdAt! > b.createdAt! ? -1 : 1)) || []}
                isLoading={isReviewsLoading}
                columns={reviewColumns as any[]}
                total={reviews?.total}
                take={reviewsConfig.take}
                page={reviewsConfig.page}
                onPageChange={(event: unknown, newPage: number) => {
                    setReviewsConfig((prevState) => ({ ...prevState, page: newPage }));
                }}
                onRowsPerPageChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setReviewsConfig((prevState) => ({ ...prevState, page: 0, take: +event.target.value }));
                }}
                onSelect={(row) => {
                    setReview(row);
                }}
            />
        </>
    );
}

const reviewColumns = [
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
        minWidth: 200,
        format: (value: Date) => {
            if (!value) return;
            return format(new Date(value), dateTimeFormat);
        },
    },
    { key: "text", label: "review", minWidth: 200, format: (value) => value },
];
