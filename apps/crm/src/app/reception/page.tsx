import { redirect } from "next/navigation";
import { getUserSession } from "../layout";
import Filters from "../requests/Filters";
import { Category, RequestType } from "@prisma/client";
import { Suspense } from "react";
import DataTable from "../requests/DataTable";
import { parseQuery } from "backend-utils";
import SingleRequest from "../requests/SingleRequest";
import AddRequestForm from "components/AddRequestForm";

export default async function Reception({ searchParams }) {
  const session = await getUserSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <>
      <Filters
        categories={[]}
        types={[RequestType.TAXI, RequestType.OPEN_PARKING]}
      />

      <AddRequestForm
        staffId={session.user.id}
        openWithCategory={RequestType.TAXI}
        openWithSection={Category.RECEPTION}
      />

      <Suspense>
        <DataTable
          query={parseQuery({ ...searchParams, category: Category.RECEPTION })}
        />
      </Suspense>

      <Suspense>
        <SingleRequest searchParams={searchParams} />
      </Suspense>
    </>
  );
}
