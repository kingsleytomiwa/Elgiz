import { Category, RequestType } from "@prisma/client";
import { CategoryLabel, RequestTypeLabel } from "utils";
import * as Yup from "yup";
import { Option } from "components/FormikAutocomplete";

export const categories = (section?: Category, t?: any) => {
  let newCategories: Option[] = [];
  switch (section) {
    case Category.RESTAURANT:
      newCategories = [
        { label: t(RequestTypeLabel.FOOD_ORDER), value: RequestType.FOOD_ORDER },
        { label: t(RequestTypeLabel.WASH_DISHES), value: RequestType.WASH_DISHES },
        { label: t(RequestTypeLabel.BRING_DISHES), value: RequestType.BRING_DISHES },
      ];
      break;
    case Category.SPA:
      newCategories = [{ label: t(RequestTypeLabel.PREPARE_SAUNA), value: RequestType.PREPARE_SAUNA }];
      break;
    case Category.SHOP:
      newCategories = [{ label: t("catalog"), value: RequestType.SHOP }];
      break;
    case Category.RECEPTION:
      newCategories = [
        { label: t(RequestTypeLabel.OPEN_PARKING), value: RequestType.OPEN_PARKING },
        { label: t(RequestTypeLabel.TAXI), value: RequestType.TAXI },
      ];
      break;
    case Category.ROOM_SERVICE:
      newCategories = [
        { label: t(RequestTypeLabel.IRONING), value: RequestType.IRONING },
        { label: t(RequestTypeLabel.ADDITIONAL_SERVICES), value: RequestType.ADDITIONAL_SERVICES },
      ];
      break;
    default:
      newCategories = [];
  }

  return newCategories;
};

export const sections = (t) => Object.entries(CategoryLabel)
  .map((category) => ({
    label: t(category[1]),
    value: category[0],
  }))
  .filter((section) => section.value !== Category.CHAT);

export const validationSchema = Yup.object({
  guest: Yup.object().shape({
    value: Yup.string().required("Guest is required"),
  }),
  taxi: Yup.object()
    .shape({
      value: Yup.string(),
    })
    .when("category", {
      is: RequestType.TAXI,
      then: (schema) => schema.required("Пожалуйста, выберите куда нужно ехать"),
      otherwise: (schema) => schema.nullable(),
    }),
  section: Yup.object().shape({
    value: Yup.string().required("Section is required"),
  }),
  category: Yup.object().shape({
    value: Yup.string().required("Category is required"),
  }),
  sections: Yup.array().required("Sections are required"),
  serveTime: Yup.string(),
  reservationDay: Yup.date().when("category", {
    is: RequestType.PREPARE_SAUNA,
    then: (schema) => schema.required("Пожалуйста, выберите время"),
    otherwise: (schema) => schema.nullable(),
  }),
  reserveTimes: Yup.array().when("category", {
    is: RequestType.PREPARE_SAUNA,
    then: (schema) => schema.required("Пожалуйста, выберите время"),
    otherwise: (schema) => schema.nullable(),
  }),
  specificServeTime: Yup.string()
    .nullable()
    .notRequired()
    .when(["serveTime", "category"], {
      is: ([serveTime, category]) => {},
      then: (schema) => schema.required("Пожалуйста, выберите время"),
    }),
  worker: Yup.object()
    .shape({
      value: Yup.string()
        .nullable()
        .when("category", {
          is: RequestType.PREPARE_SAUNA,
          then: (schema) => schema.required("Пожалуйста, выберите время"),
        }),
    })
    .nullable(),
  paymentPlace: Yup.string(),
  paymentType: Yup.string(),
});
