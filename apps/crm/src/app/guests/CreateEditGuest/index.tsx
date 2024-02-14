import { Box, TextField, Typography } from "@mui/material";
import { Dialog } from "ui";
import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createEditGuest } from "./actions";
import RangePicker from "components/RangePicker";
import { TableGuest } from "db";
import { useTranslation } from "i18n";
import { DateRangePickerInput } from "ui";
import DatePicker from "react-datepicker";

interface Props {
    onSuccess?: (guest: TableGuest) => void;
    onCancel?: () => void;
    open: boolean;
    setOpen: (s: boolean) => void;
    data?: TableGuest;
}

const getValues = (data?: TableGuest) => ({
    name: data?.name || "",
    email: data?.email || "",
    phone: data?.phone || "",
    room: data?.room || "",
    startDate: data?.startDate ? new Date(data?.startDate) : new Date(),
    endDate: data?.endDate ? new Date(data?.endDate) : new Date(),
});

const CreateEditGuest: React.FC<Props> = ({ onSuccess, open, setOpen, data, onCancel }) => {
    const { t } = useTranslation({ ns: "portal" });

    const formik = useFormik({
        initialValues: getValues(data),
        validationSchema: Yup.object({
            name: Yup
                .string()
                .required('Укажите полное имя'),
            email: Yup
                .string()
                .required('Укажите почту'),
            phone: Yup
                .string()
                .required('Укажите телефон'),
            room: Yup
                .string()
                .required('Укажите комнату'),
            startDate: Yup
                .date()
                .required('Укажите дату въезда'),
            endDate: Yup
                .date()
                .required('Укажите дату выезда'),
        }),
        onSubmit: async (formData, helpers) => {
            try {
                const results = await createEditGuest(formData as any, data?.id);
                onSuccess?.(results);
                helpers.setSubmitting(false);
                helpers.setStatus({ success: true, error: "" });
                setOpen(false);
                formik.resetForm();
            } catch (error) {
                console.error(error);
                helpers.setStatus({ success: false, error: "No rooms left at this timeframe" });
                helpers.setSubmitting(false);
            }
        }
    });

    useEffect(() => {
        formik.setValues(getValues(data));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const handleModalButtonClick = () => {
        setOpen(false);
        formik.resetForm();
        onCancel?.();
    };

    return (
        <form onSubmit={formik.handleSubmit}>
            <Dialog
                isOpened={open}
                isDisabled={formik.isSubmitting || !formik.dirty}
                onCancel={handleModalButtonClick}
                onSubmit={formik.handleSubmit}
                sx={{ py: 3, px: 6 }}
            >
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 500 }}>
                    <TextField
                        inputProps={{
                            style: { fontSize: 16 }
                        }}
                        error={!!(formik.touched.name && formik.errors.name)}
                        fullWidth
                        helperText={formik.touched.name && formik.errors.name}
                        label={t("full_name")}
                        name="name"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="name"
                        value={formik.values.name}
                    />
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
                        error={!!(formik.touched.phone && formik.errors.phone)}
                        fullWidth
                        helperText={formik.touched.phone && formik.errors.phone}
                        label={t("telephone")}
                        name="phone"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="phone"
                        value={formik.values.phone}
                    />
                    <TextField
                        inputProps={{
                            style: { fontSize: 16 }
                        }}
                        error={!!(formik.touched.room && formik.errors.room)}
                        fullWidth
                        helperText={formik.touched.room && formik.errors.room}
                        label={t("room")}
                        name="room"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="room"
                        value={formik.values.room}
                    />

                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                        <DatePicker
                            customInput={<DateRangePickerInput />}
                            placeholderText={t("arrival_date")}
                            selected={formik.values.startDate}
                            onChange={(update) => {
                                formik.setFieldValue('startDate', update);
                            }}
                            showTimeSelect
                            dateFormat="Pp"
                        />

                        <DatePicker
                            customInput={<DateRangePickerInput />}
                            placeholderText={t("date_of_departure")}
                            selected={formik.values.endDate}
                            onChange={(update) => {
                                formik.setFieldValue('endDate', update);
                            }}
                            showTimeSelect
                            dateFormat="Pp"
                        />
                    </Box>

                    {formik.status?.error && (
                        <Typography
                            color="error"
                            sx={{ mt: 4, display: "flex", justifyContent: "center" }}
                            variant="body2"
                        >
                            {formik.status.error}
                        </Typography>
                    )}
                </Box>
            </Dialog>
        </form>
    );
};

export default CreateEditGuest;
