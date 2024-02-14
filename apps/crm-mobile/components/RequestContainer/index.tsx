"use client";

import { Box, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import {
  IroningRequestType,
  RequestPaymentPlaceType,
  RequestPaymentPlaceTypeLabel,
  RequestPaymentTypeLabel,
  RequestStaffTypeLabel,
  RequestTypeLabel,
  dateTimeFormat,
  getNextStatus,
} from "utils";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Request, RequestStatus, RequestType } from "@prisma/client";
import ButtonUpdateStatus from "./buttonUpdateStatus";
import { format } from "date-fns";
import Timer from "../Timer";
import { useTranslation } from "i18n";

const RequestContainer = ({ request }: { request: Request; }) => {
  const { t, i18n } = useTranslation({ ns: "mobile-portal" });
  return (
    <Box sx={{ pt: "38px", px: "16px" }}>
      <Link
        href={"/"}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          textDecoration: "none",
          color: "#343A40",
          width: "fit-content",
        }}
      >
        <ArrowBackIcon sx={{ color: "#343A40" }} />
        <Typography>{t("back")}</Typography>
      </Link>
      <Box sx={{ px: "16px", pt: "49px" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontWeight: 600, fontSize: "18px" }}>
            {t(RequestTypeLabel[request?.type as keyof typeof RequestTypeLabel])}
          </Typography>
          <Typography sx={{ fontWeight: 600, fontSize: "18px" }}>{request.numericalId}</Typography>
        </Box>
        <Typography sx={{ mt: "24px", mb: "12px" }}>{(request as any)?.guest.name}</Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: "12px",
          }}
        >
          <Typography>
            {t("room")} {(request as any)?.guest.room}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <AccessTimeIcon sx={{ color: "#3F51B5" }} />
            <Timer creationDate={request.createdAt} />
          </Box>
        </Box>
        <Typography>
          {t("status_now")} {t(getNextStatus(request?.status).currentStatus.toLowerCase())}
        </Typography>

        {[RequestStatus.ACCEPTED, RequestStatus.CREATED].includes(request?.status as any) && (
          <ButtonUpdateStatus id={request.id} status={request.status} />
        )}

        <Box
          sx={{
            borderTop: "1px solid #343A40",
            borderBottom: "1px solid #343A40",
            my: "24px",
            py: "24px",
          }}
        >
          <Typography sx={{ fontWeight: 600, fontSize: "18px", mb: "24px" }}>
            {t("notes")}
          </Typography>
          {/* @ts-ignore */}
          {request.data?.specificServeTime ? (
            request.type === RequestType.TAXI ? (
              <Typography>
                <span>Время подачи: </span>
                {/* @ts-ignore */}
                {format(new Date(request.data?.specificServeTime), dateTimeFormat)}
              </Typography>
            ) : request.type === RequestType.CLEANING ? (
              <Typography>
                <span>Желаемое время уборки: </span>
                {/* @ts-ignore */}
                {format(new Date(request.data?.specificServeTime), "HH:mm")}
              </Typography>
            ) : (
              <Typography>
                <span>Время подачи: </span>
                {/* @ts-ignore */}
                {format(new Date(request.data?.specificServeTime), "HH:mm")}
              </Typography>
            )
          ) : request.type === RequestType.PREPARE_SAUNA ? (
            <>
              <Typography>Время брорирования</Typography>
              <Typography>{format(new Date(request.reserveStart!), dateTimeFormat)}</Typography>
            </>
          ) : request.type === RequestType.FOOD_ORDER ? (
            <>
              <Typography>
                {/* @ts-ignore */}
                Оплата: {RequestPaymentPlaceTypeLabel[request?.data?.paymentPlace]}
              </Typography>
              {/* @ts-ignore */}
              {request?.data?.paymentPlace === RequestPaymentPlaceType.ROOM && (
                <Typography>
                  {/* @ts-ignore */}
                  {RequestPaymentTypeLabel[request?.data?.paymentType]}
                </Typography>
              )}
            </>
          ) : (
            <Typography sx={{ opacity: 0.25 }}>{t("no notes")}</Typography>
          )}
        </Box>
        <Typography sx={{ fontWeight: 600, fontSize: "18px", mb: "24px" }}>
          {t("request")}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {request.type === RequestType.TAXI && (
            /* @ts-ignore */
            <Typography>{request.data.transferTo}</Typography>
          )}
          {request.type === RequestType.PREPARE_SAUNA &&
            /* @ts-ignore */
            request.data.products.map((item, i) => (
              <Typography key={i}>
                <span>{item.name?.[i18n?.language]}</span>
              </Typography>
            ))}
          {request.type === RequestType.FOOD_ORDER &&
            /* @ts-ignore */
            request.data.products.map((item, i) => (
              <Typography key={i}>
                <span style={{ marginRight: "24px" }}>{item.count}x</span>
                <span>
                  {item.name?.[i18n?.language]}
                  {item.weight && `,${item.weight}g`}
                </span>
              </Typography>
            ))}
          {request.type === RequestType.SHOP &&
            /* @ts-ignore */
            request.data.products.map((item, i) => (
              <Typography key={i}>
                <span style={{ marginRight: "24px" }}>{item.count}x</span>
                <span>{item.name?.[i18n?.language]}</span>
              </Typography>
            ))}
          {request.type === RequestType.BRING_DISHES &&
            /* @ts-ignore */
            request.data.products.map((item, i) => (
              <Typography key={i}>
                <span style={{ marginRight: "24px" }}>{item.count}x</span>
                <span>{item.name?.[i18n?.language]}</span>
              </Typography>
            ))}
          {request.type === RequestType.IRONING &&
            /* @ts-ignore */
            (request.data.ironing === IroningRequestType.BRING ? "Принести" : "Забрать")}
          {request.type === RequestType.STAFF_HELP &&
            /* @ts-ignore */
            (request.data.issue === "other"
              ? /* @ts-ignore */
              request.data.issueText
              : /* @ts-ignore */
              RequestStaffTypeLabel[request.data.issue])}
        </Box>
      </Box>
    </Box>
  );
};

export default RequestContainer;
