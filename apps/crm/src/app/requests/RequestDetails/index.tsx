"use client";

import { Box, Button, Typography } from "@mui/material";
import { Category, RequestStatus, RequestType } from "@prisma/client";
import { CategoryLabel, IroningRequestType, RequestPaymentTypeLabel, RequestTypeLabel, dateTimeFormat } from "utils";
import { CellStatus } from "ui";
import React, { useCallback, useMemo, useState } from "react";
import EntityTable from "components/EntityTable";
import { format } from "date-fns";
import _RequestDetails from "components/RequestDetails";
import { getNextStatus } from "utils";
import { RequestWithHistory } from "utils/models";
import { deleteRequest, updateStatus } from "./actions";
import { useHandleParams } from "src/hooks";
import { useTranslation } from "i18n";
import PaymentStateButton from "./PaymentStateButton";
import Detail from "components/Detail";
import { groupBy } from "lodash";
import RequestTimer from "components/RequestTimer";

type Props = {
  request: RequestWithHistory;
};

const ServiceDescription: React.FC<Props> = ({ request }) => {
  const { t } = useTranslation({ ns: "portal" });

  switch (request.type) {
    case RequestType.IRONING: {
      // TODO: change text to i18n
      return t((request.data as any).ironing === IroningRequestType.BRING ? 'bring_iron' : 'take_iron');
    }
    case RequestType.STAFF_HELP: {
      // TODO: change text to i18n
      return t(`staff_help_${(request.data as any).issue}`);
    }
    default: {
      return t(RequestTypeLabel[request.type]);
    }
  }
};

