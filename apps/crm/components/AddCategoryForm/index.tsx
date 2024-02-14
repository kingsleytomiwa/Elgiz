import * as React from "react";
import { Add } from "@mui/icons-material";
import { Box, Button, Tab, Tabs, TextField, Typography } from "@mui/material";
import { Dialog, TabPanel, TabPanelProps, a11yProps } from "ui";
import { Form, Formik, useFormikContext } from "formik";
import * as Yup from "yup";
import { groupBy } from "lodash";
import { getTabsBorderRadius, languagesData } from "utils";
import { CategoryItem } from "components/PositionMenu";
import { UsePositionsCountHook } from "lib/use-fetch";
import DeleteCategoryDialog from "./DeleteCategoryDialog";
import { DialogType } from "../CategoriesSection";
import { OutputLanguage, transformData } from "src/utils/constants";
import { useTranslation } from "i18n";
import i18next from "i18next";

type FormSchema = {
  submit: null;
  fields: {
    name: string;
    lang?: string;
  }[];
};

const languagesByLanguage = (lang: string) =>
  languagesData.map((language) => ({
    label: language.label[lang],
    value: language.lang,
  }));

export const languages = languagesByLanguage(i18next.language);

type Props = {
  mutate: () => void;
  isDisabled: boolean;
  openedDialog: DialogType;
  setOpenedDialog: React.Dispatch<React.SetStateAction<DialogType>>;
  setActiveCategory: React.Dispatch<React.SetStateAction<CategoryItem | undefined>>;
  action: (data?: OutputLanguage, id?: string) => Promise<void>;
  deleteAction: (id?: string) => Promise<void>;
  category?: CategoryItem;
  useDataCount: UsePositionsCountHook;
};

