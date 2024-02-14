"use client";

import React, { useMemo, useState } from "react";
import { Period, calculateTotalPrice } from "utils/billing";
import { twMerge } from "tailwind-merge";
import Checkbox from "./ui/Checkbox";
import Input from "./ui/Input";
import Modal from "./Modal";
import qs from "query-string";
import { useTranslation } from "react-i18next";
import { displayNumber } from 'utils';

export type Data = {
  rooms: number;
  period: Period;
  extras: string[];
};

interface Props {
  checkout?: boolean;
  data: Data;
  setData: React.Dispatch<React.SetStateAction<Data>>;
}

const MODULES_DATA = [
  {
    label: "Ресторан",
    value: "restaurant",
  },
  {
    label: "Кафе",
    value: "cafe",
  },
  {
    label: "Рум-сервис",
    value: "room-service",
  },
  {
    label: "Второй ресторан",
    value: "the_second_restaurant",
  },
  {
    label: "Лобби-бар",
    value: "lobby_bar",
  },
  {
    label: "Рецепция",
    value: "reception",
  },
  {
    label: "Бар",
    value: "bar",
  },
  {
    label: "Магазин отеля",
    value: "shop",
  },
  {
    label: "Фитнес-зона",
    value: "spa",
  },
];

const DURATION_DATA = [
  {
    text: "months",
    value: 3,
  },
  {
    text: "six_months",
    value: 6,
    label: "- 10%",
  },
  {
    text: "twelve_months",
    value: 12,
    label: "- 15%",
  },
] as { text: string; value: Period; label?: string; }[];

