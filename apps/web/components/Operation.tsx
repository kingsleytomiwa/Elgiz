"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LogoIcon from "@/public/icons/logo.svg";
import Arrows from "@/public/images/arrow.svg";
import Hotel from "@/public/images/hotel.svg";
import Automation from "@/public/images/automation.svg";
import Arrow1 from "@/public/images/arrow1.svg";
import Arrow2 from "@/public/images/arrow2.svg";
import { useTranslation } from "react-i18next";

const Operation = () => {
  const [activeContent, setActiveContent] = useState("content3");

  const { t } = useTranslation();

  const changeContent = (contentId) => {
    setActiveContent(contentId);
  };

  return (
    <>
      <section
        id="content1"
        style={{ display: activeContent === "content1" ? "block" : "none" }}
        className="pt-40 lg:max-w-[1440px] lg:mx-auto "
      >
        <div className="lg-max-w-[1440px] pl-24 lg:pl-0 lg:mx-auto">
          <h2 className="bold font-[32px]">
            <strong>{t("how_it_works")}</strong>
          </h2>
          <Link href="/#contacts">
            <p className="pt-2 underline opacity-50">{t("we_can_show_clearly")}</p>
          </Link>
        </div>

        <div className=" flex justify-evenly items-center mt-[70px] border-b-2 border-blue-500 ">
          <Link legacyBehavior href="/#content1">
            <a
              onClick={() => changeContent("content2")}
              className="bg-[#2B3467] w-[360px] text-center py-4 text-white rounded-t-xl"
            >
              {t("registration")}
            </a>
          </Link>
          <Link legacyBehavior href="/#content2">
            <a
              onClick={() => changeContent("content2")}
              className="text-[#2B3467] w-[360px] text-center hover:bg-[#2B3467] py-4 hover:text-white delay-200 rounded-t-xl"
            >
              {t("synchronization")}
            </a>
          </Link>
          <Link legacyBehavior href="/#content3">
            <a
              onClick={() => changeContent("content3")}
              className="text-[#2B3467] w-[360px] text-center hover:bg-[#2B3467] py-4 hover:text-white delay-200 rounded-t-xl"
            >
              {t("elgiz_web_interface")}
            </a>
          </Link>
          <Link legacyBehavior href="/#content4">
            <a
              onClick={() => changeContent("content4")}
              className="text-[#2B3467] w-[360px] text-center hover:bg-[#2B3467] py-4 hover:text-white delay-200 rounded-t-xl"
            >
              {t("automation_and_analytics")}
            </a>
          </Link>
        </div>

        <div className="pt-20 grid grid-cols-2 ">
          <div className="grid place-items-center">
            <div className=" w-[321px] ">
              <Link href="/checkout">
                <button className=" w-[321px] h-[56px] rounded-lg bg-[#2B3467] text-white">
                  {t("begin")}
                </button>
              </Link>

              <div className="w-36 mt-2 relative">
                <p>{t("click_to_start_registration")}</p>
                <Image className="absolute -right-4 top-1 " src={Arrow1} alt="" />
              </div>
              <div className=" mt-5 relative ">
                <div className="w-32 absolute top-0 right-0">
                  <p className="text-right">{t("check_how_much_it_will_cost")}</p>
                  <Image className="absolute -left-7 top-1 " src={Arrow2} alt="" />
                </div>
              </div>
            </div>
            <div className="mt-16">
              <Link href="/#calculator">
                <h2 className="underline">{t("calculator")}</h2>
              </Link>
            </div>
          </div>
          <div className="grid content-end">
            <div className="grid place-items-start ">
              <h2 className="mb-5">{t("registration")}</h2>
              <p className="w-[570px] ">
                {t("fill_in_the_form_create_your_own_tariff_and_confirm_your_hotel_data")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="content2"
        style={{ display: activeContent === "content2" ? "block" : "none" }}
        className="pt-40 lg:max-w-[1440px] lg:mx-auto"
      >
        <div className="lg-max-w-[1440px] pl-24 lg:pl-0 lg:mx-auto">
          <h2 className="bold font-[32px]">
            <strong>{t("how_it_works")}</strong>
          </h2>
          <Link href="/#contacts">
            <p className="pt-2 underline opacity-50">{t("we_can_show_clearly")}</p>
          </Link>
        </div>

        <div className=" flex items-center justify-evenly mt-[70px] border-b-[1px] border-blue-500 ">
          <Link legacyBehavior href="/#content1">
            <a
              onClick={() => changeContent("content1")}
              className="text-[#2B3467] w-[360px] text-center hover:bg-[#2B3467] delay-delay-300 py-4 hover:text-white delay-200 rounded-t-xl"
            >
              {t("registration")}
            </a>
          </Link>
          <Link legacyBehavior href="/#content2">
            <a
              onClick={() => changeContent("content2")}
              className="bg-[#2B3467] w-[360px] text-center py-4 text-white rounded-t-xl"
            >
              {t("synchronization")}
            </a>
          </Link>
          <Link legacyBehavior href="/#content3">
            <a
              onClick={() => changeContent("content3")}
              className="text-[#2B3467] w-[360px] text-center hover:bg-[#2B3467] py-4 hover:text-white delay-200 rounded-t-xl"
            >
              {t("elgiz_web_interface")}
            </a>
          </Link>
          <Link legacyBehavior href="/#content4">
            <a
              onClick={() => changeContent("content4")}
              className="text-[#2B3467] w-[360px] text-center hover:bg-[#2B3467] py-4 hover:text-white delay-200 rounded-t-xl"
            >
              {t("automation_and_analytics")}
            </a>
          </Link>
        </div>

        <div className="pt-36 grid grid-cols-2">
          <div className="grid place-items-center ">
            <div className="flex justify-center  gap-10">
              <Image src={LogoIcon} alt="logo icon" width={168} />
              <Image src={Arrows} alt="arrow" />
              <Image src={Hotel} alt="hotel" />
            </div>
          </div>
          <div className="grid place-items-start mt-5">
            <h2>{t("synchronization_with_your_hotel_pms")} </h2>
            <p className="w-[575px] pt-4">
              {t("our_specialist_synchronizes_elgiz_with_your_hotel_management_system")}
            </p>
          </div>
        </div>
      </section>

      <section
        id="content3"
        style={{ display: activeContent === "content3" ? "block" : "none" }}
        className="pt-40 lg:max-w-[1440px] mx-auto"
      >
        <div className="lg-max-w-[1440px] pl-24 lg:pl-0 lg:mx-auto ">
          <h2 className="bold font-[32px]">
            <strong>{t("how_it_works")}</strong>
          </h2>
          <Link href="/#contacts">
            <p className="pt-2 underline opacity-50">{t("we_can_show_clearly")}</p>
          </Link>
        </div>

        <div className=" flex items-center justify-evenly mt-[70px] border-b-2 border-blue-500 ">
          <Link legacyBehavior href="/#content1">
            <a
              onClick={() => changeContent("content1")}
              className="text-[#2B3467] w-[360px] text-center hover:bg-[#2B3467] py-4 hover:text-white delay-200 rounded-t-xl"
            >
              {t("registration")}
            </a>
          </Link>
          <Link legacyBehavior href="/#content2">
            <a
              onClick={() => changeContent("content2")}
              className="text-[#2B3467] w-[360px] text-center hover:bg-[#2B3467] py-4 hover:text-white delay-200 rounded-t-xl"
            >
              {t("synchronization")}
            </a>
          </Link>
          <Link legacyBehavior href="/#content3">
            <a
              onClick={() => changeContent("content3")}
              className="bg-[#2B3467] w-[360px] text-center py-4 text-white rounded-t-xl"
            >
              {t("elgiz_web_interface")}
            </a>
          </Link>
          <Link legacyBehavior href="/#content4">
            <a
              onClick={() => changeContent("content4")}
              className="text-[#2B3467] w-[360px] text-center hover:bg-[#2B3467] py-4 hover:text-white delay-250 rounded-t-xl"
            >
              {t("automation_and_analytics")}
            </a>
          </Link>
        </div>

        <div className="pt-20 flex items-center gap-[184px] max-w-[1200px] w-full mx-auto">
          <div className="flex-1">
            <div className="flex ml-[93px]">
              <div className="relative flex justify-center items-center">
                <Image
                  className="object-contain"
                  src={"/images/polygon.svg"}
                  width={188}
                  height={164}
                  alt="polygon"
                />
                <p className="text-blue-500 text-xl absolute block">{t("reception")}</p>
              </div>
              <div className="relative flex justify-center items-center -ml-[3px]">
                <Image
                  className="object-contain"
                  src={"/images/polygon.svg"}
                  width={188}
                  height={164}
                  alt="polygon"
                />
                <p className="text-blue-500 text-xl absolute block">{t("restaurant")}</p>
              </div>
            </div>
            <div className="flex -mt-11">
              <div className="relative flex justify-center items-center">
                <Image
                  className="object-contain"
                  src={"/images/polygon.svg"}
                  width={188}
                  height={164}
                  alt="polygon"
                />
                <p className="text-blue-500 text-xl absolute block">{t("parking")}</p>
              </div>
              <div className="relative flex justify-center items-center -ml-[3px]">
                <Image
                  className="object-contain"
                  src={"/images/polygon.svg"}
                  width={188}
                  height={164}
                  alt="polygon"
                />
                <p className="text-blue-500 text-xl absolute block">{t("room_service")}</p>
              </div>
            </div>
            <div className="flex ml-[93px] -mt-11">
              <div className="relative flex justify-center items-center">
                <Image
                  className="object-contain"
                  src={"/images/polygon.svg"}
                  width={188}
                  height={164}
                  alt="polygon"
                />
                <p className="text-blue-500 text-xl absolute block">{t("shop")}</p>
              </div>
              <div className="relative flex justify-center items-center -ml-[3px]">
                <Image
                  className="object-contain"
                  src={"/images/polygon.svg"}
                  width={188}
                  height={164}
                  alt="polygon"
                />
                <p className="text-blue-500 text-xl absolute block">{t("spa")}</p>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <h2>{t("modular_structure")}</h2>
            <p className=" pt-6">
              {t("elgiz_provides_a_modular_structure_of_your_hotel_which_consists_of_independent_blocks_and_allows_you_to_individually_configure_the_services_available_to_your_guests")}
            </p>
          </div>
        </div>
      </section>

      <section
        id="content4"
        style={{ display: activeContent === "content4" ? "block" : "none" }}
        className="pt-40 lg:max-w-[1440px] mx-auto"
      >
        <div className="lg-max-w-[1440px] pl-24 lg:pl-0 lg:mx-auto">
          <h2 className="bold font-[32px]">
            <strong>{t("how_it_works")}</strong>
          </h2>
          <Link href="/#contacts">
            <p className="pt-2 underline opacity-50">{t("we_can_show_clearly")}</p>
          </Link>
        </div>

        <div className=" flex items-center justify-evenly mt-[70px] border-b-2 border-blue-500 ">
          <Link legacyBehavior href="/#content1">
            <a
              onClick={() => changeContent("content1")}
              className="text-[#2B3467] w-[360px] text-center hover:bg-[#2B3467] py-4 hover:text-white delay-200 rounded-t-xl"
            >
              {t("registration")}
            </a>
          </Link>
          <Link legacyBehavior href="/#content2">
            <a
              onClick={() => changeContent("content2")}
              className="text-[#2B3467] w-[360px] text-center hover:bg-[#2B3467] py-4 hover:text-white delay-200 rounded-t-xl"
            >
              {t("synchronization")}
            </a>
          </Link>
          <Link legacyBehavior href="/#content3">
            <a
              onClick={() => changeContent("content3")}
              className="text-[#2B3467] w-[360px] text-center hover:bg-[#2B3467] py-4 hover:text-white delay-200 rounded-t-xl"
            >
              {t("elgiz_web_interface")}
            </a>
          </Link>
          <Link legacyBehavior href="/#content4">
            <a
              onClick={() => changeContent("content4")}
              className="bg-[#2B3467] w-[360px] text-center py-4 text-white rounded-t-xl"
            >
              {t("automation_and_analytics")}
            </a>
          </Link>
        </div>

        <div className="pt-20 grid grid-cols-2 ">
          <div className="grid place-items-center">
            <Image src={Automation} alt="hotel" />
          </div>
          <div className="grid content-end ">
            <h2>{t("automation_and_analytics")}</h2>
            <p className="w-[575px] pt-5">
              {t("elgiz_provides_a_modular_structure_of_your_hotel_which_consists_of_independent_blocks_and_allows_you_to_individually_configure_the_services_available_to_your_guests")}
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Operation;
