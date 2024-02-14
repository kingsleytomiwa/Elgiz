import * as React from "react";
import { Box, TextField, Typography, CircularProgress } from "@mui/material";
import { Dialog } from "ui";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import Dropzone, { imageUploadError } from "components/Dropzone";
import { Settings, onMutateSettings as onMutateSettings } from "./actions";
import { GreenSwitch } from "..";
import { useTranslation } from "i18n";

export enum HotelSettingsDialog {
	"mobileApp" = "mobileApp",
	"menu" = "menu"
};

type FormSchema = {
	submit: string | null;
	splashScreen: boolean;
	splashImage?: File | string;
	splashSlogan: string | null;
	restaurantMenuSpecificServeTimeAllowed: boolean;
	type: HotelSettingsDialog;
};

type AddSplashScreenFormProps = {
	mutate: () => void;
	onClose: () => void;
	isDisabled: boolean;
	settings: Partial<Settings> | null;
	type?: HotelSettingsDialog;
};

export default function SettingsForm({ mutate, isDisabled, settings, onClose, type = HotelSettingsDialog.mobileApp }: AddSplashScreenFormProps) {
	const { t } = useTranslation({ ns: "portal" });
	const [isLoading, setIsLoading] = React.useState(false);
	const disabled = isDisabled || isLoading;

	let label = "";
	switch (type) {
		case HotelSettingsDialog.mobileApp:
			label = t("application_settings");
			break;
		case HotelSettingsDialog.menu:
			label = t("parameters_menu");
			break;
	}

	return (
		<Formik<FormSchema>
			initialValues={{
				submit: null,
				type,
				splashScreen: settings?.splash?.screen ?? false,
				splashImage: settings?.splash?.image,
				splashSlogan: settings?.splash?.slogan ?? "",
				restaurantMenuSpecificServeTimeAllowed: settings?.restaurantMenu?.specificServeTimeAllowed ?? false
			}}
			validationSchema={Yup.object({
				splashImage: Yup
					.mixed()
					.when("type", {
						is: "splashScreen",
						then: (schema) => schema.required(imageUploadError),
						otherwise: (schema) => schema.nullable(),
					}),
				splashSlogan: Yup
					.string()
				,
				splashScreen: Yup
					.boolean(),
			})}
			onSubmit={async ({ submit, splashImage, splashSlogan, splashScreen, restaurantMenuSpecificServeTimeAllowed }, helpers) => {

				if (!splashImage) return;
				try {
					setIsLoading(true);

					const fields: Settings = {
						splash: {
							screen: splashScreen,
							slogan: splashSlogan ?? ""
						},
						restaurantMenu: {
							specificServeTimeAllowed: restaurantMenuSpecificServeTimeAllowed
						}
					};


					// a way to send splashImage to server action (to make it a FormData first)
					if (typeof splashImage === "string") {
						await onMutateSettings({
							...fields,
							splash: {
								...fields.splash,
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
									mb: 3
								}}>
									{label}
								</Typography>

								{isDisabled && (
									<CircularProgress />
								)}

								{type === HotelSettingsDialog.menu && (
									<>
										<Box sx={{ display: "flex", gap: 3, mb: 3, alignItems: "center" }}>
											<Typography sx={{
												fontSize: "14px",
												color: "#121828",
											}}>
												{t("reservation_of_time_time")}
											</Typography>

											<GreenSwitch
												value={values.splashScreen}
												checked={values.splashScreen}
												onChange={() => setFieldValue("splashScreen", !values.splashScreen)}
											/>
										</Box>
									</>
								)}

								{type === HotelSettingsDialog.mobileApp && (
									<>
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
									</>
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
