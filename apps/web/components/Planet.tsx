"use client";

import Image from "next/image";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { useTranslation } from "react-i18next";

const LANG_DATA = [
  {
    lang: "English",
    style: "text-left",
  },
  {
    lang: "Français",
    style: "text-right pr-10 max-sm:pr-1",
  },
  {
    lang: "Türkçe",
    style: "text-left pl-20 max-sm:pl-5",
  },
  {
    lang: "Русский",
    style: "text-right",
  },
  {
    lang: "Italiano",
    style: "text-left pl-5 max-sm:pl-0",
  },
  {
    lang: "汉语",
    style: "text-right pr-15 max-sm:pr-3",
  },
  {
    lang: "Deutsch",
    style: "text-left",
  },
  {
    lang: "Español",
    style: "text-right pr-5 max-sm:pr-10",
  },
  {
    lang: "Română",
    style: "text-left",
  },
];

const Planet = () => {
  const refList = useRef(null);
  const { scrollYProgress } = useScroll({
    target: refList,
    offset: ["end end", "start start"],
  });
  const scale = useTransform(scrollYProgress, [0.3, 0.7, 1], [1, 0.7, 0.3]);
  const opacity = useTransform(scrollYProgress, [1, 0.5, 0], [1, 0.5, 0]);

  const { t } = useTranslation();
  return (
    <section>
      <div className=" h-[3200px] mt-[350px] max-sm:mt-[150px] max-sm:h-[2000px]">
        <motion.div style={{ scale }} className="sticky top-[515px] left-0 h-fit w-full ">
          <div className="relative max-sm:flex max-sm:justify-center">
            <Image
              src={"/images/planet.svg"}
              alt="planet"
              height={1030}
              width={0}
              className="w-full max-sm:w-72"
            />
          </div>
        </motion.div>
        <div className="flex flex-col gap-[150px] mt-[-500px] max-sm:mt-[0]">
          {LANG_DATA.map((item, i) => (
            <LangItem key={i} lang={item.lang} style={item.style} />
          ))}
        </div>
        <div ref={refList} className="h-[115px] w-full" />
      </div>
      <motion.div
        style={{ opacity }}
        className="max-w-[664px] w-full mx-auto flex flex-col items-center mt-[-300px] max-sm:mt-[0]"
      >
        <div className="w-[622px] max-sm:w-[345px] ">
          <p className="text-center mt-10 max-sm:mt-3 text-blue-500 text-3xl max-sm:text-[24px] font-bold max-sm:leading-6">
            {t("mandatory_support_for_languages")}
          </p>
          <p className="text-center mt-6 text-blue-500 max-sm:mt-3 max-sm:text-[18px] max-sm:leading-5">
            {t("elgiz_adheres_to_access_for_accessibility_and_obliges_hotels_to_translate_all_the_content_in_an_appendix_into_eight_languages")}
          </p>
        </div>

        <div className="mt-12 max-w-[615px] gap-12 max-sm:gap-8 text font-bold text-blue-500 flex flex-wrap max-sm:mx-5 max-sm:mt-6 justify-center max-sm:max-w-[345px]">
          {LANG_DATA.map((item, i) => (
            <p key={i}>{item.lang}</p>
          ))}
        </div>
        <div className="bg-blue-500 mt-12 px-12 max-sm:px-10 py-6 max-sm:pt-2 rounded-[50px] text-center  text-white w-full max-sm:w-[345px] max-sm:h-[144px]">
          {t("we_transfer_all_the_content_for_you_and_set_up_the_service")}
        </div>
      </motion.div>
    </section>
  );
};

export default Planet;

const LangItem: React.FC<{ lang: string; style: string }> = ({ lang, style }) => {
  const refList = useRef(null);
  const { scrollYProgress } = useScroll({
    target: refList,
    offset: ["end end", "start start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  // const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

  return (
    <motion.div
      ref={refList}
      style={{
        opacity,
        // scale
      }}
    >
      <p
        className={twMerge(
          "text-[70px] max-sm:text-[32px] font-extrabold text-[#343A40] h-[70px] max-sm:h-[38px] w-full max-sm:max-w-[393px] max-sm:mx-2",
          style
        )}
      >
        {lang}
      </p>
    </motion.div>
  );
};
