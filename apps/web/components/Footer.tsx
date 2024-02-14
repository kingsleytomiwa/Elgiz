"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import LogoIcon from "@/public/icons/white_logo.svg";
import { useTranslation } from "react-i18next";

interface Props {
  checkout?: boolean;
}

const Footer: React.FC<Props> = ({ checkout = false }) => {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#2B3467]  text-white text-[14px] w-full py-12 ">
      <div className="max-w-[1200px] lg:max-w-[1440px] mx-auto">
        <div className="mb-6">
          <Image
            src={LogoIcon}
            alt="logo icon"
            className="max-sm:hidden"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 max-w-[1200px] lg:max-w-[1440px] mx-auto max-sm:grid-cols-1 max-sm:ml-5">
        <div className="">
          <ul className="max-sm:mb-6 max-sm:hidden">
            <li className="mb-6">
              <a target="_blank" rel="noopener noreferrer" href={"https://elgiz.notion.site/Terms-and-Conditions-d50aa90813684b5b890cc2422da7e99e"}>{t("terms_of_use")}</a>
            </li>
            <li className="mb-6">
              <a target="_blank" rel="noopener noreferrer" href={"https://elgiz.notion.site/ELGIZ-Website-Privacy-Policy-f3543b0a0a0c46f580e79b17172612ad?pvs=74"}>{t("site_privacy_policy")}</a>
            </li>
            <li className="mb-6">
              <a target="_blank" rel="noopener noreferrer" href={"https://elgiz.notion.site/Portal-Privacy-Policy-7d14b1259a3f44df94b2137392a4808c?pvs=74"}>{t("privacy_policy_elgiz")}</a>
            </li>
            <li className="mb-6">
              <a target="_blank" rel="noopener noreferrer" href={"https://elgiz.notion.site/elgiz/Privacy-Policy-for-ELGIZ-Guest-602298316e784852ae3908fbd3d2eb4e"}>{t("application_privacy_policy_for_the_guest")}</a>
            </li>
          </ul>

        </div>

        <div className="flex justify-center max-sm:justify-start">
          <div className="grid grid-cols-1 gap-6 max-sm:gap-3 place-items-center max-sm:place-items-start max-sm:mb-10">
            <Link href="/#content2">{t("product")}</Link>
            <Link href="/#calculator">{t("price")}</Link>
            <Link href="/#contacts">{t("contacts")}</Link>

            {!checkout && (
              <div className="pt-[176px] max-sm:hidden">
                <p>Copyright 2024 “ELGIZ SERVICE” S.R.L.</p>
              </div>
            )}
          </div>
        </div>


        <div className="flex justify-end max-sm:justify-start">
          <div className="flex flex-col">
            <a href="tel:+3739400392" className="mb-6 max-sm:mb-1 ">+373 9400392</a>
            <a href="mailto:hello@elgiz.io">hello@elgiz.io</a>
          </div>
        </div>

        <div className="sm:hidden mt-10">
          <ul className="max-sm:mb-6">
            <li className="mb-4">
              <a href={"https://elgiz.notion.site/Terms-and-Conditions-d50aa90813684b5b890cc2422da7e99e"}>{t("terms_of_use")}</a>
            </li>
            <li className="mb-4">
              <a href={"https://elgiz.notion.site/ELGIZ-Website-Privacy-Policy-f3543b0a0a0c44f580e79b17172412ad?pvs=74"}>{t("site_privacy_policy")}</a>
            </li>
            <li className="mb-4">
              <a href={"https://elgiz.notion.site/Portal-Privacy-Policy-7d14b1259a3f44df94b2137392a4808c?pvs=74"}>{t("privacy_policy_elgiz")}</a>
            </li>
            <li className="mb-4">
              <a href={"https://elgiz.notion.site/elgiz/Privacy-Policy-for-ELGIZ-Guest-602298316e784852ae3908fbd3d2eb4e"}>{t("application_privacy_policy_for_the_guest")}</a>
            </li>
          </ul>
          <p className=" text-[14px]">Copyright 2023</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
