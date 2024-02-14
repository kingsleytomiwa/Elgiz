"use client";

import { useFormik } from 'formik';
import * as Yup from 'yup';
import * as React from "react";
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
import { useRouter } from "next/navigation";
import { InfoDialog } from "ui";
import { useTranslation } from 'i18n';
import { getPasswordResetLink } from './actions';

const ForgotPasswordForm: React.FC = () => {
  const [isOpened, setIsOpened] = React.useState(false);
  const { t } = useTranslation({ ns: "portal" });

  const handleModalButtonClick = () => {
    setIsOpened(false);
    router.push("/");
  };

  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      email: '',
      submit: null
    },
    validationSchema: Yup.object({
      email: Yup
        .string()
        // TODO: change text to i18n
        .email('Must be a valid email')
        .max(255)
        .required('Email is required'),
    }),
    onSubmit: async ({ email }, helpers) => {
      try {
        helpers.setErrors({ submit: "" });
        helpers.setSubmitting(true);
        await getPasswordResetLink(email);
        setIsOpened(true);
      } catch (error) {
        console.error(error);

        helpers.setStatus({ success: false });
        // TODO: change text to i18n
        helpers.setErrors({ submit: "User with such email hasn't been found" });
        helpers.setSubmitting(false);
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
        <div>
          <Stack
            spacing={1}
            sx={{ mb: 0.5 }}
          >
            <Typography variant="h4">
              {t("i_do_not_remember_the_password")}
            </Typography>
          </Stack>
          <Stack
            spacing={1}
            sx={{ mb: 3 }}
          >
            <Typography variant="body1">
              {t("enter_email_where_we_will_send_a_link_to_the_discharge_of_the_old_password")}
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
          </form>
        </div>
      </Box>

      <InfoDialog
        isOpened={isOpened}
        onSubmit={handleModalButtonClick}
        onCancel={handleModalButtonClick}
        // TODO: change text to i18n
        title="Проверьте почту"
        // TODO: change text to i18n
        message="На указанный адрес электронной почты отправлено письмо со ссылкой на сброс пароля. Перейдите по ссылке и введите новый пароль."
      />
    </Box>
  );
};

export default ForgotPasswordForm;
