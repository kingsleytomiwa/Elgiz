"use client";

import { Box, Typography } from "@mui/material";
import { Guest, Request } from "@prisma/client";
import { RequestTypeLabel } from "utils";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Link from "next/link";
import Burger from "./burger";
import RequestIcon from "../icons/RequestIcon";
import ChatIcon from "../icons/ChatIcon";
import Timer from "../Timer";
import { useTranslation } from "i18n";

interface Props {
  acceptedData: Request[];
  createdData: Request[];
  name: string;
}

const RequestsContainer: React.FC<Props> = ({ acceptedData, createdData, name }) => {
  const { t } = useTranslation({ ns: "mobile-portal" });

  return (
    <Box
      sx={{
        px: "16px",
        width: "100%",
        py: "16px",
      }}
    >
      <Box sx={{ pb: "80px" }}>
        <Box sx={{ display: "flex", justifyContent: "end" }}>
          <Burger name={name} />
        </Box>
        <Typography
          sx={{
            mt: "13px",
            textAlign: "center",
            fontWeight: "700",
            fontSize: "18px",
          }}
        >
          {t("orders")}
        </Typography>
        <Box>
          <Typography sx={{ mt: "24px", fontWeight: 600, fontSize: "18px" }}>
            {t("new")} ({createdData?.length})
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              mt: "16px",
              gap: "8px",
            }}
          >
            {createdData?.map((item, i) => (
              <RequestItem
                key={i}
                type={item.type}
                guest={(item as any)?.guest}
                createDate={item.createdAt}
                number={item.numericalId}
                modeBlue
                id={item.id}
              />
            ))}
          </Box>
        </Box>
        <Box sx={{ color: "#343A40" }}>
          <Typography sx={{ mt: "32px", fontWeight: 600, fontSize: "18px" }}>
            {t("active")} ({acceptedData?.length})
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              mt: "16px",
              gap: "8px",
            }}
          >
            {acceptedData?.map((item, i) => (
              <RequestItem
                key={i}
                type={item.type}
                guest={(item as any)?.guest}
                createDate={item.createdAt}
                number={item.numericalId}
                id={item.id}
              />
            ))}
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          background: "white",
          py: "23px",
          width: "100%",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <Link href={"/"}>
          <RequestIcon fill="#2B3467" />
        </Link>
        <Link href={"/chat"}>
          <ChatIcon fill="#B3B9C1" />
        </Link>
      </Box>
    </Box>
  );
};

export default RequestsContainer;

interface RequestItemProps {
  type: string;
  guest: Partial<Guest>;
  createDate: Date;
  modeBlue?: boolean;
  id: string;
  number: number;
}

const RequestItem: React.FC<RequestItemProps> = ({
  type,
  guest,
  createDate,
  modeBlue = false,
  id,
  number,
}) => {
  const { t } = useTranslation({ ns: "mobile-portal" });

  return (
    <Link
      href={`/request/${id}`}
      style={{
        border: "1px solid #3F51B5",
        padding: "10px 16px",
        width: "100%",
        background: modeBlue ? "#3F51B5" : "white",
        color: modeBlue ? "white" : "#343A40",
        textDecoration: "none",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontWeight: 600, fontSize: "18px" }}>
          {t(RequestTypeLabel[type as keyof typeof RequestTypeLabel])}
        </Typography>
        <Typography sx={{ fontWeight: 600, fontSize: "18px" }}>{number}</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          my: "8px",
        }}
      >
        <Typography>{guest?.name}</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography>
          {t("room")}: {guest?.room}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <AccessTimeIcon sx={{ color: modeBlue ? "white" : "#3F51B5" }} />
          <Timer creationDate={createDate} />
        </Box>
      </Box>
    </Link>
  );
};
