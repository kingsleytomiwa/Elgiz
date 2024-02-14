import * as React from "react";
import { Box, Tab, Tabs, TextField, Typography, Autocomplete, FormControlLabel, Checkbox } from "@mui/material";
import { Dialog, TabPanel, TabPanelProps, a11yProps } from "ui";
import { Form, Formik, useFormikContext } from "formik";
import * as Yup from "yup";
import Dropzone, { imageUploadError } from "components/Dropzone";
import { onAddPosition } from "./actions";
import { CategoryLabel, getTabsBorderRadius, languagesData } from "utils";
import { groupBy } from "lodash";
import { Category, SpaPosition, User } from "@prisma/client";
import { languages } from "components/AddCategoryForm";
import { Option, useAutocomplete } from "components/FormikAutocomplete";
import { transformData } from "src/utils/constants";
import { useTranslation } from "i18n";
import i18next from "i18next";

type FormSchema = {
	submit: string | null;
	file: File | string | null;
	duration: number;
	price: number;
	staff?: Option[];
	id?: string;
	noWorkers?: boolean;
	guestsLimit?: number;
	fields: {
		name: string;
		description: string;
		lang?: string;
	}[];
};

type AddPositionFormProps = {
	mutate: () => void;
	onClose: () => void;
	onDelete: (() => void) | null;
	isDisabled: boolean;
	position: Partial<SpaPosition & { staff: User[]; }> | null;
};

