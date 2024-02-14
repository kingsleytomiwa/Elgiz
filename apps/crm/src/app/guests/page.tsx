import { Suspense } from "react";
import DataTable, { DataTableFallback } from "./DataTable";
import { parseQuery } from "backend-utils";
import SingleGuest from "./SingleGuest";

export default function Page({ searchParams }: { searchParams: any; }) {
    return (
        <>
            <Suspense fallback={<DataTableFallback />}>
                <DataTable {...parseQuery(searchParams)} />
            </Suspense>

            <Suspense>
                <SingleGuest searchParams={searchParams} />
            </Suspense>
        </>
    );
}
