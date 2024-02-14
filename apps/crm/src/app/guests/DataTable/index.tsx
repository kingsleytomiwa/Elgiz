import { ownerAuthOptions } from "backend-utils";
import EntityTable, { Column } from "components/EntityTable";
import { format } from "date-fns";
import { findGuests } from "db";
import { getServerSession } from "next-auth";
import { cache } from "react";

const _findGuests = cache(findGuests);
type Guest = Awaited<ReturnType<typeof findGuests>>["data"][0] & { startDate: string; endDate: string; };

const COLUMNS = [
    { key: 'name', label: "guest", minWidth: 200 },
    { key: 'email', label: "el_mail", minWidth: 200 },
    { key: 'room', label: "room", minWidth: 80 },
    { key: 'phone', label: "telephone", minWidth: 100 },
    { key: 'code', label: "code", minWidth: 100 },
    { key: 'startDate', label: "arrival_date", minWidth: 120 },
    { key: 'endDate', label: "date_of_departure", minWidth: 120 },
    { key: 'requests', label: "requests", minWidth: 70 },
] as Column<Guest>[];

function getPeriodFilter(key: 'startDate' | 'endDate', start?: string, end?: string) {
    const filter = {} as { gte: Date, lte: Date; };

    if (typeof start === "string") {
        filter.gte = new Date(start);
    }

    if (typeof end === "string") {
        filter.lte = new Date(end);
    }

    if (Object.keys(filter).length) {
        return {
            [key]: filter
        };
    }

    return {};
}

const DataTable = async ({ page, search, skip, take, startDateStart, startDateEnd, endDateStart, endDateEnd, suspended }) => {
    const session = await getServerSession(ownerAuthOptions);

    const { data, total } = await _findGuests(
        {
            name: {
                contains: search as string,
                mode: "insensitive",
            },

            hotelId: session?.user.hotelId as string,

            suspended: suspended === "true" ? true : false,

            ...getPeriodFilter('startDate', startDateStart, startDateEnd),
            ...getPeriodFilter('endDate', endDateStart, endDateEnd),
        },
        { skip, take }
    );

    return (
        <EntityTable
            data={data.map(item => ({
                ...item,
                startDate: format(item.startDate, "dd/MM/yyyy HH:mm"),
                endDate: format(item.endDate, "dd/MM/yyyy HH:mm"),
            })) as Guest[]}
            isLoading={false}
            columns={COLUMNS}
            total={total}
            take={take}
            page={page}
        />
    );
};

export function DataTableFallback() {
    return (
        <EntityTable
            data={[]}
            isLoading={true}
            columns={COLUMNS}
            needsPagination={false}
            take={10}
        />
    );
}

export default DataTable;