export default function AddPositionForm({ mutate, isDisabled, position, onClose, onDelete }: AddPositionFormProps) {
	const [activeTab, setActiveTab] = React.useState<string>("ru");
	const [isLoading, setIsLoading] = React.useState(false);
	const { t } = useTranslation({ ns: "portal" });

	const handleChange = (event: React.SyntheticEvent) => {
		setActiveTab((event.target as any).textContent);
	};

	const disabled = isDisabled || isLoading;

	return (
		<Formik<FormSchema>
			initialValues={{
				submit: null,
				id: position?.id ?? "",
				file: position?.imageURL ?? null,
				price: Number(position?.price?.toFixed(2)) ?? 0,
				noWorkers: position?.noWorkers ?? false,
				guestsLimit: position?.guestsLimit ?? 1,
				duration: position?.duration ? position?.duration / 60000 : 0,
				staff: position?.staff?.map(worker => ({ label: worker.name!, value: worker.id })) ?? [],
				fields: languagesData.map((lang) => ({ name: position?.name?.[lang.lang] ?? "", description: position?.description?.[lang.lang] ?? "", lang: lang.lang })) || [],
			}}
			validationSchema={Yup.object({
				file: Yup
					.mixed()
					.required(imageUploadError),
				noWorkers: Yup
					.boolean(),
				duration: Yup
					.number()
					.when("noWorkers", {
						is: false,
						then: schema => schema
							.positive("Пожалуйста, укажите положительное число")
							.required("Пожалуйста, выберите время"),
					}),
				staff: Yup
					.array()
					.when("noWorkers", {
						is: false,
						then: schema => schema.min(1, "Пожалуйста, выберите мастера"),
					}),
				fields: Yup.array()
					.of(
						Yup.object().shape({
							name: Yup
								.string()
								.required('Обязательное поле'),
							description: Yup
								.string()
								.required('Обязательное поле'),
						})
					),
				guestsLimit: Yup
					.number()
					.positive('Значение должно быть больше 0')
					.required('Обязательное поле'),
				price: Yup
					.number()
					.positive('Значение должно быть больше 0')
					.required('Обязательное поле'),
			})}
			onSubmit={async ({ submit, fields, file, duration, guestsLimit, noWorkers, staff, ...values }, helpers) => {
				if (!file) return;
				try {
					setIsLoading(true);
					// grouping like {[$lang]: [{ name: $name }]}
					const groupedFieldsByLanguage = groupBy(fields, (({ lang }) => lang));

					// removing lang field from all objects
					languages.forEach(lang => {
						return groupedFieldsByLanguage[lang.value] = groupedFieldsByLanguage[lang.value].map(({ lang, ...translatableValues }) => ({ ...translatableValues }));
					});

					// transform for storing at the backend
					const transformedFields = transformData(groupedFieldsByLanguage);
					const transformedValues = {
						...transformedFields as any,
						...(noWorkers ? {
							guestsLimit,
							noWorkers,
							staff: [],
							duration: 0,
						} : {
							guestsLimit: 1,
							noWorkers,
							staff,
							duration: duration * 60000,
						}),
						...values
					};

					// a way to send file to server action (to make it a FormData first)
					if (typeof file === "string") {
						await onAddPosition({ ...transformedValues, imageURL: file });
					} else {
						const fileForm = new FormData();
						fileForm.append("file", file!);

						await onAddPosition(transformedValues, fileForm);
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
			{(({ values, errors, touched, dirty }) => {
				console.log("errors", errors);

				return (
					<Form placeholder=''>
						<Dialog
							isOpened={!!position}
							isDisabled={disabled || !dirty}
							onCancel={onClose}
							onDelete={onDelete}
							sx={{ p: 3, pt: 1, width: "550px", }}
						>
							<Box>
								<Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: 1 }}>
									<Tabs
										value={activeTab}
										indicatorColor={"transparent" as "primary"}
										variant="scrollable"
										scrollButtons="auto"
										sx={{ mb: 3 }}
									>
										{values.fields.map(field => field.lang).map((lang: string, index) => {
											const fieldIndex = values.fields.findIndex(field => field.lang === lang);
											const error = touched?.fields?.[fieldIndex] && errors.fields?.[fieldIndex];

											return (
												<Tab
													key={lang}
													onClick={() => setActiveTab(lang!)}
													sx={{
														p: 2,
														backgroundColor: activeTab === lang ? "#3F51B5" : "#DDE3EE",
														color: activeTab === lang ? "#ffffff !important" : "#121828",
														borderBottom: 0,
														borderRadius: getTabsBorderRadius(index, values.fields.length),
														border: `1px solid ${error ? "red" : "transparent"}`
													}}
													label={languagesData.find(language => language.lang === i18next.language)?.label?.[lang!]}
													{...a11yProps(lang)}
												/>
											);
										})}
									</Tabs>
								</Box>

								{values.fields.map(field => field.lang).map((lang: string) =>
									<FormContent<string>
										key={lang}
										lang={lang}
										index={lang}
										activeIndex={activeTab}
									/>
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
		</Formik>
	);
}

const FormContent = <T extends unknown>({ lang, ...tab }: TabPanelProps<T> & { lang: string; }) => {
	const formik = useFormikContext<FormSchema>();

	const { t } = useTranslation({ ns: "portal" });

	const {
		onChange: workerOnChange,
		onInputChange: workerOnInputChange,
		options: workerOptions,
		value: workerValue,
	} = useAutocomplete("staff", (staff: User) => ({ label: staff.name ?? "", value: staff.id }), { sections: [Category.SPA] });

	const fieldIndex = formik.values.fields.findIndex(field => field.lang === lang);

	const fieldValue = (fieldName: string) => formik.values.fields?.[fieldIndex]?.[fieldName];
	const fieldError = (fieldName: string) => formik.touched.fields?.[fieldIndex]?.[fieldName] && formik.errors.fields?.[fieldIndex]?.[fieldName];

	return (
		<TabPanel<T>
			{...tab}
		>

			<Box sx={{ display: "flex", gap: 3 }}>
				{/* dropzone */}
				<Dropzone name="file" />

				<Box sx={{ zIndex: 11 }}>
					<TextField
						inputProps={{
							style: { fontSize: 16 }
						}}
						error={!!(fieldError("name"))}
						fullWidth
						helperText={fieldError("name")}
						label="Название услуги"
						name="name"
						onBlur={formik.handleBlur}
						onChange={(e) => {
							formik.setFieldValue(`fields.${fieldIndex}.name`, e.target.value);
						}}
						value={fieldValue("name")}
					/>
					<TextField
						inputProps={{
							style: { fontSize: 16 }
						}}
						sx={{ my: 2 }}
						error={!!(fieldError("description"))}
						fullWidth
						helperText={fieldError("description")}
						label="Описание услуги"
						name="description"
						onBlur={formik.handleBlur}
						onChange={(e) => {
							formik.setFieldValue(`fields.${fieldIndex}.description`, e.target.value);
						}}
						value={fieldValue("description")}
					/>

					<FormControlLabel
						sx={{ mr: 0, mb: 1 }}
						label={t("the_procedure_without_a_master")}
						control={
							<Checkbox
								onChange={(e, checked) => formik.setFieldValue("noWorkers", checked)}
								checked={formik.values.noWorkers}
							/>
						}
					/>

					{formik.values.noWorkers ? (
						<TextField
							sx={{ mb: 2 }}
							inputProps={{
								style: { fontSize: 16 }
							}}
							error={!!(formik.touched.guestsLimit && formik.errors.guestsLimit)}
							fullWidth
							helperText={formik.touched.guestsLimit && formik.errors.guestsLimit}
							label={t("the_limit_of_visitors_at_the_same_time")}
							name="guestsLimit"
							type="number"
							onBlur={formik.handleBlur}
							onChange={formik.handleChange}
							value={formik.values.guestsLimit}
						/>
					) : (
						<>
							<Autocomplete
								fullWidth
								sx={{ minWidth: "270px", mb: 2 }}
								options={workerOptions}
								getOptionLabel={(option) => option.label}
								noOptionsText="Введите имя работника"
								filterOptions={(x) => x}
								autoComplete
								multiple
								includeInputInList
								filterSelectedOptions
								value={formik.values.staff}
								renderInput={(params) => (
									<TextField
										{...params}
										name="worker"
										value={formik.values.staff}
										error={Boolean(formik.touched.staff && formik.errors.staff)}
										helperText={formik.touched.staff && formik.errors.staff}
										label={t("master")}
									/>
								)}
								onChange={(e, newValue) => {
									// @ts-ignore
									workerOnChange(e, newValue);
									formik.setFieldValue("staff", newValue);
								}}
								onInputChange={workerOnInputChange}
								renderOption={(props, option) => {
									return (
										<li {...props}>
											{option.label}
										</li>
									);
								}}
							/>

							<Box sx={{ display: "flex", flexDirection: "row", gap: 1, mb: 2 }}>
								<TextField
									inputProps={{
										style: { fontSize: 16 }
									}}
									error={!!(formik.touched.duration && formik.errors.duration)}
									fullWidth
									helperText={formik.touched.duration && formik.errors.duration}
									label={t("duration")}
									name="duration"
									type="number"
									onBlur={formik.handleBlur}
									onChange={formik.handleChange}
									value={formik.values.duration}
								/>

								<Typography
									variant="caption"
									sx={{ mt: 2.5, mr: 2.5, textTransform: "uppercase", fontWeight: 600, fontSize: "12px", color: "#374151", opacity: 0.5, letterSpacing: "0.5px" }}
								>
									{/* User can select minutes or hours but we store in ms */}
									{t("minutes")}
								</Typography>
							</Box>
						</>
					)}

					<TextField
						inputProps={{
							style: { fontSize: 16 }
						}}
						error={!!(formik.touched.price && formik.errors.price)}
						fullWidth
						helperText={formik.touched.price && formik.errors.price}
						label={t("price")}
						name="price"
						type="number"
						onBlur={formik.handleBlur}
						onChange={formik.handleChange}
						value={Number(formik.values.price?.toFixed(2))}
					/>
				</Box>
			</Box>
		</TabPanel>
	);
};
