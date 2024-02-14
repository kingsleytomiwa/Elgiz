
import { Box, Toolbar } from "@mui/material";
import React, { Suspense } from "react";

import Heading from "components/Heading";
import DashboardWrap from "components/DashboardWrap";
import DataTable from "./requests/DataTable";
import SingleRequest from "./requests/SingleRequest";
import DashboardMetrics from "components/DashboardMetrics";

export default async function Page({ searchParams }) {
  return (
    <>
      <Toolbar />
      <Heading label="control_panel" />

      <Box sx={{ mb: 3 }}>
        <DashboardMetrics />
      </Box>

      <DashboardWrap>
        <Suspense>
          <DataTable
            query={{ take: 6, page: 0 }}
            exclude={['payment', 'service', 'master']}
            needsPagination={false}
          />
        </Suspense>
      </DashboardWrap>

      <Suspense>
        <SingleRequest searchParams={searchParams} />
      </Suspense>
    </>
  );
}
