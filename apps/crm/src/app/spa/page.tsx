import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ownerAuthOptions, parseQuery } from "backend-utils";
import { Category, RequestType } from "@prisma/client";
import AddRequestForm from "components/AddRequestForm";
import { Suspense } from "react";
import DataTable from "../requests/DataTable";
import Filters from "./Filters";
import SingleRequest from "../requests/SingleRequest";

export default async function Page({ searchParams }) {
  const session = await getServerSession(ownerAuthOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <>
      <Filters />

      <AddRequestForm
        staffId={session.user?.id!}
        openWithCategory={RequestType.PREPARE_SAUNA}
        openWithSection={Category.SPA}
      />

      <Suspense>
        <DataTable
          query={parseQuery({ ...searchParams, category: Category.SPA })}
          exclude={["request_category", "request"]}
        />
      </Suspense>

      <Suspense>
        <SingleRequest searchParams={searchParams} />
      </Suspense>
    </>
  );
}
