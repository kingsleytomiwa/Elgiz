"use client";

import { signIn } from "next-auth/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, Link, Stack, TextField, Typography } from "@mui/material";
import Image from "next/image";
import logo from "../../../public/assets/logo.svg";
import { useRouter } from "next/navigation";
import { revalidate } from "./action";

const SignInForm: React.FC = () => {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
      password: Yup.string().max(255).required("Password is required"),
    }),
    onSubmit: async ({ email, password }, helpers) => {
      try {
        await signIn("credentials", { email, password, redirect: false, callbackUrl: "/" }).then(
          (res) => {
            if (res?.error) {
              helpers.setStatus({ success: false });
              helpers.setErrors({ submit: "Error" });
              helpers.setSubmitting(false);
            } else {
              helpers.setSubmitting(false);
              setTimeout(() => {
                router.push("/");
                revalidate();
              }, 100);
            }
          }
        );
      } catch (err) {
        console.log("err :>> ", err);
      }
    },
  });

  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        flex: "1 1 auto",
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Link href="/" sx={{ position: "absolute", top: 64, left: 64 }}>
        <Image src={logo} alt="" />
      </Link>

      <Box
        sx={{
          maxWidth: 320,
          px: 3,
          py: "100px",
          width: "100%",
        }}
      >
        <div>
          <Stack spacing={1} sx={{ mb: 3 }}>
            <Typography variant="h4">Вход</Typography>
          </Stack>
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={3}>
              <TextField
                inputProps={{
                  style: { fontSize: 16 },
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
              <TextField
                inputProps={{
                  style: { fontSize: 16 },
                }}
                error={!!(formik.touched.password && formik.errors.password)}
                fullWidth
                helperText={formik.touched.password && formik.errors.password}
                label="Пароль"
                name="password"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="password"
                value={formik.values.password}
              />
            </Stack>
            {formik.errors.submit && (
              <Typography color="error" sx={{ mt: 3 }} variant="body2">
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
            <Button
              LinkComponent={Link}
              href="/forgot-password"
              fullWidth
              size="large"
              sx={{ mt: 3 }}
            >
              Не помню пароль
            </Button>
          </form>
        </div>
      </Box>
    </Box>
  );
};

export default SignInForm;
