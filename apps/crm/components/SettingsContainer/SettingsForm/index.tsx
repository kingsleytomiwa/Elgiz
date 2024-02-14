import * as React from "react";
import {
  Box,
  Typography,
  Stack,
  Button,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  SelectChangeEvent,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { Close, ExpandMore } from "@mui/icons-material";
import { useTranslation } from "i18n";
import { currenciesMockups, languagesMockups, timezonesMockups } from "utils";
import { Settings, onMutateSettings } from "components/MobileAppContainer/SettingsForm/actions";

export default function SettingsForm({
  defaultValues,
  isLoading,
}: {
  defaultValues?: Settings;
  isLoading?: boolean;
}) {
  const { back } = useRouter();
  const { t, i18n } = useTranslation({ ns: "portal" });

  const formik = useFormik({
    initialValues: {
      submit: null,
      language: defaultValues?.language ?? "",
      timezone: defaultValues?.timezone ?? "",
      currency: defaultValues?.currency ?? "",
    },
    validationSchema: Yup.object({
      language: Yup.string(),
      timezone: Yup.string(),
      currency: Yup.string(),
    }),
    onSubmit: async ({ submit, ...values }, helpers) => {
      try {
        helpers.setSubmitting(true);
        await onMutateSettings(values);
        i18n.changeLanguage(values.language);

        // window.location.reload();

        helpers.setSubmitting(false);
      } catch (err) {
        console.log("err :>> ", err);
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: "Error" });
        helpers.setSubmitting(false);
      }
    },
    enableReinitialize: true,
  });

  const onSelectChange = (e: SelectChangeEvent<string>, label: keyof typeof formik.values) =>
    formik.setFieldValue(label, e.target.value);

  const { language, timezone, currency } = formik.values;

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, fontSize: "18px", lineHeight: "44px", mb: 2 }}
          >
            {t("interface_language")}
          </Typography>

          {/* TODO! Refactor */}
          <FormControl disabled={isLoading}>
            <InputLabel
              sx={{ background: "transparent" }}
              id="demo-simple-select-label"
            >
              {t("interface_language")}
            </InputLabel>
            <MuiSelect
              onChange={(e) => onSelectChange(e, "language")}
              value={language}
              label={t("interface_language")}
              placeholder={t("interface_language")}
              IconComponent={ExpandMore}
              error={!!(formik.touched.language && formik.errors.language)}
              fullWidth
              renderValue={() => (
                <Typography
                  sx={{
                    color: language ? "black" : "#676E76",
                    fontSize: "14px",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  {language === ""
                    ? t("interface_language")
                    : languagesMockups.find(
                      (el) => el.value === language
                    )?.label}
                </Typography>
              )}
              endAdornment={
                <>
                  {isLoading && <CircularProgress sx={{ color: "black", mr: 1, flex: "0 0 20px" }} size="20px" />}
                  <Button
                    sx={{
                      display: language ? "" : "none",
                      p: 0,
                      minWidth: 0,
                      backgroundColor: "transparent",
                    }}
                    onClick={() => !isLoading && formik.setFieldValue("language", "")}
                  >
                    <Close sx={{ color: isLoading ? "#676E76" : "#3F51B5" }} />
                  </Button>
                </>
              }
              sx={{
                height: "56px",
                minWidth: "180px",
                alignSelf: "baseline",
                "& .MuiSelect-iconOutlined": { display: language ? "none" : "" },
              }}
              inputProps={{
                sx: {
                  borderColor: "#D9D9D9 !important",
                  lineHeight: 1,
                  "&:focus": {
                    boxShadow: "none",
                  },
                },
              }}
            >
              {languagesMockups.map(
                (language) =>
                  language && (
                    <MenuItem key={language.value} value={language.value}>
                      {language.label}
                    </MenuItem>
                  )
              )}
            </MuiSelect>
          </FormControl>
        </Box>

        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, fontSize: "18px", lineHeight: "44px", mb: 2 }}
          >
            {t("the_time_zone_of_the_hotel")}
          </Typography>
          <FormControl disabled={isLoading}>
            <InputLabel
              sx={{ background: "transparent" }}
              id="demo-simple-select-label"
            >
              {t("the_time_zone_of_the_hotel")}
            </InputLabel>
            <MuiSelect
              onChange={(e) => onSelectChange(e, "timezone")}
              value={timezone}
              label={t("the_time_zone_of_the_hotel")}
              placeholder={t("the_time_zone_of_the_hotel")}
              IconComponent={ExpandMore}
              error={!!(formik.touched.timezone && formik.errors.timezone)}
              fullWidth
              renderValue={() => (
                <Typography
                  sx={{
                    color: timezone ? "black" : "#676E76", fontSize: "14px", fontWeight: 500, display: "flex", alignItems: "center"
                  }}
                >
                  {timezone === ""
                    ? t("the_time_zone_of_the_hotel")
                    : timezonesMockups.find(
                      (el) => el.value === timezone
                    )?.label}
                </Typography>
              )}
              endAdornment={
                <>
                  {isLoading && <CircularProgress sx={{ color: "black", mr: 1, flex: "0 0 20px" }} size="20px" />}
                  <Button
                    sx={{
                      display: timezone ? "" : "none",
                      p: 0,
                      minWidth: 0,
                      backgroundColor: "transparent",
                    }}
                    onClick={() => formik.setFieldValue("timezone", "")}
                  >
                    <Close sx={{ color: isLoading ? "#676E76" : "#3F51B5" }} />
                  </Button>
                </>
              }
              sx={{
                height: "56px",
                minWidth: "180px",
                maxWidth: "180px",
                alignSelf: "baseline",
                "& .MuiSelect-iconOutlined": { display: timezone ? "none" : "" },
              }}
              inputProps={{
                sx: {
                  borderColor: "#D9D9D9 !important",
                  lineHeight: 1,
                  "&:focus": {
                    boxShadow: "none",
                  },
                },
              }}
            >
              {timezonesMockups.map(
                (timezone) =>
                  timezone && (
                    <MenuItem key={timezone.value} value={timezone.value}>
                      {timezone.label}
                    </MenuItem>
                  )
              )}
            </MuiSelect>
          </FormControl>
        </Box>

        <Typography
          variant="h5"
          sx={{ fontWeight: 700, fontSize: "18px", lineHeight: "44px", mb: 2 }}
        >
          {t("hotel_currency")}
        </Typography>
        <FormControl disabled={isLoading}>
          <InputLabel
            sx={{ background: "transparent" }}
            id="demo-simple-select-label"
          >
            {t("hotel_currency")}
          </InputLabel>
          <MuiSelect
            onChange={(e) => onSelectChange(e, "currency")}
            value={currency}
            label={t("hotel_currency")}
            placeholder={t("hotel_currency")}
            multiline
            IconComponent={ExpandMore}
            error={!!(formik.touched.currency && formik.errors.currency)}
            fullWidth
            renderValue={() => (
              <Typography
                sx={{ color: currency ? "black" : "#676E76", fontSize: "14px", fontWeight: 500, backgroundColor: "transparent", display: "flex", alignItems: "center" }}
              >
                {currency === ""
                  ? t("hotel_currency")
                  : currenciesMockups.find((el) => el.value === currency)?.label}
              </Typography>
            )}
            endAdornment={
              <>
                {isLoading && <CircularProgress sx={{ color: "black", mr: 1, flex: "0 0 20px" }} size="20px" />}
                <Button
                  sx={{
                    display: currency ? "" : "none",
                    p: 0,
                    minWidth: 0,
                    backgroundColor: "transparent",
                  }}
                  onClick={() => formik.setFieldValue("currency", "")}
                >
                  <Close sx={{ color: isLoading ? "#676E76" : "#3F51B5" }} />
                </Button>
              </>
            }
            sx={{
              height: "56px",
              minWidth: "180px",
              alignSelf: "baseline",
              "& .MuiSelect-iconOutlined": { display: currency ? "none" : "" },
            }}
            inputProps={{
              sx: {
                borderColor: "#D9D9D9 !important",
                lineHeight: 1,
                "&:focus": {
                  boxShadow: "none",
                },
              },
            }}
          >
            {currenciesMockups.map(
              (currency) =>
                currency && (
                  <MenuItem key={currency.value} value={currency.value}>
                    {currency.label}
                  </MenuItem>
                )
            )}
          </MuiSelect>
        </FormControl>

        {formik.errors.submit && (
          <Typography color="error" sx={{ mt: 4 }} variant="body2">
            {formik.errors.submit}
          </Typography>
        )}

        <Stack
          spacing={2}
          direction="row"
          sx={{
            justifyContent: "flex-end",
            mt: 3,
            position: "absolute",
            bottom: "48px",
            right: 0,
            mr: 20,
          }}
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
                color: "white",
              },
            }}
            variant="contained"
            onClick={back}
          >
            {t("cancellation")}
          </Button>
          <Button
            disabled={formik.isSubmitting || !formik.dirty || isLoading}
            size="large"
            sx={{ borderRadius: "20px", fontSize: 16, backgroundColor: "#3F51B5" }}
            type="submit"
            variant="contained"
          >
            {t("save")}
          </Button>
        </Stack>
      </form>
    </>
  );
}