const Price: React.FC<Props> = ({ data, setData, checkout = false }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const price = useMemo(() => calculateTotalPrice(data.rooms, data.period, data.extras), [data]);
  const { t } = useTranslation();

  return (
    <section
      id="calculator"
      className={twMerge(
        "pt-40 max-sm:pt-10 max-w-[1440px] w-full",
        checkout && "!pt-0 max-w-full"
      )}
    >
      {!checkout && <h3 className="text-[60px] italic font max-sm:text-[32px] mb-6">{t("price")}</h3>}
      <div
        className={twMerge(
          " bg-[#2B3467] w-full max-w-[1344px] lg:max-w-[1440px] max-sm:w-[345px] rounded-[60px]  text-white",
          checkout && "rounded-[20px]  pb-12"
        )}
      >
        <div className={twMerge("flex max-md:flex-col", checkout && "flex-col")}>
          <div
            className={twMerge(
              "flex-1 pt-10 border-r-[1px] custom-border-dash max-sm:border-none",
              checkout && "border-r-0 border-b border-white border-dash pb-12"
            )}
          >
            <h2 className="pl-10 max-sm:pl-4 max-sm:text-[24px]">{t("create_your_own_tariff")}</h2>
            <p className="pt-10 font-bold max-sm:pt-6 pl-10 max-sm:pl-4">
              1. {t("the_duration_of_the_subscription")}
            </p>
            <div className="flex pl-12 gap-12 mt-4 pr-[70px] max-sm:flex-col max-sm:pl-[46px] max-sm:gap-8 max-sm:pr-0">
              {DURATION_DATA.map((item, i) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setData({ ...data, period: item.value })}
                  className={twMerge(
                    "flex-1 !px-4 py-3 border border-white rounded-[50px] text-center text-[20px] duration-300 w-full text-white relative max-sm:max-w-[137px] max-sm:text-[18px] max-sm:py-[5px] whitespace-nowrap",
                    data.period === item.value && "bg-white text-blue-500"
                  )}
                >
                  {t(item.text)}
                  {item.label && (
                    <div
                      className={twMerge(
                        "absolute top-[-15px] right-0 w-[70px] h-[30px] rounded-[5px] text-white bg-[#10B981] flex items-center justify-center text-base max-sm:text-[18px] max-sm:w-[60px] max-sm:top-[-20px]",
                        i === 2 && "text-blue-500 bg-[#FFE500]"
                      )}
                    >
                      {item.label}
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-6 ml-10 max-sm:ml-4">
              <p className="font-bold">
                2. {t("how_many_rooms_in_your_hotel")}
              </p>
              <Input
                placeholder={t("total")}
                variant="borderBottom"
                className="border-white max-w-[281px] mt-6 ml-10 max-sm:ml-4 calculator-placeholder"
                value={data.rooms === 0 ? "" : data.rooms}
                onChange={(e) => setData({ ...data, rooms: +e.target.value })}
              />
            </div>

            <div className="mt-6 font-bold ml-10 max-sm:ml-4">
              <p>
                3. {t("implementation_and_configuration_of_modules")}
              </p>
              <div className="w-[286px] pl-5 max-sm:pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(true);
                  }}
                  className=" underline max-sm:w-[283px] text-[14px] text-start"
                >
                  {t("find_out_what_is_the_benefits_of_implementing_and_why_is_it_beneficial_to_the_hotel")}
                </button>
              </div>
              <Modal
                isOpen={isModalOpen}
                onClose={() => {
                  setModalOpen(false);
                }}
              />
            </div>
            <div className="ml-[90px] max-sm:ml-0 max-sm:pl-10 max-sm:pb-5 mt-3 grid grid-cols-3 max-sm:grid-cols-1 gap-y-3 max-sm:w-[345px] max-sm:border-b-[1px] border-dash">
              {MODULES_DATA.map((item, i) => (
                <Checkbox
                  key={i}
                  label={t(item.value)}
                  check={data.extras.includes(item.value)}
                  click={() =>
                    setData({
                      ...data,
                      extras: data.extras.includes(item.value)
                        ? data.extras.filter((x) => x !== item.value)
                        : [...data.extras, item.value],
                    })
                  }
                />
              ))}
            </div>
          </div>

          <div
            className={twMerge(
              "mt-10 max-sm:mt-52 w-[482px] lg:w-[512px] max-sm:max-w-[345px]",
              checkout && "!w-full"
            )}
          >
            <div
              className={twMerge(
                " w-full max-sm:mt-10 max-sm:w-[345px] border-b-[1px] border-[#FDFFF1]  max-sm:ml-0 pb-10 max-sm:pb-5",
                checkout && "pl-7"
              )}
            >
              <h2 className="max-sm:text-[24px] ml-[22px] max-sm:ml-3 ">{t("total")}</h2>

              <div className="flex justify-between w-[434px] lg:w-[470px] max-sm:w-[313px] mx-[21px] max-sm:mx-3 max-sm:mr-10 max-sm:text-[18px] mt-10 max-sm:mt-4 ">
                <div className=" max-sm:w-[110px]">{t("total")}</div>
                <div className="flex-grow max-w-[160px] lg:max-w-[196px] max-sm:max-w-[150px] border-b-[1px] border-dash mx-2 max-sm:mx-2 "></div>
                <div className="max-sm:self-end">{displayNumber(price.subscription)}€</div>
              </div>
              <div className="flex justify-between w-[434px] lg:w-[470px] max-sm:w-[313px] mx-[21px] max-sm:mx-3 max-sm:text-[18px] mt-5 max-sm:mt-4 ">
                <div className="max-sm:w-[110px]">{t("total")}</div>
                <div className="flex-grow max-w-[150px] lg:max-w-[185px] max-sm:max-w-[150px] border-b-[1px] border-dash mx-2 max-sm:mx-2 "></div>
                <div className="max-sm:self-end">{displayNumber(price.setup)}€</div>
              </div>
            </div>

            <div
              className={twMerge(
                "flex justify-between w-[434px] lg:w-[470px] max-sm:w-[313px] mx-[21px] max-sm:mx-3 mt-8 max-sm:mt-4 text-[32px] max-sm:text-[24px] font-bold",
                checkout && "pl-7"
              )}
            >
              <div className="">K оплате</div>
              <div className="flex-grow max-w-[200px] lg:max-w-[250px] max-sm:max-w-[150px] border-b-[1px] border-dash mx-2 max-sm:mx-2 "></div>
              <div className="">{displayNumber(price.total)}€</div>
            </div>

            {!checkout && (
              <div className="grid content-end mx-[21px] max-sm:place-items-center mt-52 max-sm:mt-8 mb-3">
                <a href={`/checkout?${qs.stringify(data)}`}>
                  <button className="max-w-[434px] w-full lg:max-w-[470px] max-sm:w-[297px] h-[70px] max-sm:h-[72px] bg-[#FDFFF1] rounded-[10px] text-[#2B3467] max-sm:text-[20px]">
                    <h2 className="max-sm:text-[20px]">{t("go_to_registration")}</h2>
                  </button>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Price;
