import TimePicker from "components/Timepicker";
import { Add } from "@mui/icons-material";
import {
  Box,
  Typography,
  CircularProgress,
  TextField,
  Chip,
  Button,
  Snackbar,
  Alert,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import { useFormik } from "formik";
import { useParameters } from "lib/use-fetch";
import { Dialog, Radio } from "ui";
import * as Yup from "yup";
import React from "react";
import { DeliveryPaymentType, Parameter } from "@prisma/client";
import { GreenSwitch } from "components/MobileAppContainer";
import { onUpdate } from "./actions";
import { useSWRConfig } from "swr";
import { useTranslation } from "i18n";

export default function Form({ fields, title, type, isOpened, setIsOpened }) {
  const { data: parameters, isLoading, mutate: mutateParam } = useParameters(type);
  const { mutate } = useSWRConfig();
  const { t } = useTranslation({ ns: "portal" });

  const formik = useFormik<Partial<Parameter> & { submit: null; routeName: string }>({
    initialValues: {
      submit: null,
      cardPayment: true,
      cashPayment: true,
      checkoutPayment: true,
      isDeliveryFree: true,
      spaOpeningTime: parameters?.[0]?.spaOpeningTime,
      spaClosingTime: parameters?.[0]?.spaClosingTime,
      routes: parameters?.[0]?.routes || ([] as string[]),
      routeName: "",
      ...parameters?.[0],
    },
    validationSchema: Yup.object({
      isDeliveryFree: Yup.boolean(),
      deliveryValue: Yup.number().when("isDeliveryFree", {
        is: (isDeliveryFree) => !isDeliveryFree,
        then: (schema) => schema.required("Обязательное поле"),
        otherwise: (schema) => schema.nullable(),
      }),
    }),
    onSubmit: async (
      { submit, spaOpeningTime, spaClosingTime, routeName, ...formParameters },
      helpers
    ) => {
      try {
        await onUpdate({
          ...formParameters,
          type,
          deliveryValue: Number(formParameters?.deliveryValue) || 0,
          ...(formik.values.spaOpeningTime && { spaOpeningTime }),
          ...(formik.values.spaClosingTime && { spaClosingTime }),
        });
        await mutateParam();
        await mutate("/api/parameters?");
        helpers.setSubmitting(false);
        setIsOpened(false);
        formik.resetForm();
      } catch (err) {
        console.log("err :>> ", err);
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: "Error" });
        helpers.setSubmitting(false);
      }
    },
    enableReinitialize: true,
  });

  const handleModalButtonClick = () => {
    setIsOpened(false);
    formik.resetForm();
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Dialog
        isOpened={isOpened}
        isDisabled={formik.isSubmitting || !formik.dirty}
        onCancel={handleModalButtonClick}
        sx={{ py: 3, px: 6, width: "1100px", height: "700px" }}
      >
        <Typography sx={{ fontSize: "16px", mb: 3 }}>{title}</Typography>
        {isLoading && <CircularProgress />}

        {fields.includes("spaOpeningTime") && (
          <>
            <Typography sx={{ mb: 2 }}>{t("work_schedule_fitness_zone")}</Typography>
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
              <TimePicker
                disabled={isLoading}
                onChange={(val) => formik.setFieldValue("spaOpeningTime", val)}
                value={
                  formik.values.spaOpeningTime ? new Date(formik.values.spaOpeningTime) : new Date()
                }
                placeholder="Время открытия"
              />

              <Typography>до</Typography>

              <TimePicker
                disabled={isLoading}
                onChange={(val) => formik.setFieldValue("spaClosingTime", val)}
                value={
                  formik.values.spaClosingTime ? new Date(formik.values.spaClosingTime) : new Date()
                }
                placeholder="Время закрытия"
              />
            </Box>
          </>
        )}

        {fields.includes("isDeliveryFree") && (
          <>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Typography sx={{ fontSize: "14px" }}>{t("paid_delivery")}</Typography>
              <GreenSwitch
                name="isDeliveryFree"
                disabled={isLoading}
                value={!formik.values?.isDeliveryFree}
                checked={!formik.values?.isDeliveryFree}
                onChange={() => {
                  const newState = !formik.values?.isDeliveryFree;

                  formik.setFieldValue("isDeliveryFree", newState);
                  !newState && formik.setFieldValue("deliveryType", DeliveryPaymentType.FIXED);
                }}
              />
            </Box>

            <Box sx={{ paddingLeft: 2 }}>
              {!formik.values.isDeliveryFree && (
                <>
                  <RadioGroup
                    name="deliveryType"
                    value={formik.values.deliveryType}
                    onChange={formik.handleChange}
                  >
                    <FormControlLabel
                      value={DeliveryPaymentType.FIXED}
                      control={<Radio />}
                      label={t("fixed_cost")}
                    />
                    <FormControlLabel
                      value={DeliveryPaymentType.PERCENTAGE}
                      control={<Radio />}
                      label="Процент от заказа"
                    />
                  </RadioGroup>

                  <TextField
                    inputProps={{
                      style: { fontSize: 16 },
                    }}
                    disabled={isLoading}
                    type="number"
                    sx={{ maxWidth: 320, mt: 2 }}
                    fullWidth
                    label={
                      formik.values.deliveryType === DeliveryPaymentType.PERCENTAGE
                        ? `${t("percentage_of_the_order")}, %`
                        : t("cost_of_delivery")
                    }
                    name="deliveryValue"
                    onBlur={formik.handleBlur}
                    onChange={(e) => {
                      formik.setFieldValue("deliveryValue", e.target.value);
                    }}
                    value={formik.values.deliveryValue}
                    error={!!formik.errors.deliveryValue}
                    helperText={formik.errors.deliveryValue}
                  />
                </>
              )}
            </Box>
          </>
        )}

        {fields.includes("paymentMethods") && (
          <>
            <Box sx={{ height: "1px", width: "50%", backgroundColor: "#000", my: 3 }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, minWidth: 500 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography sx={{ fontSize: "14px" }}>
                  {t("ways_to_pay_for_an_order_for_a_guest")}
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Toggle
                    isLoading={isLoading}
                    name={t("payment_in_the_room")}
                    value={formik.values.cashPayment || formik.values.cardPayment}
                    onChange={() => {
                      const newState = !(formik.values.cashPayment || formik.values.cardPayment);
                      formik.setFieldValue("cashPayment", newState);
                      formik.setFieldValue("cardPayment", newState);

                      if (!newState && !formik.values.checkoutPayment) {
                        formik.setFieldValue("checkoutPayment", true);
                      }
                    }}
                  />
                  <Box sx={{ paddingLeft: 2 }}>
                    <Toggle
                      isLoading={isLoading}
                      name={t("cash")}
                      value={formik.values.cashPayment}
                      onChange={() => {
                        formik.setFieldValue("cashPayment", !formik.values.cashPayment);

                        if (formik.values.cashPayment && !formik.values.cardPayment) {
                          formik.setFieldValue("checkoutPayment", true);
                        }
                      }}
                    />
                    <Toggle
                      isLoading={isLoading}
                      name={t("payment_by_card_visa_mastercard")}
                      value={formik.values.cardPayment}
                      onChange={() => {
                        formik.setFieldValue("cardPayment", !formik.values.cardPayment);

                        if (!formik.values.cashPayment && formik.values.cardPayment) {
                          formik.setFieldValue("checkoutPayment", true);
                        }
                      }}
                    />
                  </Box>
                  <Toggle
                    isLoading={isLoading}
                    name={t("payment_at_departure")}
                    value={formik.values.checkoutPayment}
                    onChange={() => {
                      formik.setFieldValue("checkoutPayment", !formik.values.checkoutPayment);

                      if (
                        !formik.values.cashPayment &&
                        !formik.values.cardPayment &&
                        formik.values.checkoutPayment
                      ) {
                        formik.setFieldValue("cashPayment", !formik.values.cashPayment);
                        formik.setFieldValue("cardPayment", !formik.values.cardPayment);
                      }
                    }}
                  />
                </Box>
              </Box>

              {formik.errors.submit && (
                <Typography color="error" sx={{ mt: 4 }} variant="body2">
                  {formik.errors.submit}
                </Typography>
              )}
            </Box>
          </>
        )}

        {fields.includes("reception") && (
          <>
            <Typography sx={{ fontSize: "14px", mb: 3 }}>Пункты назначения трансферов</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, minWidth: 500 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <TextField
                  inputProps={{
                    style: { fontSize: 16 },
                  }}
                  sx={{ maxWidth: 320 }}
                  fullWidth
                  label="Пункт назначения"
                  name="routeName"
                  onBlur={formik.handleBlur}
                  onChange={(e) => {
                    formik.setFieldValue("routeName", e.target.value);
                  }}
                  value={formik.values.routeName}
                  error={Boolean(formik.errors.routeName)}
                />

                <Button
                  startIcon={<Add sx={{ fill: "#2B3467", fontSize: 24 }} />}
                  sx={{ border: "1px solid #2B3467", borderRadius: "5px", height: "32px" }}
                  onClick={() => {
                    if (
                      formik.values.routes?.includes(formik.values.routeName) ||
                      !formik.values.routeName
                    ) {
                      formik.setFieldError("routeName", "!");
                      return;
                    }
                    formik.setFieldValue("routeName", "");
                    formik.setFieldValue("routes", [
                      ...(formik.values.routes || []),
                      formik.values.routeName,
                    ]);
                  }}
                >
                  <Typography sx={{ color: "#2B3467", ml: 0.5, fontSize: "13px" }}>
                    Добавить
                  </Typography>
                </Button>
                <Snackbar
                  open={!!formik.errors.routeName}
                  anchorOrigin={{ vertical: "top", horizontal: "center" }}
                  key={"top" + "center"}
                >
                  <Alert severity="error" variant="filled">
                    Этот пункт уже существует либо нужно заполнить поле
                  </Alert>
                </Snackbar>
              </Box>

              {formik.values.routes?.map((route, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <Chip
                    label={route}
                    color="primary"
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      minWidth: "130px",
                      color: "#FDFFF1",
                      backgroundColor: "#2B3467",
                      fontSize: "13px",
                    }}
                    onDelete={() => {
                      formik.setFieldValue(
                        "routes",
                        formik.values.routes?.filter((r) => r !== route)
                      );
                    }}
                  />
                </Box>
              ))}

              {formik.errors.submit && (
                <Typography color="error" sx={{ mt: 4 }} variant="body2">
                  {formik.errors.submit}
                </Typography>
              )}
            </Box>
          </>
        )}
      </Dialog>
    </form>
  );
}

const Toggle = ({ value, onChange, name, isLoading }) => (
  <Box>
    <Box
      sx={{ display: "flex", alignItems: "center", gap: 3, height: "30px", cursor: "pointer" }}
      onClick={onChange}
    >
      <Typography sx={{ fontSize: "14px" }}>{name}</Typography>
      <GreenSwitch disabled={isLoading} checked={value} />
    </Box>
  </Box>
);
