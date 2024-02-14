"use client";

import * as React from "react";
import {
    Box,
    Paper,
    Stack,
    debounce,
} from "@mui/material";
import {
    PeopleOutlined,
    OtherHouses,
} from "@mui/icons-material";
import { Hotel, Category } from "@prisma/client";
import { CardsRow } from "ui";
import DatePicker from "react-datepicker";
import { DateRangePickerInput } from "ui";
import { Count } from "@prisma/client/runtime/library";
import { useCategories, useRequests } from "lib/use-fetch";
import { RequestTypeLabelDefault } from "utils";
import { categoriesColumns, createCategoriesData, createRequestsData, requestsColumns } from "src/app/hotel/[id]/HotelStatistics/Table/utils";
import Table from "src/app/hotel/[id]/HotelStatistics/Table";

interface Props {
    hotel: Hotel;
}

const HotelStatistics: React.FC<Props> = ({ hotel }) => {
    const [query, setQuery] = React.useState<{
        startDate: Date | null;
        endDate: Date | null;
        category: string;
        hotelId: string;
    }>({
        startDate: null,
        endDate: null,
        category: "",
        hotelId: hotel?.id ?? "",
    });

    const { data: categoriesData, isLoading: isCategoriesLoading } = useCategories({
        // change only if entire period is selected
        startDate: query?.endDate ? query?.startDate : null,
        endDate: query?.endDate,
        hotelId: query.hotelId,
    });

    const categoriesRows = React.useMemo(() => {
        return (categoriesData?.data as any[])?.map(({ section, _count }) => {
            return createCategoriesData(section, (_count as Count<{ section: string; }>).section ?? 0);
        });
    }, [categoriesData]);

    const { data: requestsData, isLoading: isRequestsLoading } = useRequests({
        ...query,
        startDate: query?.endDate ? query?.startDate : null,
    });

    const requestsRows = React.useMemo(() => {
        return (requestsData?.data as any[])?.map(({ type, _count }) => {
            return createRequestsData(
                type,
                RequestTypeLabelDefault[type],
                (_count as Count<{ type: string; }>).type ?? 0
            );
        });
    }, [requestsData]);

    const onCategoryChange = debounce((category: Category) => {
        if (query?.category === category) return;

        return setQuery((prevState) => ({ ...prevState, category }));
    }, 500);

    const onPeriodChange = (update) => {
        if (update[0] || (update[0] && update[1])) {
            setQuery((prevState) => ({
                ...prevState,
                startDate: update[0] as never,
                endDate: update[1] ? (update[1] as never) : null,
            }));
        } else {
            setQuery((prevState) => ({ ...prevState, startDate: null, endDate: null }));
        }
    };

    React.useEffect(() => {
        if (!hotel.id) return;

        // select the first category on the first render
        !query?.category &&
            categoriesRows?.[0]?.id &&
            setQuery((prevState) => ({ ...prevState, category: categoriesRows[0].id as Category }));
    }, [hotel.id, categoriesRows, query?.category]);


    return (
        <>
            <CardsRow
                cards={[
                    {
                        title: "всего активных запросов",
                        value: (hotel as Hotel & { _count: { requests: number; }; })._count.requests,
                        Icon: PeopleOutlined,
                    },
                    {
                        title: "Всего гостей",
                        value: hotel.guestsAmount ?? 0,
                        Icon: PeopleOutlined,
                    },
                    {
                        title: "номеров доступно",
                        value: hotel.rooms ?? 0,
                        Icon: OtherHouses,
                    },
                ]}
            />

            {/* FILTERS */}
            <Paper sx={{ my: 3, px: 3, py: 4 }}>
                {/* datepicker */}
                <Box sx={{ width: "300px" }}>
                    <DatePicker
                        customInput={<DateRangePickerInput />}
                        placeholderText="Период"
                        selectsRange={true}
                        startDate={query?.startDate}
                        endDate={query?.endDate}
                        onChange={onPeriodChange}
                        isClearable={true}
                    />
                </Box>
            </Paper>

            <Stack direction="row" spacing="34px">
                <Box sx={{ width: "100%", maxWidth: "400px" }}>
                    <Table
                        columns={categoriesColumns}
                        rows={categoriesRows ?? []}
                        onRowClick={(category) => onCategoryChange(category)}
                        activeRow={query?.category}
                        isLoading={isCategoriesLoading}
                    />
                </Box>

                <Box sx={{ maxWidth: "400px" }}>
                    <Table
                        columns={requestsColumns}
                        rows={requestsRows ?? []}
                        onRowClick={() => { }}
                        activeRow=""
                        isLoading={isRequestsLoading}
                    />
                </Box>
            </Stack>
        </>
    );
};

export default HotelStatistics;
