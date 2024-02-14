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
import logo from "../../../public/assets/logo.svg";
import { useRouter } from "next/navigation";
import { findUser } from "db";
import { MAILER } from "utils";
import { sendMail } from "utils/sendgrid";
import { InfoDialog } from "ui";
import { JWT } from 'backend-utils';

const ForgotPasswordForm: React.FC = () => {
  const [isOpened, setIsOpened] = React.useState(false);

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
        .email('Must be a valid email')
        .max(255)
        .required('Email is required'),
    }),
    onSubmit: async ({ email }, helpers) => {
      try {
        const user = await findUser({ email });

        if (!user?.email) {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: "User with such email hasn't been found" });
          helpers.setSubmitting(false);
          return;
        }

        const jwt = await JWT.sign({ email: user.email }, process.env.JWT_SECRET!);

        await sendMail({
          from: MAILER.noReply,
          to: email,
          subject: `Password Reset`,
          content: `Please, <a href="${process.env.NEXT_PUBLIC_VERCEL_URL || process.env.SITE_URL}/reset-password?token=${jwt}">click here</a> to create a new password`,
        });

        setIsOpened(true);
      } catch (err) {
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
        <div>
          <Stack
            spacing={1}
            sx={{ mb: 0.5 }}
          >
            <Typography variant="h4">
              Не помню пароль
            </Typography>
          </Stack>
          <Stack
            spacing={1}
            sx={{ mb: 3 }}
          >
            <Typography variant="body1">
              Введите электронную почту, куда мы вышлем ссылку на сброс старого пароля.
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
                label="Эл. почта"
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
              Подтвердить
            </Button>
          </form>
        </div>
      </Box>

      <InfoDialog
        isOpened={isOpened}
        onSubmit={handleModalButtonClick}
        onCancel={handleModalButtonClick}
        title="Проверьте почту"
        message="На указанный адрес электронной почты отправлено письмо со ссылкой на сброс пароля. Перейдите по ссылке и введите новый пароль."
      />
    </Box>
  );
};

export default ForgotPasswordForm;