const AddCategoryForm: React.FC<Props> = ({
  mutate,
  isDisabled,
  category,
  openedDialog,
  action,
  deleteAction,
  useDataCount,
  setOpenedDialog,
  setActiveCategory,
}) => {
  const { t } = useTranslation({ ns: "portal" });
  const [activeTab, setActiveTab] = React.useState<string>("ru");
  const [isDeleting, setIsDeleting] = React.useState(false);

  const onDelete = async () => {
    if (!category?.id) return;
    try {
      setIsDeleting(true);
      await deleteAction(category.id);

      mutate();
      handleModalButtonClick();
    } catch (err) {
      console.log("err :>> ", err);
    }
    setIsDeleting(false);
  };

  const handleModalButtonClick = () => {
    setOpenedDialog(null);
    setActiveCategory(undefined);
    setActiveTab("ru");
  };

  return (
    <Box>
      <Button
        startIcon={<Add sx={{ fill: "#2B3467", fontSize: 24 }} />}
        sx={{
          border: "1px solid #2B3467",
          borderRadius: "5px",
          height: "32px",
          opacity: isDisabled ? 0.5 : 1,
          minWidth: "200px",
        }}
        onClick={() => setOpenedDialog("update")}
        disabled={isDisabled || isDeleting}
      >
        <Typography sx={{ color: "#2B3467", ml: 0.5, fontSize: "13px" }}>
          {t("add_the_category")}
        </Typography>
      </Button>

      <Formik<FormSchema>
        enableReinitialize
        initialValues={{
          submit: null,
          fields:
            languagesData.map((lang) => ({
              name: category?.name?.[lang.lang] ?? "",
              lang: lang.lang,
            })) || [],
        }}
        validationSchema={Yup.object({
          fields: Yup.array().of(
            Yup.object().shape({
              name: Yup.string().required("Обязательное поле"),
            })
          ),
        })}
        onSubmit={async (values, helpers) => {
          try {
            // grouping like {[$lang]: [{ name: $name }]}
            const groupedFieldsByLanguage = groupBy(values.fields, ({ lang }) => lang);

            // removing lang field from all objects
            languages.map((lang) => {
              return (groupedFieldsByLanguage[lang.value] = groupedFieldsByLanguage[lang.value].map(
                ({ name }) => ({ name })
              ));
            });

            // transform for storing at the backend
            const newData = transformData(groupedFieldsByLanguage);

            await action({ id: category?.id, ...(newData as any) });
            helpers.setSubmitting(false);
            helpers.resetForm();

            mutate();
            handleModalButtonClick();
          } catch (err) {
            console.log("err :>> ", err);
            helpers.setStatus({ success: false });
            helpers.setErrors({ submit: "Error" });
            helpers.setSubmitting(false);
          }
        }}
      >
        {({ values, errors, touched, isSubmitting, dirty }) => {
          return (
            <>
              <Form placeholder="">
                <Dialog
                  isOpened={openedDialog === "update"}
                  isDisabled={isDisabled || isDeleting || isSubmitting || !dirty}
                  onCancel={handleModalButtonClick}
                  onDelete={category?.id ? () => setOpenedDialog("delete") : null}
                  sx={{ p: 3, pt: 1, width: "550px" }}
                >
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mt: 1,
                      }}
                    >
                      <Tabs
                        value={activeTab}
                        indicatorColor={"transparent" as "primary"}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{ mb: 3 }}
                      >
                        {values.fields
                          .map((field) => field.lang)
                          .map((lang, index) => {
                            const fieldIndex = values.fields.findIndex(
                              (field) => field.lang === lang
                            );
                            const error =
                              touched.fields?.[fieldIndex] && errors.fields?.[fieldIndex];

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
                                  border: `1px solid ${error ? "red" : "transparent"}`,
                                }}
                                label={
                                  languagesData.find(
                                    (language) => language.lang === i18next.language
                                  )?.label?.[lang!]
                                }
                                {...a11yProps(lang!)}
                              />
                            );
                          })}
                      </Tabs>
                    </Box>

                    {values.fields
                      .map((field) => field.lang)
                      .map((lang: string) => (
                        <FormContent<string>
                          key={lang}
                          lang={lang}
                          index={lang}
                          activeIndex={activeTab}
                        />
                      ))}

                    {errors.submit && (
                      <Typography color="error" sx={{ mt: 4 }} variant="body2">
                        {errors.submit}
                      </Typography>
                    )}
                  </Box>
                </Dialog>
              </Form>

              {openedDialog === "delete" && (
                <DeleteCategoryDialog
                  isOpened={openedDialog === "delete"}
                  isDisabled={isDisabled || isDeleting}
                  onCancel={handleModalButtonClick}
                  onSubmit={onDelete}
                  sx={{ p: 3, width: "550px" }}
                  id={category?.id}
                  useDataCount={useDataCount}
                />
              )}
            </>
          );
        }}
      </Formik>
    </Box>
  );
};

export const FormContent = <T extends unknown>({
  lang,
  ...tab
}: TabPanelProps<T> & { lang: string; }) => {
  const formik = useFormikContext<FormSchema>();
  const { t } = useTranslation({ ns: "portal" });

  const fieldIndex = formik.values.fields.findIndex((field) => field.lang === lang);
  const fieldValue = formik.values.fields?.[fieldIndex]?.name;

  const error =
    formik.touched.fields?.[fieldIndex]?.name &&
    (formik.errors.fields?.[fieldIndex] as FormSchema["fields"][0])?.name;

  return (
    <TabPanel<T> {...tab}>
      <Box>
        <TextField
          inputProps={{
            style: { fontSize: 16 },
          }}
          sx={{ my: 2, minWidth: "320px" }}
          error={!!error}
          fullWidth
          helperText={error}
          label={t("name_of_category")}
          name={`fields.${fieldIndex}.name`}
          value={fieldValue}
          onBlur={formik.handleBlur}
          onChange={(e) => {
            formik.setFieldValue(`fields.${fieldIndex}.name`, e.target.value);
          }}
        />
      </Box>
    </TabPanel>
  );
};

export default AddCategoryForm;
