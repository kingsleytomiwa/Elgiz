import * as React from "react";
import { getUserSession } from "src/app/layout";
import { getRequests, getRequestsArgs } from "src/app/api/requests";
import Table from "./Table";

const DataTable: React.FC<{ query: any; exclude?: string[]; needsPagination?: boolean; }> = async ({ query, ...props }) => {
  const user = await getUserSession();
  const { where, take, page } = getRequestsArgs(query, user!);
  const [requests, total] = await getRequests(where, take, page);

  return (
    <>
      <Table
        requests={requests}
        total={total}
        take={query.take}
        page={query.page}
        {...props}
      />
    </>
  );
};

export default DataTable;
