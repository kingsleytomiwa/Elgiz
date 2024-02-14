"use client";

import { signIn } from "next-auth/react";
import { useFormik } from 'formik';
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
import logo from "../../assets/logo.svg";
import { useTranslation } from "i18n";
import { onSignIn } from "./actions";

const SignInForm: React.FC = () => {
  const { t } = useTranslation({ ns: "portal" });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      submit: null
    },
    validationSchema: Yup.object({
      email: Yup
        .string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required'),
      password: Yup
        .string()
        .max(255)
        .required('Password is required')
    }),
    onSubmit: async ({ email, password }, helpers) => {
      try {
        const res = await signIn('credentials', { email, password, redirect: false, callbackUrl: "/" });

        if (res?.error) {
          helpers.setStatus({ success: false });
          // TODO: change text to i18n
          helpers.setErrors({ submit: "Invalid email or password" });
          helpers.setSubmitting(false);

          return;
        }

        await onSignIn(email);
        helpers.setSubmitting(false);
        setTimeout(() => {
          window.location.href = '/';
        }, 100);
      } catch (error) {
        console.error(error);
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
          px: 3,
          py: '100px',
          width: '100%'
        }}
      >
        <div>
          <Stack
            spacing={1}
            sx={{ mb: 3 }}
          >
            <Typography variant="h4">
              {t("entrance")}
            </Typography>
          </Stack>
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={3}>
              <TextField
                inputProps={{
                  style: { fontSize: 16 }
                }}
                error={!!(formik.touched.email && formik.errors.email)}
                fullWidth
                helperText={formik.touched.email && formik.errors.email}
                label={t("el_mail")}
                name="email"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="email"
                value={formik.values.email}
              />
              <TextField
                inputProps={{
                  style: { fontSize: 16 }
                }}
                error={!!(formik.touched.password && formik.errors.password)}
                fullWidth
                helperText={formik.touched.password && formik.errors.password}
                label={t("password")}
                name="password"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="password"
                value={formik.values.password}
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
              {t("confirm")}
            </Button>
            <Button
              LinkComponent={Link}
              href="/forgot-password"
              fullWidth
              size="large"
              sx={{ mt: 3 }}
            >
              {t("i_do_not_remember_the_password")}
            </Button>
          </form>
        </div>
      </Box>
    </Box>
  );
};

export default SignInForm;
