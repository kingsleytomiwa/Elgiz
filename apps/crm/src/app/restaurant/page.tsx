import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ownerAuthOptions, parseQuery } from "backend-utils";
import Filters from "../requests/Filters";
import { Category, RequestType } from "@prisma/client";
import AddRequestForm from "components/AddRequestForm";
import { Suspense } from "react";
import DataTable from "../requests/DataTable";
import SingleRequest from "../requests/SingleRequest";

export default async function Page({ searchParams }) {
  const session = await getServerSession(ownerAuthOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <>
      <Filters
        categories={[]}
        types={[RequestType.WASH_DISHES, RequestType.FOOD_ORDER, RequestType.BRING_DISHES]}
      />

      <AddRequestForm
        staffId={session.user?.id!}
        openWithCategory={RequestType.FOOD_ORDER}
        openWithSection={Category.RESTAURANT}
      />

      <Suspense>
        <DataTable
          query={parseQuery({ ...searchParams, category: Category.RESTAURANT })}
          exclude={["service", "master"]}
        />
      </Suspense>

      <Suspense>
        <SingleRequest searchParams={searchParams} />
      </Suspense>
    </>
  );
}
