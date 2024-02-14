import * as React from "react";
import { Box, TextField, Typography, CircularProgress } from "@mui/material";
import { Dialog } from "ui";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import Dropzone, { imageUploadError } from "components/Dropzone";
import { GreenSwitch } from "..";
import { useTranslation } from "i18n";
import { Settings, onMutateSettings } from "../SettingsForm/actions";

type FormSchema = {
	submit: string | null;
	splashScreen: boolean;
	splashImage?: File | string;
	splashSlogan: string | null;
};

type AddSplashScreenFormProps = {
	mutate: () => void;
	onClose: () => void;
	isDisabled: boolean;
	settings: Partial<Settings> | null;
};

export default function SettingsForm({ mutate, isDisabled, settings, onClose }: AddSplashScreenFormProps) {
	const [isLoading, setIsLoading] = React.useState(false);
	const disabled = isDisabled || isLoading;
	const { t } = useTranslation({ ns: "portal" });

	return (
		<Formik<FormSchema>
			initialValues={{
				submit: null,
				// id: position?.id ?? "",
				splashScreen: settings?.splash?.screen ?? false,
				splashImage: settings?.splash?.image,
				splashSlogan: settings?.splash?.slogan ?? "",
			}}
			validationSchema={Yup.object({
				splashImage: Yup
					.mixed()
					.required(imageUploadError),
				splashSlogan: Yup
					.string(),
				splashScreen: Yup
					.boolean(),
			})}
			onSubmit={async ({ submit, splashImage, splashSlogan, splashScreen }, helpers) => {

				if (!splashImage) return;
				try {
					setIsLoading(true);

					const fields: Settings = {
						splash: {
							screen: splashScreen,
							slogan: splashSlogan ?? ""
						}
					};

					// a way to send splashImage to server action (to make it a FormData first)
					if (typeof splashImage === "string") {
						await onMutateSettings({
							splash: {
								image: splashImage
							}
						});
					} else {
						const fileForm = new FormData();
						fileForm.append("file", splashImage!);

						await onMutateSettings(fields, fileForm);
					}

					mutate();
					helpers.resetForm();
					helpers.setSubmitting(false);
					onClose();
				} catch (err) {
					console.log("err :>> ", err);
					helpers.setStatus({ success: false });
					helpers.setErrors({ submit: "Error" });
					helpers.setSubmitting(false);
				}
				setIsLoading(false);
			}}
			enableReinitialize
		>
			{(({ values, errors, touched, dirty, handleBlur, setFieldValue }) => {
				console.log("errors", errors);

				return (
					<Form placeholder=''>
						<Dialog
							isOpened
							isDisabled={disabled || !dirty}
							onCancel={onClose}
							sx={{ p: 5, width: "1024px", }}
						>
							<Box>
								<Typography sx={{
									color: "#121828",
									fontSize: "16px",
									lineHeight: "24px",
									mb: 4
								}}>
									Настройки приложения
								</Typography>

								{isDisabled && (
									<CircularProgress />
								)}

								<Box sx={{ display: "flex", gap: 3, mb: 3, alignItems: "center" }}>
									<Typography sx={{
										fontSize: "14px",
										color: "#121828",
										lineHeight: "22px"
									}}>
										{t("welcome_screen")}
									</Typography>

									<GreenSwitch
										value={values.splashScreen}
										checked={values.splashScreen}
										onChange={() => setFieldValue("splashScreen", !values.splashScreen)}
									/>
								</Box>

								{values.splashScreen && (
									<Box sx={{ display: "flex", gap: 3 }}>
										{/* dropzone */}
										<Dropzone name="splashImage" />

										<Box sx={{ zIndex: 11 }}>
											<TextField
												inputProps={{
													style: { fontSize: 16 }
												}}
												error={!!(touched.splashSlogan && errors.splashSlogan)}
												fullWidth
												helperText={touched.splashSlogan && errors.splashSlogan}
												label={t("slogan_up_to_100_characters")}
												name="splashSlogan"
												onBlur={handleBlur}
												onChange={(e) => {
													setFieldValue("splashSlogan", e.target.value);
												}}
												value={values.splashSlogan}
											/>
										</Box>
									</Box>
								)}

								{errors.submit && (
									<Typography
										color="error"
										sx={{ mt: 4 }}
										variant="body2"
									>
										{errors.submit}
									</Typography>
								)}
							</Box>
						</Dialog>
					</Form>
				);
			})}
		</Formik >
	);
}
