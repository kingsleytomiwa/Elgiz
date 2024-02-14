"use client";

import { useFormik } from 'formik';
import * as React from "react";
import * as Yup from 'yup';
import {
  Box,
  Button,
  Link,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import Image from "next/image";
import logo from "../../../public/assets/logo.svg";
import { useRouter } from "next/navigation";
import { renewPassword } from "./action";

type ResetPasswordFormProps = {
  email: string;
  exp: number;
};

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ email, exp }) => {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
      submit: null
    },
    validationSchema: Yup.object({
      password: Yup
        .string()
        .max(255)
        .required('Password is required'),
      confirmPassword: Yup.string()
        .required("Please re-type your password")
        // use oneOf to match one of the values inside the array.
        // use "ref" to get the value of passwrod.
        .oneOf([Yup.ref("password")], "Passwords does not match"),
    }),
    onSubmit: async ({ password }, helpers) => {
      try {
        const expirationDate = exp;

        if (!email || (expirationDate && new Date().valueOf() >= expirationDate * 1000)) {
          helpers.setSubmitting(false);
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: "User with such email hasn't been found" });
          router.push("/");
        }

        await renewPassword({ email, password });

        helpers.setSubmitting(false);
        router.push("/");
      } catch (err) {
        helpers.setSubmitting(false);
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: "Error has been encountered. Maybe link has been expired" });
        console.log('err :>> ', err);
      }
    }
  });

  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        flex: '1 1 auto',
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <Link
        href="/"
        sx={{ position: "absolute", top: 64, left: 64 }}
      >
        <Image
          src={logo}
          alt=""
        />
      </Link>

      <Box
        sx={{
          maxWidth: 320,
          py: '100px',
          width: '100%'
        }}
      >
        <Box>
          <Stack
            spacing={1}
            sx={{ mb: 0.5 }}
          >
            <Typography
              variant="h4"
            >
              Новый пароль
            </Typography>
          </Stack>
          <Box sx={{ mt: 3 }}>
            <form onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  inputProps={{
                    style: { fontSize: 16 }
                  }}
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label="Новый пароль"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.password}
                />

                <TextField
                  inputProps={{
                    style: { fontSize: 16 }
                  }}
                  error={!!(formik.touched.confirmPassword && formik.errors.confirmPassword)}
                  fullWidth
                  helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                  label="Подтвердите новый пароль"
                  name="confirmPassword"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.confirmPassword}
                />
              </Stack>

              {formik.errors.submit && (
                <Typography
                  color="error"
                  sx={{ mt: 3 }}
                  variant="body2"
                >
                  {formik.errors.submit}
                </Typography>
              )}
              <Button
                disabled={formik.isSubmitting}
                fullWidth
                size="large"
                sx={{ mt: 3, borderRadius: "20px", fontSize: 16, backgroundColor: "#3F51B5" }}
                type="submit"
                variant="contained"
              >
                Подтвердить
              </Button>
            </form>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ResetPasswordForm;
