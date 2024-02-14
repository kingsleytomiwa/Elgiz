"use client";

import { Button } from "@mui/material";
import { RequestStatus } from "@prisma/client";
import { useTranslation } from "i18n";
import { useState } from "react";
import { updateStatus } from "src/app/request/[slug]/action";
import { getNextStatus } from "utils";

const ButtonUpdateStatus = ({
  status,
  id,
}: {
  status: RequestStatus;
  id: string;
}) => {
  const { t } = useTranslation({ ns: "mobile-portal" });

  const valueStatus =
    status === RequestStatus.CREATED
      ? RequestStatus.ACCEPTED
      : RequestStatus.COMPLETED;

  return (
    <Button
      onClick={() => updateStatus(id)}
      sx={{
        mt: "16px",
        width: "100%",
        py: "15px",
        background: "#3F51B5",
        color: "white",
        fontWeight: 700,
        borderRadius: "100px",
        "&:hover": {
          background: "#3F51B5",
        },
      }}
    >
      {t("mark")}: {t(getNextStatus(valueStatus).currentStatus.toLowerCase())}
    </Button>
  );
};

export default ButtonUpdateStatus;
