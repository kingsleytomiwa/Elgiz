import React from "react";
import Link from "next/link";
import Image from "next/image";
import PortalImage from "@/public/images/portal_image.png";
import initTranslations from "@/app/i18n";
import { cookies } from "next/headers";

async function HeroSection() {
    const locale = cookies().get('NEXT_LOCALE')?.value;
    const { t } = await initTranslations(locale, ['landing-page']);

    return (
        <section className="pt-28 max-sm:pt-0 max-sm:mt-16">
            <div className="grid grid-cols max-sm:justify-center pt-5 ">
                <div className=" p-5 text-center ">
                    <div className="max-sm:w-[291px]">
                        <h1 className="font-roboto max-sm:text-[32px]" ><span className="max-sm:block italic px-4">{t("communication")}</span>
                            <strong>{t("guest_and_hotel")}</strong>
                        </h1>
                    </div>

                    <div className="pt-6 max-sm:pt-4 max-sm:w-[300px] opacity-50">
                        {t("a_new_simple_and_effective_way_to_interact_with_the_guest_and_process_his_requests")}
                    </div>
                </div>
            </div>
            <div className="pt-6 flex justify-center max-sm:justify-center max-sm:p-0">
                <div className=" max-sm:justify-center">
                    <Link href="/checkout">
                        <button className=" py-3 w-[321px] rounded-lg mr-6 bg-[#2B3467] text-white max-sm:w-[190px] max-sm:h-[32px] max-sm:text-sm max-sm:p-0 max-sm:block max-sm:mb-2 max-sm:mr-0">{t("begin")}</button>
                    </Link>
                    <Link href="/#contacts">
                        <button className="py-3 w-[321px] rounded-md bg-[#2B3467] bg-opacity-10 text- [#2B3467] max-sm:w-[190px] max-sm:h-[32px] max-sm:text-sm max-sm:p-0">{t("sign_up_for_a_demo")}</button>
                    </Link>
                </div>
            </div>
            <div className=" pt-10 flex justify-center">
                <Image src={PortalImage} alt="PortalImage" className="max-sm:w-[345px] lg:w-[1440px]" />
            </div>

        </section>
    );
}

export default HeroSection;
