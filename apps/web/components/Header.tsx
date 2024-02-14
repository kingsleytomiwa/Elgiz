"use client";
import React from "react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LogoIcon from "@/public/icons/logo.svg";
import Select from "./ui/Select";
import { useTranslation } from 'react-i18next';
import { languagesMockups } from "utils/constants";
import { onChangeLanguage } from "./actions";
import { usePathname, useRouter } from "next/navigation";
import { i18nConfig } from "@/i18nConfig";

const Header = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const currentLocale = i18n.language;
  const router = useRouter();
  const currentPathname = usePathname();

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
    document.body.style.overflowY = isMenuOpen ? "auto" : "hidden";
  };

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.style.overflowY = "auto";
  };

  const handleLanguageChange = e => {
    const newLocale = e.target.value;

    // set cookie for next-i18n-router
    const days = 30;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = date.toUTCString();
    document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/`;

    // redirect to the new locale path
    if (
      currentLocale === i18nConfig.defaultLocale
    ) {
      router.push('/' + newLocale + currentPathname);
    } else {
      router.push(
        currentPathname.replace(`/${currentLocale}`, `/${newLocale}`)
      );
    }

    router.refresh();
  };


  return (
    <header className="fixed z-40 top-0 left-0 right-0 bg-[#FDFFF1] mx-auto lg:max-w-[1440px] min-w-[393px] border-b-[1px] border-black border-opacity-10">
      <div className="flex justify-between items-center px-4 lg:px-0 sm:px-8 py-4  font-inter">
        <div className="flex items-center ml-10 lg:ml-0 max-sm:ml-0 ">
          <Link href="/" className="mr-8 max-sm:ml-1">
            <Image src={LogoIcon} alt="logo icon" />
          </Link>

          <div className={"hidden sm:flex items-center space-x-8"}>
            <Link href="/#content2" className="">
              {t("product")}
            </Link>
            <Link href="/#calculator" className="">
              {t("price")}
            </Link>
            <Link href="/#contacts">
              {t("contacts")}
            </Link>
          </div>
        </div>
        <div className="flex items-center mr-10 lg:mr-0 max-sm:mr-0">
          <Select
            options={languagesMockups}
            label={""}
            className="w-fit mr-10 border-0 cursor-pointer"
            onChange={handleLanguageChange}
            defaultValue={i18n?.language}
          />
          <a href="https://portal.elgiz.io" className="hidden sm:inline-block mr-4">
            {t("to_come_in")}
          </a>
          <Link className="hidden sm:inline-block" href={"/checkout"}>
            <button className="w-[255px] h-10 rounded-xl bg-[#2B3467] text-white">
              {t("register")}
            </button>
          </Link>

          {/* menu hamburger and button - mobile */}
          <div className="sm:hidden flex items-center max-sm:mr-2">
            <Link href={"/checkout"}>
              <button className=" mr-6 w-[100px] h-8 rounded-[10px] bg-[#2B3467] text-[#FDFFF1] text-sm">
                {t("begin")}
              </button>
            </Link>

            <button onClick={toggleMenu} className="">
              <img className="" src="/images/menu.svg" alt="" />
            </button>
          </div>
        </div>

        {/* Menu de navegação para telas pequenas */}
        {isMenuOpen && (
          <div className="sm:hidden w-full absolute top-0 left-0  bg-[#2B3467] text-white p-4 ">
            <div className="flex justify-end">
              <button onClick={closeMenu}>
                <img src="/images/x-mark.svg" alt="" />
              </button>
            </div>

            <div className="grid grid-cols place-items-center my-32">
              <Link href="/#slider" onClick={closeMenu} className="block mb-10">
                {t("product")}
              </Link>
              <Link href="/#calculator" onClick={closeMenu} className="block mb-10">
                {t("price")}
              </Link>
              <Link href="/#contacts" onClick={closeMenu} className="block mb-36">
                {t("contacts")}
              </Link>
              <Link href={"/checkout"}>
                <button className="w-[171px] h-[32px] bg-[#FDFFF1] text-[#2B3467] rounded-[10px] mb-5">
                  {t("begin")}
                </button>
              </Link>
              <a href="https://portal.elgiz.io" className="block">
                {t("to_come_in")}
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

