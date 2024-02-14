"use client";

import { Hotel } from "@prisma/client";
import {
  Box,
  Button,
  Typography,
  OutlinedInput,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useMemo, useState } from "react";
import { RoleRequired } from "ui";
import CreateIcon from "@mui/icons-material/Create";
import { UpdatableHotelData, updateHotelData } from "../actions";
import { useFormik } from "formik";
import { COUNTRY_OPTIONS } from "utils";
import { useTranslation } from "i18n";

const ProfileContainer = ({ dataHotel }: { dataHotel: Hotel; }) => {
  const [isViewData, setIsViewData] = useState(false);
  const countryValue = useMemo(() => COUNTRY_OPTIONS.find((item) => item.value === dataHotel.country), [dataHotel.country]);
  const { t } = useTranslation({ ns: "portal" });

  const formik = useFormik({
    initialValues: {
      name: dataHotel.name,
      email: dataHotel.email,
      phone: dataHotel.phone,
      address: dataHotel.address,
      city: dataHotel.city,
      country: dataHotel.country,
    },
    onSubmit: async (values) => {
      const data = Object.keys(values).reduce((acc, key) => {
        if (values[key]) {
          acc[key] = values[key];
        }

        return acc;
      }, {} as UpdatableHotelData);

      try {
        await updateHotelData(data);
      } catch (error) {
        console.log("error:", error);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box sx={{ position: "relative", height: "550px", width: "100%" }}>
        <Box
          sx={{
            height: "100%",
            width: "100%",
            paddingX: "48px",
            paddingY: "24px",
            background: "white",
            boxShadow:
              "0px 1px 2px 0px rgba(100, 116, 139, 0.10), 0px 1px 1px 0px rgba(100, 116, 139, 0.06)",
            zIndex: 10,
          }}
        >
          <RoleRequired>
            <Button
              onClick={() => setIsViewData(true)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                paddingX: "16px",
                paddingY: "4px",
                borderRadius: "5px",
                border: "1px solid #2B3467",
              }}
            >
              <CreateIcon sx={{ color: "#2B3467" }} />
              <Typography sx={{ fontSize: "13px", color: "#2B3467" }}> {t("edit")}</Typography>
            </Button>
          </RoleRequired>

          <Box
            sx={{
              display: "flex",
              maxWidth: "850px",
              gap: "48px",
              width: "100%",
              marginTop: "80px",
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  fontSize: "12px",
                  color: "#374151",
                  opacity: "0.5",
                  fontWeight: "600",
                  textTransform: "uppercase",
                }}
              >
                {t("the_name_of_the_hotel")}
              </Typography>
              <Typography sx={{ marginTop: "16px", color: "#121828" }}>
                {dataHotel.name}
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  fontSize: "12px",
                  color: "#374151",
                  opacity: "0.5",
                  fontWeight: "600",
                  textTransform: "uppercase",
                }}
              >
                {t("el_mail")}
              </Typography>
              <Typography sx={{ marginTop: "16px", color: "#121828" }}>
                {dataHotel.email}
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  fontSize: "12px",
                  color: "#374151",
                  opacity: "0.5",
                  fontWeight: "600",
                  textTransform: "uppercase",
                }}
              >
                {t("telephone")}
              </Typography>
              <Typography sx={{ marginTop: "16px", color: "#121828" }}>
                {dataHotel.phone}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              maxWidth: "850px",
              gap: "48px",
              width: "100%",
              marginTop: "38px",
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  fontSize: "12px",
                  color: "#374151",
                  opacity: "0.5",
                  fontWeight: "600",
                  textTransform: "uppercase",
                }}
              >
                {t("address")}
              </Typography>
              <Typography sx={{ marginTop: "16px", color: "#121828" }}>
                {dataHotel.address}
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  fontSize: "12px",
                  color: "#374151",
                  opacity: "0.5",
                  fontWeight: "600",
                  textTransform: "uppercase",
                }}
              >
                {t("city")}
              </Typography>
              <Typography sx={{ marginTop: "16px", color: "#121828" }}>
                {dataHotel.city}
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  fontSize: "12px",
                  color: "#374151",
                  opacity: "0.5",
                  fontWeight: "600",
                  textTransform: "uppercase",
                }}
              >
                {t("a_country")}
              </Typography>
              <Typography sx={{ marginTop: "16px", color: "#121828" }}>
                {countryValue?.label}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            height: "100%",
            width: "100%",
            paddingX: "48px",
            paddingY: "24px",
            background: "white",
            position: "absolute",
            top: 0,
            left: 0,
            boxShadow:
              "0px 1px 2px 0px rgba(100, 116, 139, 0.10), 0px 1px 1px 0px rgba(100, 116, 139, 0.06)",
            opacity: isViewData ? "1" : "0",
            pointerEvents: isViewData ? "auto" : "none",
            zIndex: 11,
            transition: ".3s ease",
          }}
        >
          <Typography sx={{ color: "#121828", fontSize: "14px", fontWeight: "600" }}>
            {t("changing_the_hotel_data")}
          </Typography>
          <Box
            sx={{
              maxWidth: "846px",
              width: "100%",
              display: "flex",
              marginTop: "44px",
              gap: "48px",
            }}
          >
            <OutlinedInput
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              placeholder={t("the_name_of_the_hotel")}
              componentsProps={{
                input: {
                  // @ts-ignore
                  sx: {
                    "&:: placeholder": {
                      color: "#9C9EA5",
                      mr: 2,
                    },
                  },
                },
              }}
              sx={{
                height: "56px",
                borderRadius: "8px",
                border: "1px solid #E6E8F0",
                boxShadow: "none",
                flex: 1,
              }}
            />
            <OutlinedInput
              placeholder={t("el_mail")}
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              componentsProps={{
                input: {
                  // @ts-ignore
                  sx: {
                    "&:: placeholder": {
                      color: "#9C9EA5",
                      mr: 2,
                    },
                  },
                },
              }}
              sx={{
                height: "56px",
                borderRadius: "8px",
                border: "1px solid #E6E8F0",
                boxShadow: "none",
                flex: 1,
              }}
            />
            <OutlinedInput
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              placeholder="Телефон"
              componentsProps={{
                input: {
                  // @ts-ignore
                  sx: {
                    "&:: placeholder": {
                      color: "#9C9EA5",
                      mr: 2,
                    },
                  },
                },
              }}
              sx={{
                height: "56px",
                borderRadius: "8px",
                border: "1px solid #E6E8F0",
                boxShadow: "none",
                flex: 1,
              }}
            />
          </Box>
          <Box
            sx={{
              maxWidth: "846px",
              width: "100%",
              display: "flex",
              marginTop: "32px",
              gap: "48px",
            }}
          >
            <OutlinedInput
              name="address"
              value={formik.values.address}
              onChange={formik.handleChange}
              placeholder={t("address")}
              componentsProps={{
                input: {
                  // @ts-ignore
                  sx: {
                    "&:: placeholder": {
                      color: "#9C9EA5",
                      mr: 2,
                    },
                  },
                },
              }}
              sx={{
                height: "56px",
                borderRadius: "8px",
                border: "1px solid #E6E8F0",
                boxShadow: "none",
                flex: 1,
              }}
            />
            <OutlinedInput
              name="city"
              value={formik.values.city}
              onChange={formik.handleChange}
              placeholder={t("city")}
              componentsProps={{
                input: {
                  // @ts-ignore
                  sx: {
                    "&:: placeholder": {
                      color: "#9C9EA5",
                      mr: 2,
                    },
                  },
                },
              }}
              sx={{
                height: "56px",
                borderRadius: "8px",
                border: "1px solid #E6E8F0",
                boxShadow: "none",
                flex: 1,
              }}
            />
            <FormControl sx={{ flex: 1 }}>
              <InputLabel id="demo-simple-select-label">{t("a_country")}</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formik.values.country}
                label={t("a_country")}
                onChange={e => formik.setFieldValue('country', e.target.value)}
              >
                {COUNTRY_OPTIONS.map((item) => (
                  <MenuItem
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: "16px",
          marginTop: "24px",
          marginLeft: "auto",
          width: "fit-content",
          opacity: isViewData ? "1" : "0",
          pointerEvents: isViewData ? "auto" : "none",
          zIndex: 11,
          transition: ".3s ease",
        }}
      >
        <Button
          onClick={() => setIsViewData(false)}
          sx={{ color: "black", padding: "16px 24px" }}
        >
          Отмена
        </Button>
        <Button
          type="submit"
          onClick={() => setIsViewData(false)}
          sx={{
            color: "white",
            padding: "16px 42px",
            background: "#3F51B5",
            borderRadius: "20px",
            "&:hover": {
              opacity: "0.8",
              background: "#3F51B5",
            },
          }}
        >
          {t("save")}
        </Button>
      </Box>
    </form>
  );
};

export default ProfileContainer;
