import React from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import initTranslations from "@/app/i18n";

const Section3 = async () => {
  const locale = cookies().get('NEXT_LOCALE')?.value;
  const { t } = await initTranslations(locale, ['landing-page']);
  
  return (
    <section className="pt-20  ">
      <div className="pt-20 grid grid-cols-2 gap-4 max-sm:grid-cols-1 lg:max-w-[1440px] lg:mx-auto">
        <div className="grid place-items-center max-sm:hidden">
          <img src="/images/phone.png" alt="" />
        </div>
        <div className=" grid content-end">
          <div className="relative">
            <div className="grid place-items-start mb-10 w-[664px] lg:w-[712px] h-[282px] bg-[#2B3467] rounded-[50px] max-sm:place-items-center max-sm:w-[345px] max-sm:h-[310px]">
              <div className=" pl-14 max-sm:p-0 max-sm:text-center ">
                <h2 className="text-white leading-9 pb-4 pt-14 lg:w-[560px] w-[567px] max-sm:text-[24px] max-sm:w-[313px] max-sm:pt-5 max-sm:leading-tight">
                  {t("more_interactions_of_the_guest_with_additional_hotel_services")}
                </h2>
                <p className="text-white lg:w-[600px] w-[567px] max-sm:text-[18px] max-sm:w-[313px]">
                  {t("using_a_mobile_application_guests_can_more_conveniently_use_the_additional_services_of_your_hotel_leaving_requests_for_the_necessary_service")}
                </p>
              </div>
            </div>
            <img
              src="/images/interation.svg"
              alt=""
              className="absolute left-0 -top-10 pl-14 max-sm:pl-5 max-sm:w-[80px] max-sm:-top-3"
            />
          </div>
        </div>

        <div className="relative mt-6">
          <div className="grid place-items-start mb-10 w-[664px] lg:w-[712px] h-[282px] bg-[#2B3467] rounded-[50px] max-sm:place-items-center max-sm:w-[345px] max-sm:h-[310px]">
            <div className="pl-14 max-sm:p-0 max-sm:text-center ">
              <h2 className="text-white font-bold leading-9 pb-4 pt-14 lg:w-[560px] w-[540px] max-sm:text-[24px] max-sm:w-[313px] max-sm:pt-0 max-sm:leading-tight">
                {t("direct_sales_are_no_longer_dependent_on_the_motivation_of_employees")}
              </h2>
              <p className="text-white lg:w-[600px] w-[567px] max-sm:w-[313px]">
                {t("elgiz_will_reduce_the_risks_of_frequent_personnel_and_low_motivation_of_hotel_staff")}
              </p>
            </div>
          </div>
          <img
            src="/images/sales.svg"
            alt=""
            className="absolute left-0 -top-10 pl-14 max-sm:pl-5 max-sm:w-[80px] max-sm:-top-3"
          />
        </div>
        <div className="relative mt-6">
          <div className="grid place-items-start mb-10 w-[664px] lg:w-[712px] h-[282px] bg-[#2B3467] rounded-[50px] max-sm:place-items-center max-sm:w-[345px] max-sm:h-[310px]">
            <div className="pl-14 max-sm:p-0 max-sm:text-center">
              <h2 className="text-white font-bold leading-9 pb-4 pt-14 lg:w-[560px] w-[500px] max-sm:text-[24px] max-sm:w-[313px] max-sm:pt-0 max-sm:leading-tight">
                {t("advertising_of_various_services_events_and_shares_of_the_hotel")}
              </h2>
              <p className="text-white lg:w-[600px] w-[567px] max-sm:w-[313px]">
                {t("in_the_elgiz_app_the_hotel_will_have_the_opportunity_to_additionally_place_its_advertisement")}
              </p>
            </div>
          </div>
          <img
            src="/images/ads.svg"
            alt=""
            className="absolute left-0 -top-10 pl-14 max-sm:pl-5 max-sm:w-[80px] max-sm:-top-3"
          />
        </div>
      </div>
      <div className="flex justify-center">
        <Link href="/checkout">
          <button className=" w-[273px] h-[72px] rounded-lg bg-[#2B3467] text-white">
            {t("register")}
          </button>
        </Link>
        
      </div>
    </section>
  );
};

export default Section3;
