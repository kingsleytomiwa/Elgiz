"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import CrossIcon from "@/public/icons/cross.svg";
import Image from "next/image";
import { useTranslation } from "react-i18next";

interface Props { }

const Cookies: React.FC<Props> = ({ }) => {
  const [cookieSeen, setCookieSeen] = useState<string | null>("");
  const { t } = useTranslation();

  useEffect(() => {
    setCookieSeen(localStorage.getItem("cookieSeen") || "unseen");
  }, []);

  if (!cookieSeen || cookieSeen === "seen") {
    return <></>;
  }

  return (
    <div className={"fixed top-0 min-h-screen w-full flex justify-center z-30 pointer-events-none"}>
      <div className="min-h-screen relative w-full max-w-[973px]">
        <div className="absolute bottom-12 right-0 bg-[#2B3467] rounded-[10px] py-5 gap-2.5 px-[30px] flex justify-between items-center w-full pointer-events-auto">
          <p className="text-[20px] text-[#FDFFF1] max-w-[788px]">
            Наш сайт использует файлы cookies для обеспечения работоспособности, согласно нашей{" "}
            <Link
              href="https://elgiz.notion.site/elgiz/Terms-and-Conditions-d50aa90813684b5b890cc2422da7e99e"
              target="__"
              className="underline"
            >
              {t("site_privacy_policy")}
            </Link>
          </p>
          <button
            onClick={() => {
              setCookieSeen("seen");
              localStorage.setItem("cookieSeen", "seen");
            }}
          >
            <Image src={CrossIcon} alt="cross icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cookies;
