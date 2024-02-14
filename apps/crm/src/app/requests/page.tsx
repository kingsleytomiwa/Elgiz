import { parseQuery } from "backend-utils";
import DataTable from "./DataTable";
import { Suspense } from "react";
import SingleRequest from "./SingleRequest";

export default async function Requests({
  searchParams
}) {
  return (
    <>
      <Suspense>
        <DataTable
          query={parseQuery(searchParams)}
        />
      </Suspense>

      <Suspense>
        <SingleRequest searchParams={searchParams} />
      </Suspense>
    </>
  );
}
