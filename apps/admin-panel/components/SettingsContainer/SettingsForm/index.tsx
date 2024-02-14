import * as React from "react";
import { Box, OutlinedInput, Typography, Stack, Button } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { onUpdateSettings } from "../actions";

export type Settings = {
  notificateInAdvance: number;
  autostopSubscriptionIn: number;
};

export default function SettingsForm({ defaultValues, isLoading }: { defaultValues?: Settings; isLoading?: boolean }) {
  const { back } = useRouter();

  const formik = useFormik({
    initialValues: {
      submit: null,
      notificateInAdvance: defaultValues?.notificateInAdvance ?? 0,
      autostopSubscriptionIn: defaultValues?.autostopSubscriptionIn ?? 0,
    },
    validationSchema: Yup.object({
      notificateInAdvance: Yup.number(),
      autostopSubscriptionIn: Yup.number()
    }),
    onSubmit: async ({ submit, ...values }, helpers) => {
      try {
        await onUpdateSettings(values);

        helpers.setSubmitting(false);
      } catch (err) {
        console.log("err :>> ", err);
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: "Error" });
        helpers.setSubmitting(false);
      }
    }
  });

  React.useEffect(() => {
    if (defaultValues) {
      formik.resetForm({ values: { submit: null, ...defaultValues } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues])

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, fontSize: "18px", lineHeight: "44px" }}
          >
            Напоминание об оплате
          </Typography>
          <OutlinedInput
            disabled={isLoading}
            name="notificateInAdvance"
            type="number"
            onChange={({ target: { value } }) => formik.setFieldValue("notificateInAdvance", +value)}
            value={formik.values.notificateInAdvance}
            placeholder="За сколько дней напомнить"
            sx={{
              width: "100%",
              maxWidth: "320px",
              my: 2,
            }}
          />
        </Box>

        <Typography
          variant="h5"
          sx={{ fontWeight: 700, fontSize: "18px", lineHeight: "44px" }}
        >
          Автоматическая остановка подписки после просрочки платежа
        </Typography>
        <OutlinedInput
          disabled={isLoading}
          name="autostopSubscriptionIn"
          type="number"
          onChange={({ target: { value } }) => formik.setFieldValue("autostopSubscriptionIn", +value)}
          value={formik.values.autostopSubscriptionIn}
          placeholder="Остановить через..."
          sx={{
            width: "100%",
            maxWidth: "320px",
            my: 2,
          }}
        />

        {formik.errors.submit && (
          <Typography
            color="error"
            sx={{ mt: 4 }}
            variant="body2"
          >
            {formik.errors.submit}
          </Typography>
        )}

        <Stack
          spacing={2}
          direction="row"
          sx={{ justifyContent: "flex-end", mt: 3, position: "absolute", bottom: "48px", right: 0, mr: 20 }}
        >
          <Button
            disabled={formik.isSubmitting}
            size="large"
            sx={{
              borderRadius: "20px",
              boxShadow: "none",
              fontSize: 16,
              backgroundColor: "transparent",
              color: "#000",
              "&:hover": {
                color: "white"
              }
            }}
            variant="contained"
            onClick={back}
          >
            Отмена
          </Button>
          <Button
            disabled={formik.isSubmitting || !formik.dirty || isLoading}
            size="large"
            sx={{ borderRadius: "20px", fontSize: 16, backgroundColor: "#3F51B5" }}
            type="submit"
            variant="contained"
          >
            Сохранить
          </Button>
        </Stack>
      </form>
    </>
  )
}
