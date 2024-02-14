"use client";

import * as React from "react";
import { Add } from "@mui/icons-material";
import { Button, OutlinedInput, Typography } from "@mui/material";
import { Dialog } from "ui";
import { useFormik } from "formik";
import * as Yup from "yup";
import * as dateFns from "date-fns";
import DatePicker from "react-datepicker";
import { DateRangePickerInput } from "ui";
import { onAddPayment } from "../../actions";
import { useSWRConfig } from "swr";

export default function AddPaymentForm({ hotelId }: { hotelId: string; }) {
  const [isOpened, setIsOpened] = React.useState(false);
  const { mutate } = useSWRConfig();

  const formik = useFormik({
    initialValues: {
      submit: null,
      startDate: new Date(),
      daysAmount: 0
    },
    validationSchema: Yup.object({
      startDate: Yup
        .date()
        .required('Start date is required'),
      daysAmount: Yup
        .number()
        .required('Days amount is required'),
    }),
    onSubmit: async (values, helpers) => {
      try {
        await onAddPayment(values, hotelId);

        helpers.setSubmitting(false);
        setIsOpened(false);

        mutate(`/api/hotel-payments?id=${hotelId}`);
      } catch (err) {
        console.log("err :>> ", err);
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: "Error" });
        helpers.setSubmitting(false);
      }
    }
  });

  const handleModalButtonClick = () => {
    setIsOpened(false);
    formik.resetForm();
  };

  const willBepaidUntil = dateFns.addDays(formik.values.startDate, formik.values.daysAmount);

  return (
    <>
      <Button
        startIcon={<Add sx={{ fill: "#2B3467", fontSize: 24 }} />}
        sx={{ border: "1px solid #2B3467", my: 4, borderRadius: "5px" }}
        onClick={() => setIsOpened(true)}
      >
        <Typography sx={{ color: "#2B3467", ml: 0.5, fontSize: "13px" }}>
          Добавить платеж
        </Typography>
      </Button>

      <form
        onSubmit={formik.handleSubmit}
      >
        <Dialog
          isOpened={isOpened}
          isDisabled={formik.isSubmitting || !formik.dirty}
          onCancel={handleModalButtonClick}
          sx={{ py: 3, px: 6 }}
        >
          <DatePicker
            customInput={<DateRangePickerInput />}
            selected={formik.values.startDate}
            onChange={(date) => formik.setFieldValue("startDate", date)}
          />

          <OutlinedInput
            type="number"
            onChange={({ target: { value } }) => formik.setFieldValue("daysAmount", value)}
            placeholder="Количество дней подписки"
            sx={{
              width: "100%",
              my: 2,
            }}
          />
          <Typography
            variant="body1"
            sx={{ fontSize: 16 }}
          >
            Подписка будет активна до: {dateFns.format(willBepaidUntil, "dd/MM/yyyy")}
          </Typography>

          {formik.errors.submit && (
            <Typography
              color="error"
              sx={{ mt: 4 }}
              variant="body2"
            >
              {formik.errors.submit}
            </Typography>
          )}
        </Dialog>
      </form>
    </>
  );
}
