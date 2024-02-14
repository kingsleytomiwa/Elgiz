import * as React from "react";
import { Close, ExpandMore } from "@mui/icons-material";
import { Box, Button, Tab, Tabs, TextField, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Dialog, TabPanel, TabPanelProps, a11yProps } from "ui";
import { Form, Formik, useFormikContext } from "formik";
import * as Yup from "yup";
import Dropzone, { imageUploadError } from "components/Dropzone";
import { onAddPosition } from "./actions";
import { getTabsBorderRadius, languagesData } from "utils";
import { languages } from "../../../../../components/AddCategoryForm";
import { groupBy } from "lodash";
import { FoodCategory, FoodPosition } from "@prisma/client";
import { CategoryItem } from "components/PositionMenu";
import { transformData } from "src/utils/constants";
import { useTranslation } from "i18n";
import i18next from "i18next";

type FormSchema = {
  submit: string | null;
  file?: File | string;
  weight: number;
  price: number;
  categoryId: string;
  id?: string;
  fields: {
    name: string;
    description: string;
    lang?: string;
  }[];
};

interface AddPositionFormProps {
  mutate: () => void;
  onClose: () => void;
  onDelete: (() => void) | null;
  isDisabled: boolean;
  position: Partial<FoodPosition> | null;
  categories: CategoryItem[];
};

export default function AddPositionForm({ mutate, isDisabled, position, onClose, onDelete, categories }: AddPositionFormProps) {
  const [activeTab, setActiveTab] = React.useState<string>("ru");
  console.log('activeTab: ', activeTab);
  const [isLoading, setIsLoading] = React.useState(false);

  const disabled = React.useMemo(() => isDisabled || isLoading, [isDisabled, isLoading]);

  const handleClose = () => {
    onClose();
    setActiveTab("ru");
  };

  return (
    <Formik<FormSchema>
      initialValues={{
        submit: null,
        id: position?.id ?? "",
        file: position?.imageURL,
        price: Number(position?.price?.toFixed(2)) ?? 0,
        weight: position?.weight ?? 0,
        categoryId: position?.categoryId ?? "",
        fields: languagesData.map((lang) => ({ name: position?.name?.[lang.lang] ?? "", description: position?.description?.[lang.lang] ?? "", lang: lang.lang })) || [],
      }}
      validationSchema={Yup.object({
        file: Yup
          .mixed()
          .required(imageUploadError),
        weight: Yup
          .number()
          .positive('Значение должно быть больше 0')
          .required('Обязательное поле'),
        price: Yup
          .number()
          .positive('Значение должно быть больше 0')
          .required('Обязательное поле'),
        categoryId: Yup
          .string()
          .required('Обязательное поле'),
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
          )
      })}
      onSubmit={async ({ submit, fields, file, ...values }, helpers) => {
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
          const transformedValues = { ...transformedFields as any, ...values };

          // a way to send file to server action (to make it a FormData first)
          if (typeof file === "string") {
            await onAddPosition({ ...transformedValues, imageURL: file });
          } else {
            const fileForm = new FormData();
            fileForm.append("file", file!);

            await onAddPosition(transformedValues, fileForm);
          }

          setActiveTab("ru");
          mutate();
          helpers.resetForm();
          helpers.setSubmitting(false);
          handleClose();
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
        return (
          <Form placeholder=''>
            <Dialog
              isOpened={!!position?.categoryId}
              isDisabled={disabled || !dirty}
              onCancel={handleClose}
              onDelete={values?.id ? async () => {
                await onDelete?.();
                mutate();
                handleClose();
              } : null}
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
                    foodCategories={categories}
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

const FormContent = <T extends unknown>({ lang, foodCategories, ...tab }: TabPanelProps<T> & { lang: string; foodCategories?: FoodCategory[]; }) => {
  const formik = useFormikContext<FormSchema>();
  const { t } = useTranslation({ ns: "portal" });

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
            label={t("restaurant_add_position")}
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
            label={t("the_name_of_the_dish")}
            name="description"
            onBlur={formik.handleBlur}
            onChange={(e) => {
              formik.setFieldValue(`fields.${fieldIndex}.description`, e.target.value);
            }}
            value={fieldValue("description")}
          />
          <FormControl sx={{ minWidth: "100%", mb: 2 }}>
            <InputLabel id="demo-simple-select-label">{t("category")}</InputLabel>
            <Select<string>
              onChange={(e) => formik.setFieldValue("categoryId", e.target.value)}
              value={formik.values.categoryId ?? ""}
              label={t("category")}
              placeholder={t("category")}
              IconComponent={ExpandMore}
              error={!!(formik.touched.categoryId && formik.errors.categoryId)}
              fullWidth
              renderValue={() =>
                <Typography sx={{ color: formik.values.categoryId ? "black" : "#676E76", fontSize: "14px", fontWeight: 500 }}>
                  {formik.values.categoryId === "" ? t("category") : (foodCategories?.find(field => field.id === formik.values.categoryId)?.name as any)?.[i18next.language]}
                </Typography>
              }
              endAdornment={
                <Button
                  sx={{ display: formik.values.categoryId ? '' : 'none', p: 0, minWidth: 0, backgroundColor: "transparent" }}
                  onClick={() => formik.setFieldValue("categoryId", "")}
                >
                  <Close sx={{ color: "#3F51B5" }} />
                </Button>}
              sx={{
                height: "56px",
                alignSelf: "baseline",
                "& .MuiSelect-iconOutlined": { display: formik.values.categoryId ? 'none' : '' },
                "&.Mui-error .MuiOutlinedInput-notchedOutline": {
                  borderWidth: "3px !important"
                },
              }}
              inputProps={{
                sx: {
                  borderColor: "#D9D9D9 !important",
                  lineHeight: 1,

                  "&:focus": {
                    boxShadow: "none"
                  }
                }
              }}
            >
              {foodCategories?.map(category => category && (
                <MenuItem
                  key={category.id}
                  value={category.id}
                >
                  {/* TODO! */}
                  {(category?.name as any)?.[i18next.language]}
                </MenuItem>
              ))}
            </Select>
            <Typography sx={{ color: "#F04438", fontSize: "12px", fontWeight: 500, ml: 1.5 }}>
              {formik.touched.categoryId && formik.errors.categoryId}
            </Typography>
          </FormControl>

          <Box sx={{ display: "flex", gap: 1, }}>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
              <TextField
                inputProps={{
                  style: { fontSize: 16 }
                }}
                error={!!(formik.touched.weight && formik.errors.weight)}
                fullWidth
                helperText={formik.touched.weight && formik.errors.weight}
                label={t("description_of_the_dish")}
                name="weight"
                type="number"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.weight}
              />

              <Typography
                variant="caption"
                sx={{ mt: 2.5, mr: 2.5, textTransform: "uppercase", fontWeight: 600, fontSize: "12px", color: "#374151", opacity: 0.5, letterSpacing: "0.5px" }}
              >
                ГР
              </Typography>
            </Box>

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
              value={+(formik.values.price?.toFixed(2))}
            />
          </Box>
        </Box>
      </Box>
    </TabPanel>
  );
};
