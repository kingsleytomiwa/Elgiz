import { Box, Button, Checkbox, FormControlLabel, MenuItem, TextField, Typography, CircularProgress } from "@mui/material";
import { Dialog, MultiSelect } from "ui";
import { Add } from "@mui/icons-material";
import React, { useEffect } from "react";
import { Form, Formik, useFormikContext } from "formik";
import * as Yup from "yup";
import { Category, Hotel, Position, User } from "@prisma/client";
import { CategoryLabel, generateRandomHex } from "utils";
import { onDeleteStaff, onMutateStaff } from "./actions";
import ConfirmationDialog from "components/ConfirmationDialog";
import { sectionOptions } from "src/utils/constants";
import Dropzone from "components/Dropzone";
import { useTranslation } from "i18n";

type FormProps = {
	hotel: Hotel;
	onSuccess?: () => void;
	onClose?: () => void;
	worker?: User;
};

type Values = {
	submit: null;
	image: string | null;
	name: string;
	email: string;
	sections: Category[];
	createOwner: boolean;
};

export default function AddStaffForm({ hotel, onSuccess, onClose, worker }: FormProps) {
	const { t } = useTranslation({ ns: "portal" });
	const [isOpened, setIsOpened] = React.useState(false);
	const [isDeleting, setIsDeleting] = React.useState(false);
	const [isOpenedConfirmation, setIsOpenedConfirmation] = React.useState(false);

	const onCloseConfirmation = () => setIsOpenedConfirmation(false);

	const onDeleteButtonClick = () => {
		if (!worker?.id) return null;
		setIsOpenedConfirmation(true);
	};

	const onDelete = async () => {
		if (!worker?.id) return;

		try {
			setIsDeleting(true);

			await onDeleteStaff(worker.id);

			onSuccess?.();
			onClose?.();
			onCloseConfirmation();
			handleModalButtonClick();
			setIsDeleting(false);
		} catch (err) {
			console.log(err);
		}
	};

	const handleModalButtonClick = () => {
		onClose?.();
		setIsOpened(false);
	};

	// TODO! Check what's wrong with rerendering on Staff page

	return (
		<>
			<Button
				startIcon={<Add sx={{ fill: "#2B3467", fontSize: 24 }} />}
				sx={{ border: "1px solid #2B3467", my: 4, borderRadius: "5px" }}
				onClick={() => setIsOpened(true)}
			>
				<Typography sx={{ color: "#2B3467", ml: 0.5, fontSize: "13px" }}>
					{t("add_an_employee")}
				</Typography>
			</Button>

			{isOpenedConfirmation && (
				<ConfirmationDialog
					title={"Вы уверены, что хотите удалить работника?"}
					isDisabled={isDeleting}
					isOpened={isOpenedConfirmation}
					onCancel={onCloseConfirmation}
					onSubmit={async () => {
						await onDelete();
					}}
				/>
			)}
			{!isOpenedConfirmation && (
				<Formik<Values>
					enableReinitialize
					initialValues={{
						submit: null,
						image: worker?.image ?? null,
						name: worker?.name ?? "",
						email: worker?.email ?? "",
						sections: worker?.sections ?? [],
						createOwner: worker?.position === "OWNER" ?? false,
					}}
					validationSchema={Yup.object({
						image: Yup
							.mixed()
							.nullable(),
						name: Yup
							.string()
							.required('Укажите полное имя'),
						email: Yup
							.string()
							.required('Укажите почту'),
						sections: Yup
							.array()
							.min(1, "Выберите раздел")
							.required('Выберите раздел'),
						createOwner: Yup
							.boolean()
					})}
					onSubmit={async ({ submit, email, image, name, sections, createOwner }, helpers) => {
						try {
							// a way to send splashImage to server action (to make it a FormData first)
							if (typeof image === "string") {
								await onMutateStaff({
									name,
									email,
									image,
									position: createOwner ? Position.OWNER : Position.STAFF,
									hotelId: hotel.id,
									sections,
									color: generateRandomHex()
								});
							} else {
								const fileForm = new FormData();
								fileForm.append("file", image!);

								await onMutateStaff(
									{
										name,
										email,
										position: createOwner ? Position.OWNER : Position.STAFF,
										hotelId: hotel.id,
										sections,
										color: generateRandomHex()
									},
									fileForm
								);
							}

							helpers.setSubmitting(false);
							handleModalButtonClick();
							helpers.resetForm();

							onSuccess?.();
						} catch (err) {
							console.log("err :>> ", err);
							helpers.setStatus({ success: false });
							helpers.setErrors({ submit: "Error" });
							helpers.setSubmitting(false);
						}
					}}
				>
					{(({ dirty, isSubmitting }) => (
						<Form placeholder=''>
							<Dialog
								isOpened={isOpened || !!worker?.id}
								isDisabled={isDeleting || isSubmitting || !dirty}
								onCancel={handleModalButtonClick}
								onDelete={onDeleteButtonClick}
								sx={{ p: 3 }}
							>
								<FormContent
									isDeleting={isDeleting}
								/>
							</Dialog>
						</Form>
					))}
				</Formik>
			)}
		</>
	);
}

const FormContent = ({ isDeleting }: {
	isDeleting: boolean;
}) => {
	const { t } = useTranslation({ ns: "portal" });
	const {
		values,
		errors,
		touched,
		dirty,
		handleChange,
		handleBlur,
		setFieldValue,
		isSubmitting,
		initialValues,
	} = useFormikContext<Values>();

	useEffect(() => {
		values.createOwner && setFieldValue("sections", sectionOptions);
	}, [values.createOwner]);

	return (
		<>
			{isDeleting && (
				<Box sx={{ width: "100%", display: "flex", justifyContent: "center", mt: 2 }}>
					<CircularProgress />
				</Box>
			)}

			<Box sx={{ display: "flex", gap: 3 }}>
				<Dropzone name="image" />

				<Box sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 500 }}>
					<TextField
						inputProps={{
							style: { fontSize: 16 }
						}}
						error={!!(touched.name && errors.name)}
						fullWidth
						helperText={touched.name && errors.name}
						label={t("full_name")}
						name="name"
						onBlur={handleBlur}
						onChange={handleChange}
						type="name"
						value={values.name}
					/>
					<TextField
						inputProps={{
							style: { fontSize: 16 }
						}}
						error={!!(touched.email && errors.email)}
						fullWidth
						helperText={touched.email && errors.email}
						label={t("el_mail")}
						name="email"
						onBlur={handleBlur}
						onChange={handleChange}
						type="email"
						value={values.email}
					/>

					<MultiSelect
						name={t("chapter")}
						error={errors.sections as string}
						selectProps={{
							disabled: values.createOwner
						}}
						options={sectionOptions}
						onChange={(newSections: Category[]) => setFieldValue("sections", newSections)}
						selValue={values["sections"]}
						transformValue={(selected) => t(CategoryLabel[selected])}
						customOptions={(options) => {
							return options.map(option => (
								<MenuItem
									key={option}
									value={option}
								>
									{t(CategoryLabel[option])}
								</MenuItem>
							));
						}}
					/>

					<FormControlLabel
						sx={{ mr: 0 }}
						label="Полный доступ"
						control={
							<Checkbox
								onChange={(e, checked) => setFieldValue("createOwner", checked)}
								checked={values["createOwner"]}
							/>
						}
					/>

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
			</Box>
		</>
	);
};