const RequestDetails: React.FC<Props> = ({ request }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const handleParams = useHandleParams();
  const { t, i18n } = useTranslation({ ns: "portal" });

  const handleClose = useCallback(() => handleParams([["selected", ""]], true), [handleParams]);

  const onChangeStatus = useCallback(async () => {
    try {
      setIsLoading(true);

      const { nextStatus } = getNextStatus(request!.status!);
      if (!nextStatus || request.status === RequestStatus.COMPLETED) return;

      await updateStatus(request.id, request.guestId);
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
  }, [request, setIsLoading]);

  const dateOfRequestAccomplishment = useMemo(
    () => request.history?.find((element) => element.status === "COMPLETED")?.changedAt,
    [request.history]
  );

  const details = useMemo(
    () => {
      const basicDetails: any = [
        {
          title: "request_number",
          description: request?.numericalId,
        },
        {
          title: "waiting_time",
          description: <RequestTimer
            createdAt={request.createdAt}
            completedAt={request.completedAt}
          />,
        },
        {
          title: "request_category",
          description: t(CategoryLabel[request.section]),
        },
        {
          title: "request",
          description: <ServiceDescription request={request} />,
        },
        {
          title: "guest",
          //@ts-ignore
          description: request?.guest?.name,
        },
        {
          title: "room",
          //@ts-ignore
          description: request?.guest?.room,
        },
        {
          title: "request_time",
          description: format(new Date(request.createdAt), dateTimeFormat),
        },
        {
          title: "completion_of_the_request",
          description: dateOfRequestAccomplishment
            ? format(new Date(dateOfRequestAccomplishment), dateTimeFormat)
            : "-",
        },
      ];

      if ([Category.RESTAURANT, Category.SHOP, Category.SPA].includes(request.section as any)) {
        basicDetails.push({
          title: "payment_method",
          //@ts-ignore
          description: t(RequestPaymentTypeLabel[request?.data?.paymentType]),
        });
        basicDetails.push(
          {
            title: "payment_state",
            description: (
              <PaymentStateButton request={request} />
            ),
          });
      }

      if (request.section === Category.SPA) {
        basicDetails.push({
          title: "booking_time",
          // @ts-ignore
          description: format(new Date(request?.reserveStart), dateTimeFormat),
        });

        basicDetails.push({
          title: "service",
          // @ts-ignore
          description: request?.data?.products?.[0]?.name?.[i18n.language],
        });

        basicDetails.push({
          title: "master",
          //@ts-ignore
          description: request?.worker?.name,
          containerSx: { gridColumn: "span 2" },
        });
      }

      if (request.type === RequestType.TAXI) {
        basicDetails.push({
          title: "Пункт назначения",
          // @ts-ignore
          description: request?.data?.transferTo,
        });
      }

      if ((request?.data as any)?.specificServeTime) {
        basicDetails.push({
          title: "model_time",
          description: request?.completedAt
            ? format(new Date(request.completedAt), dateTimeFormat)
            : format(new Date((request?.data as any)?.specificServeTime ?? new Date()), dateTimeFormat),
        });
      }

      return basicDetails;
    },
    [dateOfRequestAccomplishment, request, t, i18n.language]
  );

  const catalog = useMemo(() => {
    switch (request.section) {
      case Category.RESTAURANT: {
        return (
          <>
            {Object.entries(
              /* @ts-ignore */
              groupBy(request?.data?.products, (dish) => dish.category?.name?.[i18n.language])
            ).map(([category, products]) => {
              // TODO! Category returns undefined as string
              const label = category === "undefined" ? "" : category;
              return (
                <Box key={label} sx={{ mb: 2 }}>
                  <Detail
                    title={label}
                    description={
                      <Box
                        sx={{ display: "grid", gridTemplateRows: "auto auto", maxWidth: "220px" }}
                      >
                        {(products as any)?.map((product) => (
                          <Box
                            key={product.id}
                            sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}
                          >
                            <Typography sx={{ mr: 1 }}>
                              {product.name?.[i18n.language] ?? product.name}
                            </Typography>
                            <Typography>{product.count} шт.</Typography>
                          </Box>
                        ))}
                      </Box>
                    }
                  />
                </Box>
              );
            })}
          </>
        );
      }

      case Category.SHOP: {
        return (
          <Box sx={{ display: "grid", gridTemplateRows: "auto auto", maxWidth: "220px" }}>
            {/* @ts-ignore */}
            {request.data?.products?.map((prod) => (
              <Box key={prod.id} sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
                <Typography sx={{ mr: 1 }}>{prod?.name?.[i18n.language] ?? prod.name}</Typography>

                <Typography>{prod.count} шт.</Typography>
              </Box>
            ))}
          </Box>
        );
      }
    }
  }, [request, i18n.language]);

  const onDelete = useCallback(async () => {
    setIsDeleting(true);

    try {
      await deleteRequest(request.id);
    } catch (error) {
      console.error(error);
    }

    setIsDeleting(false);
    handleClose();
  }, [request, handleClose]);

  const historyItems = useMemo(() => {
    const items = request?.history || [];

    if (!items.find(x => x.status === RequestStatus.CREATED)) {
      items.push({
        id: "1",
        status: RequestStatus.CREATED,
        changedAt: request.createdAt,
      } as any);
    }

    return items.sort((a, b) => (a.changedAt > b.changedAt ? -1 : 1));
  }, [request?.history, request.createdAt]);

  return (
    <_RequestDetails
      details={details}
      title={t("request_details")}
      isOpened
      onClose={handleClose}
      dialogProps={{
        title: t("are_you_sure_you_want_to_delete_the_request"),
        isDisabled: isDeleting,
        onSubmit: onDelete,
      }}
    >
      {catalog && (
        <Box sx={{
          display: "flex",
          justifyContent: "center",
          pb: "12px",
          borderBottom: "1px solid #00000040",
        }}>
          <Box sx={{ maxWidth: "420px", width: "100%", mt: 1 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#DDE3EE",
                "&:hover": { backgroundColor: "#DDE3EE" },
                color: "#121828",
                fontWeight: 700,
                fontSize: "14px",
                borderRadius: "100px",
                width: "100%",
                mb: 1,
                pointerEvents: "none"
              }}
            >
              {t("list_of_goods")}
            </Button>
            {catalog}
          </Box>
        </Box>
      )}

      <Box sx={{ width: "100%" }}>
        {getNextStatus(request.status).nextStatus && (
          <Box sx={{ display: "flex", width: "100%", justifyContent: "center", mb: 2, mt: 1 }}>
            <Button
              variant="contained"
              onClick={onChangeStatus}
              disabled={isLoading}
              sx={{ backgroundColor: "#3F51B5", borderRadius: "100px" }}
            >
              {t("mark")} {t(getNextStatus(request.status).nextStatus.toLowerCase())}
            </Button>
          </Box>
        )}

        <EntityTable
          needsPagination={false}
          data={historyItems}
          isLoading={false}
          columns={[
            {
              key: "status",
              label: "status",
              minWidth: 200,
              //@ts-ignore
              format: (status: string) => (
                <CellStatus
                  text={`${Object.values(RequestStatus).findIndex((el) => el === status) + 1
                    } - ${t(status.toLowerCase())}`}
                />
              ),
            },
            {
              key: "changedAt",
              label: "time",
              minWidth: 200,
              format: (date: string) => format(new Date(date), dateTimeFormat),
            },
            {
              key: "staff",
              label: "who_fulfilled",
              minWidth: 200,
              format: (staff: { name: string; }) => staff?.name || " ",
            },
          ]}
        />
      </Box>
    </_RequestDetails>
  );
};

export default RequestDetails;
