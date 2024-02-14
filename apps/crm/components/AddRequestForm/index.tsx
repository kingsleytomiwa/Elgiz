"use client";

import {
  Box,
  Button,
  Typography,
  Tooltip,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { DateRangePickerInput, Dialog, MultiSelect, Radio } from "ui";
import { Add, ExpandMore } from "@mui/icons-material";
import React, { useCallback, useMemo, useState } from "react";
import { useFormik } from "formik";
import {
  Category,
  FoodCategory,
  FoodPosition,
  Guest,
  Hotel,
  RequestStatus,
  RequestType,
  SpaPosition,
  User,
} from "@prisma/client";
import { categories, sections, validationSchema } from "./utils";
import {
  CategoryLabel,
  IroningRequestType,
  RequestPaymentPlaceType,
  RequestPaymentType,
  RequestServeType,
  TimeslotWithLabel,
  generateAvailableTimeSlots,
  getPriceByParam,
} from "utils";
import { useParameters, useSpaSettings, useSpaTherapists, useSpaTimeSlots } from "lib/use-fetch";
import DatePicker from "react-datepicker";
import AccessoriesMenu, { Accessory, dishes, additionalServicesItems } from "./AccessoriesMenu";
import SPAMenu from "./SPAMenu";
import PaymentRadios from "./PaymentRadios";
import { createHotelRequest, createHotelRequests } from "db";
import FormikAutocomplete, { Option } from "components/FormikAutocomplete";
import ShopMenu from "src/app/shop/catalog/Menu";
import RestaurantMenu from "src/app/restaurant/catalog/Menu";
import TimePicker from "components/Timepicker";
import { getHours } from "date-fns";
import { onCreateRequest, onCreateRequests } from "./actions";
import { useTranslation } from "i18n";
import queryString from "query-string";

type AddRequestFormProps = {
  hotel?: Hotel;
  staffId: string;
  openWithSection?: Category;
  openWithCategory?: RequestType;
  mutate?: () => void;
};

export default function AddRequestForm({
  staffId,
  openWithSection,
  openWithCategory,
  mutate,
}: AddRequestFormProps) {
  const [isOpened, setIsOpened] = React.useState(false);
  const [showSelectedOnly, setShowSelectedOnly] = React.useState(false);
  const { t } = useTranslation({ ns: "portal" });
  const { data: parameters } = useParameters();

  const [selectedMenu, setSelectedMenu] = React.useState<
    (FoodPosition & { category: FoodCategory; } & { count: number; })[]
  >([]);
  const [selectedAccessories, setSelectedAccessories] = React.useState<
    (Accessory & { count: number; })[]
  >([]);
  const [selectedSPA, setSelectedSPA] = React.useState<SpaPosition>();

  const newTime = new Date();

  const initialValues = {
    submit: null,
    guest: null as Option | null,
    worker: null as Option | null,
    taxi: null as Option | null,
    section: null as Option | null,
    category: null as Option | null,
    sections: [],
    serveTime: RequestServeType.IMMEDIATELY,
    ironing: IroningRequestType.BRING,
    reservationDay: null as Date | null,
    reserveTimes: [] as TimeslotWithLabel[],
    specificServeTime: new Date(newTime.setHours(newTime.getHours() + 1)),
    paymentPlace: RequestPaymentPlaceType.ROOM as RequestPaymentPlaceType,
    paymentType: RequestPaymentType.CASH as RequestPaymentType,
  };
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (
      {
        submit,
        guest,
        category,
        paymentPlace,
        paymentType,
        section,
        serveTime,
        reservationDay,
        reserveTimes,
        specificServeTime,
        taxi,
        worker,
        ironing,
      },
      helpers
    ) => {
      try {
        const isFoodOrderOrSauna =
          category?.value === RequestType.FOOD_ORDER ||
          category?.value === RequestType.PREPARE_SAUNA;
        const isNothingPicked =
          (isFoodOrderOrSauna && total === 0) ||
          (!selectedAccessories.length &&
            [RequestType.ADDITIONAL_SERVICES, RequestType.BRING_DISHES].includes(
              category?.value as any
            ));
        if (isNothingPicked) {
          helpers.setErrors({ submit: "Пожалуйста, выберите хотя бы один пункт" });
          helpers.setSubmitting(false);
          return;
        }

        let prods: any[] = [];

        switch (category?.value) {
          case RequestType.BRING_DISHES:
          case RequestType.ADDITIONAL_SERVICES:
            prods = selectedAccessories;
            break;
          case RequestType.FOOD_ORDER:
          case RequestType.SHOP:
            prods = selectedMenu;
            break;
          case RequestType.PREPARE_SAUNA:
            prods = [
              {
                id: selectedSPA?.id,
                count: 1,
                name: selectedSPA?.name,
                price: selectedSPA?.price?.toFixed(2),
              },
            ];
            break;
          default:
            prods = [];
            break;
        }

        const reserveDates =
          reservationDay &&
          reserveTimes.map((period) => ({
            start: period.value[0],
            end: period.value[1],
          }));

        const getData = (reserveStart?: Date, reserveEnd?: Date) => ({
          guestId: guest!.value,
          type: category?.value as RequestType,
          section: section?.value as Category,
          status: RequestStatus.CREATED,
          history: {
            create: {
              status: RequestStatus.CREATED,
              staffId,
            },
          },
          workerId: worker?.value,
          positionId: selectedSPA?.id,
          reserveStart,
          reserveEnd,
          isPaid: false,
          data: {
            ironing,
            price: price.sum,
            paymentPlace,
            paymentType,
            serveTime,
            specificServeTime,
            transferTo: taxi?.label,
            products: prods,
          },
        });

        if (reserveDates && reserveDates.length) {
          const { history, ...data } = getData();

          await onCreateRequests(
            reserveDates.map(({ start, end }) => ({
              ...data,
              reserveStart: start,
              reserveEnd: end,
            }))
          );
        } else {
          await onCreateRequest(getData());
        }

        helpers.setSubmitting(false);

        handleModalButtonClick();
        mutate?.();
      } catch (err) {
        console.log("err :>> ", err);
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: "Error" });
        helpers.setSubmitting(false);
      }
    },
  });

  const getCategories = categories(
    (formik.values.section?.value ?? openWithSection) as Category | undefined,
    t
  );


  const setDefaultSectionAndCategory = () => {
    if (!openWithSection || !openWithCategory) return;

    formik.setFieldValue(
      "section",
      sections(t).find(({ value }) => value === openWithSection)
    );

    formik.setFieldValue(
      "category",
      categories(openWithSection, t).find(({ value }) => value === openWithCategory)
    );
  };

  const handleModalButtonClick = () => {
    setIsOpened(false);
    setShowSelectedOnly(false);
    setSelectedMenu([]);
    setSelectedSPA(undefined);
    setSelectedAccessories([]);
    formik.resetForm();
    setDefaultSectionAndCategory();
  };

  const availableSpaTimeslots = useSpaTimeSlots(selectedSPA?.id!, formik.values.reservationDay!);
  const currentCategory = formik.values.category?.value as RequestType;
  const currentSection = formik.values.section?.value as Category;

  React.useEffect(() => {
    setDefaultSectionAndCategory();
  }, []);

  const total = React.useMemo(() => {
    return +(selectedSPA
      ? selectedSPA.price
      : selectedMenu.reduce((acc, current) => acc + (current?.count ?? 1) * current.price, 0))?.toFixed(2);
  }, [selectedMenu, selectedSPA]);

  const parameter = useMemo(
    () => parameters?.find((par) => par.type === currentSection),
    [parameters, currentSection]
  );

  const price = useMemo(() => {
    if (!parameter || parameter?.isDeliveryFree) return { sum: total, tax: 0 };

    return getPriceByParam(parameter, total);
  }, [parameter, total]);

  React.useEffect(() => {
    setSelectedMenu([]);
    setSelectedSPA(undefined);
    formik.setFieldValue("specificServeTime", undefined);
  }, [currentCategory]);

  const isSubmitDisabled =
    formik.isSubmitting ||
    (currentCategory === RequestType.FOOD_ORDER && total <= 0) ||
    (formik.values.serveTime === RequestServeType.BY_SPECIFIC_TIME &&
      formik.values.specificServeTime === undefined);

  const isSectionDisabled = !formik.values.guest?.value && !formik.values.section?.value;
  const isCategoryDisabled = !formik.values.section?.value && !currentCategory;
  const isSpaTimeDisabled =
    !formik.values.reservationDay ||
    !selectedSPA?.id ||
    availableSpaTimeslots.isLoading ||
    availableSpaTimeslots.isValidating;
  const isStaffDisabled =
    !selectedSPA?.duration || availableSpaTimeslots.isLoading || availableSpaTimeslots.isValidating;
  const isPaymentDisabled = currentCategory === RequestType.PREPARE_SAUNA && !selectedSPA?.id;

  return (
    <>
      <Button
        startIcon={<Add sx={{ fill: "#2B3467", fontSize: 24 }} />}
        sx={{ border: "1px solid #2B3467", my: 2, borderRadius: "5px", height: "32px" }}
        onClick={() => setIsOpened(true)}
      >
        <Typography sx={{ color: "#2B3467", ml: 0.5, fontSize: "13px" }}>
          {t("add_a_request")}
        </Typography>
      </Button>

      <form onSubmit={formik.handleSubmit}>
        <Dialog
          isOpened={isOpened}
          isDisabled={isSubmitDisabled}
          onCancel={handleModalButtonClick}
          sx={{ py: 3, px: 6, position: "relative", minWidth: "1140px" }}
        >
          <Box
            sx={{
              display: "flex",
              maxHeight: "500px",
            }}
          >
            <Box
              sx={{
                pr: 3,
                overflow: "auto",
                scrollbarWidth: "thin",
                "&::-webkit-scrollbar": {
                  width: "0.4em",
                },
                "&::-webkit-scrollbar-track": {
                  background: "white",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#bfbfbf",
                  borderRadius: "10px",
                },
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mb: 2 }}>
                <Typography sx={{ fontSize: "16px", lineHeight: "24px", color: "#121828" }}>
                  {t("add_a_request")}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography sx={{ fontSize: "16px", lineHeight: "24px" }}>1.</Typography>

                  <FormikAutocomplete
                    formik={formik}
                    formikKey="guest"
                    label={t("guest")}
                    path="guests"
                    transformOption={(guest: Guest) => ({
                      label: `${guest.name} - ${guest.room}`,
                      value: guest.id,
                    })}
                  />
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography sx={{ fontSize: "16px", lineHeight: "24px" }}>2.</Typography>

                  <Tooltip title={isSectionDisabled ? "Пожалуйста, сначала выберите гостя" : ""}>
                    <Typography variant="subtitle2" sx={{ width: "100%" }}>
                      <FormikAutocomplete
                        formik={formik}
                        formikKey="section"
                        label={t("request_category")}
                        path=""
                        transformOption={(section: Category) => ({
                          label: t(CategoryLabel[section]),
                          value: section,
                        })}
                        outerOnChange={(e, newValue) => {
                          if (newValue === null || newValue !== formik.values.section) {
                            formik.setFieldValue("section", null);
                            formik.setFieldValue("category", null);
                          }
                          formik.setFieldValue("section", newValue);
                        }}
                        disabled={isSectionDisabled}
                        defOptions={sections(t)}
                      />
                    </Typography>
                  </Tooltip>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography sx={{ fontSize: "16px", lineHeight: "24px" }}>3.</Typography>

                  <Tooltip title={isCategoryDisabled ? "Пожалуйста, сначала выберите раздел" : ""}>
                    <Typography variant="subtitle2" sx={{ width: "100%" }}>
                      <FormikAutocomplete
                        formik={formik}
                        formikKey="category"
                        label={t("request")}
                        path=""
                        transformOption={() => getCategories[0]}
                        disabled={isCategoryDisabled}
                        defOptions={getCategories}
                      />
                    </Typography>
                  </Tooltip>
                </Box>
              </Box>

              <>
                {[RequestType.FOOD_ORDER, RequestType.PREPARE_SAUNA, RequestType.SHOP].includes(
                  currentCategory as any
                ) && (
                    <>
                      {(!parameter?.isDeliveryFree ||
                        (!parameter.deliveryValue &&
                          currentCategory !== RequestType.PREPARE_SAUNA)) && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: 4,
                              width: "100%",
                              px: 7,
                              mb: 1,
                              opacity: "50%",
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "12px",
                                lineHeight: 1,
                                letterSpacing: "0.5px",
                                color: "#374151",
                                textTransform: "uppercase",
                              }}
                            >
                              {t("paid_delivery")}
                            </Typography>
                            <Typography sx={{ fontSize: "16px", lineHeight: "24px", color: "#121828" }}>
                              EUR {price.tax}
                            </Typography>
                          </Box>
                        )}

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 4,
                          width: "100%",
                          px: 7,
                          mb: 1,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "12px",
                            lineHeight: 1,
                            letterSpacing: "0.5px",
                            color: "#374151",
                            textTransform: "uppercase"
                          }}
                        >
                          {t("total")}
                        </Typography>
                        <Typography sx={{ fontSize: "16px", lineHeight: "24px", color: "#121828" }}>
                          EUR {price.sum}
                        </Typography>
                      </Box>

                      <Box sx={{ width: "100%", display: "flex", justifyContent: "center", mb: 3 }}>
                        <Button
                          onClick={() => setShowSelectedOnly((prevState) => !prevState)}
                          disableRipple
                          sx={{
                            p: 0,
                            color: "#121828",
                            fontSize: "16px",
                            lineHeight: "24px",
                            opacity: 0.5,
                            textDecoration: "underline",
                            textAlign: "center",
                          }}
                          variant="text"
                        >
                          {showSelectedOnly ? "Показать варианты" : t("show_the_order")}
                        </Button>
                      </Box>
                    </>
                  )}

                {currentCategory === RequestType.PREPARE_SAUNA && (
                  <>
                    {/* spa time spa worker name */}
                    <Box sx={{ width: "100%", mb: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "baseline", gap: 2 }}>
                        <Typography sx={{ fontSize: "16px", lineHeight: "24px" }}>4.</Typography>

                        <Tooltip
                          title={!selectedSPA?.id ? "Пожалуйста, сначала выберите услугу" : ""}
                        >
                          <Typography variant="subtitle2" sx={{ width: "100%" }}>
                            <Box sx={{ width: "300px" }}>
                              <DatePicker
                                wrapperClassName={!selectedSPA?.id ? "datepicker--disabled" : ""}
                                disabled={!selectedSPA?.id}
                                customInput={<DateRangePickerInput />}
                                placeholderText="Дата посещения"
                                selectsRange={false}
                                minDate={new Date()}
                                selected={formik.values.reservationDay}
                                onChange={(date) => formik.setFieldValue("reservationDay", date)}
                                isClearable={true}
                              />
                            </Box>
                          </Typography>
                        </Tooltip>
                      </Box>
                    </Box>

                    <Box sx={{ width: "100%", mb: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "baseline" }}>
                        <Typography
                          sx={{ fontSize: "16px", lineHeight: "24px", mr: 3.5 }}
                        ></Typography>

                        <Tooltip
                          title={
                            isSpaTimeDisabled ? "Пожалуйста, сначала выберите дату и услугу" : ""
                          }
                        >
                          <Typography variant="subtitle2" sx={{ width: "100%" }}>
                            <MultiSelect
                              selectProps={{
                                disabled: isSpaTimeDisabled,
                                multiple: !selectedSPA?.duration,
                              }}
                              name="Время посещения"
                              options={availableSpaTimeslots.data?.map((x) => x.label) ?? []}
                              onChange={(newValues) => {
                                // TODO! MultiSelect
                                // @ts-ignore
                                if (!newValues?.length && !newValues?.label)
                                  return formik.setFieldValue("reserveTimes", []);
                                newValues = Array.isArray(newValues) ? newValues : [newValues];
                                const values = newValues.map((value) => {
                                  return availableSpaTimeslots.data?.find(
                                    (x) => x.label === value
                                  )!;
                                });
                                formik.setFieldValue("reserveTimes", values);
                              }}
                              selValue={formik.values["reserveTimes"].map((x) => x.label)}
                              formControlProps={{ fullWidth: true }}
                              error={formik.errors.reserveTimes as string | undefined}
                            />
                          </Typography>
                        </Tooltip>
                      </Box>
                    </Box>

                    {/* spa worker name */}
                    {!selectedSPA?.noWorkers && (
                      <Box sx={{ width: "100%", mb: 3 }}>
                        <Box sx={{ display: "flex", alignItems: "start", gap: 2 }}>
                          <Typography sx={{ fontSize: "16px", lineHeight: "24px" }}>5.</Typography>

                          <Tooltip
                            title={
                              isStaffDisabled ? "Пожалуйста, сначала выберите дату и время" : ""
                            }
                          >
                            <Typography variant="subtitle2" sx={{ width: "100%" }}>
                              <FormikAutocomplete
                                disabled={isStaffDisabled}
                                formik={formik}
                                formikKey="worker"
                                label={t("master")}
                                path="spa-therapists"
                                filter={{ positionId: selectedSPA?.id!, start: formik.values.reserveTimes[0]?.value?.[0], end: formik.values.reserveTimes[0]?.value?.[1] }}
                                transformOption={(staff: User) => ({
                                  label: staff.name ?? "",
                                  value: staff.id,
                                })}
                              />
                            </Typography>
                          </Tooltip>
                        </Box>
                      </Box>
                    )}
                  </>
                )}

                {currentCategory === RequestType.TAXI && (
                  <Box sx={{ width: "100%" }}>
                    <Box sx={{ display: "flex", alignItems: "start", gap: 2 }}>
                      <Typography sx={{ fontSize: "16px", lineHeight: "24px" }}>4.</Typography>

                      <Box>
                        <FormControl sx={{ fontSize: "16px", lineHeight: "24px" }}>
                          <Typography sx={{ fontSize: "16px", lineHeight: "24px" }}>
                            {t("model_time")}
                          </Typography>

                          <RadioGroup
                            name="serveTime"
                            value={formik.values.serveTime}
                            onChange={formik.handleChange}
                          >
                            <FormControlLabel
                              value={RequestServeType.IMMEDIATELY}
                              control={<Radio />}
                              label={t("as_ready")}
                            />
                            <FormControlLabel
                              value={RequestServeType.BY_SPECIFIC_TIME}
                              control={<Radio />}
                              label={t("by_a_certain_time")}
                            />
                          </RadioGroup>

                          {formik.values.serveTime === RequestServeType.BY_SPECIFIC_TIME && (
                            <Box sx={{ ml: 3 }}>
                              <Typography variant="subtitle2" sx={{ width: "100%", mb: "8px" }}>
                                <Box sx={{ width: "250px" }}>
                                  <DatePicker
                                    customInput={<DateRangePickerInput />}
                                    placeholderText="Дата трансфера"
                                    selectsRange={false}
                                    minDate={new Date()}
                                    selected={formik.values.specificServeTime}
                                    onChange={(date) =>
                                      formik.setFieldValue("specificServeTime", date)
                                    }
                                    isClearable={true}
                                  />
                                </Box>
                              </Typography>
                              <TimePicker
                                onChange={(val) => formik.setFieldValue("specificServeTime", val)}
                                value={formik.values.specificServeTime}
                                placeholder="Время доставки"
                              />
                            </Box>
                          )}
                        </FormControl>
                      </Box>
                    </Box>
                  </Box>
                )}

                {[RequestType.FOOD_ORDER, RequestType.SHOP].includes(currentCategory as any) && (
                  <Box sx={{ width: "100%" }}>
                    <Box sx={{ display: "flex", alignItems: "start", gap: 2 }}>
                      <Typography sx={{ fontSize: "16px", lineHeight: "24px" }}>4.</Typography>

                      <Box>
                        <FormControl sx={{ fontSize: "16px", lineHeight: "24px" }}>
                          <Typography sx={{ fontSize: "16px", lineHeight: "24px" }}>
                            {t("model_time")}
                          </Typography>

                          <RadioGroup
                            name="serveTime"
                            value={formik.values.serveTime}
                            onChange={formik.handleChange}
                          >
                            <FormControlLabel
                              value={RequestServeType.IMMEDIATELY}
                              control={<Radio />}
                              label={t("as_ready")}
                            />
                            <FormControlLabel
                              value={RequestServeType.BY_SPECIFIC_TIME}
                              control={<Radio />}
                              label={t("by_a_certain_time")}
                            />
                          </RadioGroup>

                          {formik.values.serveTime === RequestServeType.BY_SPECIFIC_TIME && (
                            <Box sx={{ ml: 3 }}>
                              {currentCategory === RequestType.FOOD_ORDER && (
                                <Typography
                                  sx={{
                                    color: "#121828",
                                    fontSize: "14px",
                                    opacity: 0.5,
                                    mb: 1,
                                  }}
                                >
                                  {t("possible_error_5_minutes")}
                                </Typography>
                              )}

                              <TimePicker
                                // disabled={isLoading}
                                onChange={(val) => formik.setFieldValue("specificServeTime", val)}
                                value={formik.values.specificServeTime}
                                placeholder={t("delivery_time")}
                              />
                            </Box>
                          )}
                        </FormControl>
                      </Box>
                    </Box>
                  </Box>
                )}

                {[RequestType.FOOD_ORDER, RequestType.PREPARE_SAUNA, RequestType.SHOP].includes(
                  currentCategory as any
                ) && (
                    <Tooltip title={isPaymentDisabled ? "Пожалуйста, сначала выберите услугу" : ""}>
                      <Typography variant="subtitle2" sx={{ width: "100%" }}>
                        <PaymentRadios
                          values={formik.values}
                          handleChange={formik.handleChange}
                          isDisabled={isPaymentDisabled}
                        />
                      </Typography>
                    </Tooltip>
                  )}
              </>
            </Box>

            {/* right part (content) */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                pl: 3,
                ml: "2px",
                overflowX: "hidden",
                borderLeft: "2px solid #B3B9C1",
              }}
            >
              {(currentCategory === RequestType.BRING_DISHES ||
                currentCategory === RequestType.ADDITIONAL_SERVICES) && (
                  <>
                    <Typography sx={{ color: "#2B3467", fontSize: "20px" }}>{t("bring")}:</Typography>
                  </>
                )}
              <Box sx={{ overflowX: "hidden", overflowY: "auto", pl: "2px" }}>
                {/* IRONING */}
                {currentCategory === RequestType.IRONING && (
                  <RadioGroup
                    name="ironing"
                    value={formik.values.ironing}
                    onChange={formik.handleChange}
                  >
                    <FormControlLabel
                      value={IroningRequestType.BRING}
                      control={<Radio />}
                      label={t("bring")}
                    />
                    <FormControlLabel
                      value={IroningRequestType.TAKEOUT}
                      control={<Radio />}
                      label={t("take")}
                    />
                  </RadioGroup>
                )}

                {/* TAXI */}
                {currentCategory === RequestType.TAXI && (
                  <>
                    <FormikAutocomplete
                      formik={formik}
                      formikKey="taxi"
                      label="Пункт назначения"
                      path=""
                      defOptions={
                        parameter?.routes?.map((name) => ({ label: name, value: name })) ?? []
                      }
                    />
                  </>
                )}

                {/* SPA */}
                {currentCategory === RequestType.PREPARE_SAUNA && (
                  <SPAMenu
                    selectedSPA={selectedSPA}
                    showSelectedOnly={showSelectedOnly}
                    onCheck={(item) => {
                      setSelectedSPA(item);
                      formik.setFieldValue("reserveTimes", []);
                      formik.setFieldValue("worker", null);
                    }}
                  />
                )}

                {/* RESTAURANT FOOD */}
                {currentCategory === RequestType.FOOD_ORDER && (
                  <RestaurantMenu
                    selectedMenu={selectedMenu as any}
                    setSelectedMenu={setSelectedMenu as any}
                    showSelectedOnly={showSelectedOnly}
                  />
                )}

                {/* SHOP */}
                {currentCategory === RequestType.SHOP && (
                  <ShopMenu
                    selectedMenu={selectedMenu as any}
                    setSelectedMenu={setSelectedMenu as any}
                    showSelectedOnly={showSelectedOnly}
                  />
                )}

                {/* RESTAURANT BRING DISHES */}
                {(currentCategory === RequestType.BRING_DISHES ||
                  currentCategory === RequestType.ADDITIONAL_SERVICES) && (
                    <AccessoriesMenu
                      accessories={
                        currentCategory === RequestType.BRING_DISHES
                          ? dishes(t)
                          : additionalServicesItems(t)
                      }
                      selectedDishes={selectedAccessories}
                      setSelectedDishes={setSelectedAccessories}
                    />
                  )}
              </Box>
            </Box>
          </Box>

          {formik.errors.submit && (
            <Typography
              color="error"
              sx={{ mt: 4, display: "flex", justifyContent: "center" }}
              variant="body2"
            >
              {formik.errors.submit}
            </Typography>
          )}
        </Dialog>
      </form>
    </>
  );
}
