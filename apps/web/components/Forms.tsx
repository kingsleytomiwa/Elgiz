"use client";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";

const Forms = () => {
  const days = ["Пн", "Вт", "Ср", "Чт", "Пт"];
  const periodos = ["Первая половина дня", "Вторая половина дня"];
  const [clickedDaysIndex, setClickedDaysIndex] = useState(null);
  const [clickedPeriodsIndex, setClickedPeriodsIndex] = useState(null);

  const { t } = useTranslation();

  const changeStyleDays = (index) => {
    setClickedDaysIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const changeStylePeriods = (index) => {
    setClickedPeriodsIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <section id="contacts">
      <div className="pt-40 max-sm:pt-0 grid grid-cols-2 max-sm:grid-cols-1 mb-40 max-sm:mb-16 lg:w-[1440px] lg:mx-auto">
        <div className="grid place-items-end max-sm:place-items-center max-sm:mt-6">
          <div className="px-12 max-sm:px-3 w-[664px] lg:w-[717px] max-sm:w-[345px] h-[678px] max-sm:h-[666px] py-10 max-sm:py-8 border border-black rounded-[50px] ">
            <div className="border-b-[1px] border-[#2B3467] mb-5">
              <input
                className="w-[536px] max-sm:w-[313px] border-0 px-0 bg-[#FDFFF1]"
                type="text"
                placeholder="Ваше имя"
              />
            </div>
            <div className="border-b-[1px] border-[#2B3467] mb-5">
              <input
                className="w-[536px] max-sm:w-[313px] border-0 px-0 bg-[#FDFFF1]"
                type="text"
                placeholder={t("your_mail")}
              />
            </div>
            <div className="border-b-[1px] border-[#2B3467] mb-5">
              <input
                className="w-[536px] max-sm:w-[313px] border-0 px-0 bg-[#FDFFF1]"
                type="text"
                placeholder={t("your_phone_number")}
              />
            </div>
            <div className="mt-10 max-sm:mt-9">
              <p>{t("when_is_it_more_convenient_for_you")}?</p>
            </div>
            <div className="flex justify-start mt-5 max-sm:mt-4 max-sm:gap-3">
              {days.map((day, index) => (
                <button
                  key={index}
                  className={`p-3 ${clickedDaysIndex === index ? "bg-blue-500 text-white" : ""
                    } transition duration-300 ease-in-out w-[65px] max-sm:w-[48px] h-[64] max-sm:h-[48px] border border-[#2B3467] rounded-[50%] max-sm:p-0 mr-3 max-sm:mx-auto`}
                  onClick={() => changeStyleDays(index)}
                >
                  {day}
                </button>
              ))}
            </div>
            <div className="flex justify-center max-sm:block mt-5">
              {periodos.map((period, index) => (
                <button
                  key={index}
                  className={` ${clickedPeriodsIndex === index ? "bg-blue-500 text-white" : ""
                    } transition duration-300 ease-in-out border border-[#2B3467] rounded-[50px] w-[254px] lg:w-[284px] max-sm:w-[313px] h-[56px] max-sm:h-[54px] first:mr-6 last:mr-1 max-sm:mb-4`}
                  onClick={() => changeStylePeriods(index)}
                >
                  {period}
                </button>
              ))}
            </div>
            <div className="mt-10 max-sm:mt-5 flex justify-center">
              <button className=" bg-[#2B3467] rounded-lg w-[563px] lg:w-[593px] max-sm:w-[313px] h-[62px] text-white">
                {t("sign_up")}
              </button>
            </div>
          </div>
        </div>

        <div className="grid place-items-start pt-14 max-sm: max-sm:order-first ">
          <div className="w-[340px] ml-20 max-sm:ml-6">
            <h2 className="max-sm:text-[24px]">{t("sign_up_for_online_demonstration_of_the_service")}</h2>
            <p className="pt-5 max-sm:pt-3 max-sm:w-[308px]">
              {t("fill_the_form_and_we_will_answer_you_today")}
            </p>
          </div>
          <div className="max-sm:hidden">
            <img className="lg:w-[733px]" src="/images/pa_send.png " alt="" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Forms;
