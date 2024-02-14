"use client";

import React from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { Hotel } from "@prisma/client";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { onMutateHotel } from "./actions";
import { countryTranslations } from "utils";
import { Close, ExpandMore } from "@mui/icons-material";
import { findUser } from "db";
import { v4 } from "uuid";

const AddHotelForm = ({ hotel }: { hotel?: Hotel; }) => {
  const { push, back } = useRouter();
  const isEdit = Boolean(hotel?.id);

  const formik = useFormik({
    initialValues: {
      ...hotel,
      submit: null,
      _count: 0,
      admin: null,
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
      name: Yup.string().max(255).required("Hotel name is required"),
      phone: Yup.string().max(255).required("Phone is required"),
      address: Yup.string().max(255).required("Address is required"),
      city: Yup.string().max(255).required("City is required"),
      country: Yup.string().max(255).required("Country is required"),
      responsiblePersonName: Yup.string().max(255).required("Responsible person is required"),
      responsiblePersonPosition: Yup.string().max(255).required("Person position is required"),
      rooms: Yup.string().max(255).required("Number is required"),
    }),
    onSubmit: async ({ submit, _count, admin, email, ...values }, helpers) => {
      try {
        const hotelId = hotel?.id ? hotel.id : v4();

        // one email can have only one hotel
        const userWithEmail = await findUser({ email }, { hotelId: true });
        if (!isEdit && userWithEmail?.hotelId) {
          helpers.setErrors({
            email: "This email has already been attached. Please, use another one",
          });
          helpers.setSubmitting(false);
          return;
        }

        await onMutateHotel(
          {
            ...values,
            rooms: Number(values.rooms),
            email,
            id: hotelId,
          },
          isEdit
        );

        helpers.setSubmitting(false);
        push(`/hotel/${hotelId}`);
      } catch (err) {
        console.log("err :>> ", err);
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: "Error" });
        helpers.setSubmitting(false);
      }
    },
  });

  const onSelectChange = (e: SelectChangeEvent<string>) =>
    formik.setFieldValue("country", e.target.value);

  const country = formik.values.country;

  return (
    <Box sx={{ pr: 20 }}>
      <Toolbar />
      <Typography
        variant="h4"
        sx={{
          mb: 4,
        }}
      >
        Добавить/Изменить отель
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", rowGap: 4, columnGap: 8 }}>
          <TextField
            inputProps={{
              style: { fontSize: 16 },
            }}
            error={!!(formik.touched.name && formik.errors.name)}
            fullWidth
            helperText={formik.touched.name && formik.errors.name}
            label="Название отеля"
            name="name"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.name}
          />
          <TextField
            inputProps={{
              style: { fontSize: 16 },
            }}
            error={!!(formik.touched.email && formik.errors.email)}
            fullWidth
            helperText={formik.touched.email && formik.errors.email}
            label="Эл. почта отеля"
            name="email"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="email"
            value={formik.values.email}
          />
          <TextField
            inputProps={{
              style: { fontSize: 16 },
            }}
            error={!!(formik.touched.phone && formik.errors.phone)}
            fullWidth
            helperText={formik.touched.phone && formik.errors.phone}
            label="Телефон"
            name="phone"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="tel"
            value={formik.values.phone}
          />

          <TextField
            inputProps={{
              style: { fontSize: 16 },
            }}
            error={!!(formik.touched.address && formik.errors.address)}
            fullWidth
            helperText={formik.touched.address && formik.errors.address}
            label="Адрес"
            name="address"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="address"
            value={formik.values.address}
          />
          <TextField
            inputProps={{
              style: { fontSize: 16 },
            }}
            error={!!(formik.touched.city && formik.errors.city)}
            fullWidth
            helperText={formik.touched.city && formik.errors.city}
            label="Город"
            name="city"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.city}
          />
          <FormControl>
            <InputLabel id="demo-simple-select-label">Страна</InputLabel>
            <Select<string>
              onChange={onSelectChange}
              value={country ?? ""}
              label="Страна"
              placeholder="Страна"
              IconComponent={ExpandMore}
              error={!!(formik.touched.country && formik.errors.country)}
              fullWidth
              renderValue={() => (
                <Typography
                  sx={{ color: country ? "black" : "#676E76", fontSize: "14px", fontWeight: 500 }}
                >
                  {country === "" ? "Страна" : country}
                </Typography>
              )}
              endAdornment={
                <Button
                  sx={{
                    display: country ? "" : "none",
                    p: 0,
                    minWidth: 0,
                    backgroundColor: "transparent",
                  }}
                  onClick={() => formik.setFieldValue("country", "")}
                >
                  <Close sx={{ color: "#3F51B5" }} />
                </Button>
              }
              sx={{
                height: "56px",
                minWidth: "180px",
                alignSelf: "baseline",
                "& .MuiSelect-iconOutlined": { display: country ? "none" : "" },
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
              {Object.entries(countryTranslations).map(
                (country) =>
                  country && (
                    <MenuItem key={country[0]} value={country[1]}>
                      {country[1]}
                    </MenuItem>
                  )
              )}
            </Select>
          </FormControl>

          <TextField
            inputProps={{
              style: { fontSize: 16 },
            }}
            error={!!(formik.touched.responsiblePersonName && formik.errors.responsiblePersonName)}
            fullWidth
            helperText={formik.touched.responsiblePersonName && formik.errors.responsiblePersonName}
            label="Ответственное лицо"
            name="responsiblePersonName"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.responsiblePersonName}
          />
          <TextField
            inputProps={{
              style: { fontSize: 16 },
            }}
            error={
              !!(
                formik.touched.responsiblePersonPosition && formik.errors.responsiblePersonPosition
              )
            }
            fullWidth
            helperText={
              formik.touched.responsiblePersonPosition && formik.errors.responsiblePersonPosition
            }
            label="Должность"
            name="responsiblePersonPosition"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.responsiblePersonPosition}
          />
          <TextField
            inputProps={{
              style: { fontSize: 16 },
            }}
            error={!!(formik.touched.rooms && formik.errors.rooms)}
            fullWidth
            helperText={formik.touched.rooms && formik.errors.rooms}
            label="Количество номеров"
            name="rooms"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.rooms}
          />
          {formik.errors.submit && (
            <Typography color="error" sx={{ mt: 4 }} variant="body2">
              {formik.errors.submit}
            </Typography>
          )}
        </Box>

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
            Отмена
          </Button>
          <Button
            disabled={formik.isSubmitting || !formik.dirty}
            size="large"
            sx={{ borderRadius: "20px", fontSize: 16, backgroundColor: "#3F51B5" }}
            type="submit"
            variant="contained"
          >
            Сохранить
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default AddHotelForm;
