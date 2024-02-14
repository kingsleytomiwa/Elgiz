'use client';

import React, { Component } from "react";
import Slider from "react-slick";
import Link from "next/link";
import Image from "next/image";
import LogoIcon from "@/public/icons/logo.svg";
import Arrow from "@/public/images/arrow.svg";
import Hotel from "@/public/images/hotel.svg";
import Automation from "@/public/images/automation.svg";
import Arrow1 from "@/public/images/arrow1.svg";
import Arrow2 from "@/public/images/arrow2.svg";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTranslation } from "react-i18next";

class OperationSlider extends Component<{ t: any }> {
  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };

    const { t } = this.props;

    return (
      <>
        <div className="ml-5 my-10 max-sm:w-[345px]" id="slider">
          <h3 className="font-bold mb-3">{t("how_it_works")}?</h3>
          <p className="underline opacity-50">{t("we_can_show_clearly")}</p>
        </div>
        <div className="grid place-items-center ">
          <Slider {...settings} className=" max-w-[345px] ">
            <div className="grid place-items-center">
              <div className=" grid place-items-center mb-4">
                <div className="pt-5 flex items-center gap-[184px] mx-auto mb-20 ml-4">
                  <div className=" flex-1">
                    <div className="flex ml-[93px]">
                      <div className="relative flex justify-center items-center">
                        <Image
                          className="object-contain"
                          src={"/images/polygon.svg"}
                          width={62}
                          height={71}
                          alt="polygon"
                        />
                        <p className="text-blue-500 text-[8px] absolute block">{t("reception")}</p>
                      </div>
                      <div className="relative flex justify-center items-center -ml-[1px]">
                        <Image
                          className="object-contain"
                          src={"/images/polygon.svg"}
                          width={62}
                          height={71}
                          alt="polygon"
                        />
                        <p className="text-blue-500 text-[8px] absolute block">{t("restaurant")}</p>
                      </div>
                    </div>

                    <div className="flex -mt-[18px] ml-[62px]">
                      <div className="relative flex justify-center items-center">
                        <Image
                          className="object-contain"
                          src={"/images/polygon.svg"}
                          width={62}
                          height={71}
                          alt="polygon"
                        />
                        <p className="text-blue-500 text-[8px] absolute block">{t("parking")}</p>
                      </div>
                      <div className="relative flex justify-center items-center -ml-[1px]">
                        <Image
                          className="object-contain"
                          src={"/images/polygon.svg"}
                          width={62}
                          height={71}
                          alt="polygon"
                        />
                        <p className="text-blue-500 text-[8px] absolute block">{t("room_service")}</p>
                      </div>
                      <div className="flex -ml-[93px] -mb-[105px]">
                        <div className="relative flex justify-center items-center">
                          <Image
                            className="object-contain"
                            src={"/images/polygon.svg"}
                            width={62}
                            height={71}
                            alt="polygon"
                          />
                          <p className="text-blue-500 text-[8px] absolute block">{t("shop")}</p>
                        </div>
                        <div className="relative flex justify-center items-center -ml-[1px]">
                          <Image
                            className="object-contain"
                            src={"/images/polygon.svg"}
                            width={62}
                            height={71}
                            alt="polygon"
                          />
                          <p className="text-blue-500 text-[8px] absolute block">{t("fitness_zone")}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="font-bold mb-3">Модульная система</h3>
                <p className="w-[340px] text-center ">
                  {t("elgiz_provides_a_modular_structure_of_your_hotel_which_consists_of_independent_blocks_and_allows_you_to_individually_configure_the_services_available_to_your_guests")}
                </p>
              </div>
            </div>

            <div>
              <div className="grid place-items-center mb-4">
                <div className=" w-[321px] ">
                  <button className=" w-[321px] h-[56px] rounded-lg bg-[#2B3467] text-white">
                    {t("begin")}
                  </button>
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
                <div className="mt-16 mb-8">
                  <Link href="/#calculator">
                    <h2 className="underline font-bold text-[32px]">{t("calculator")}</h2>
                  </Link>
                </div>
                <h3 className="font-bold mb-3">{t("registration")}</h3>
                <p className="w-[340px] text-center ">
                  {t("fill_in_the_form_create_your_own_tariff_and_confirm_your_hotel_data")}
                </p>
              </div>
            </div>

            <div>
              <div className="grid place-items-center ">
                <div className="flex justify-center gap-8 mb-10">
                  <Image src={LogoIcon} alt="logo icon" width={90} />
                  <Image src={Arrow} alt="arrow" width={70} />
                  <Image src={Hotel} alt="hotel" width={90} />
                </div>
                <h3 className="font-bold mb-3 w-[280px] text-center">
                  {t("synchronization_with_your_hotel_pms")}
                </h3>
                <p className="w-[340px] text-center ">
                  {t("our_specialist_synchronizes_elgiz_with_your_hotel_management_system")}
                </p>
              </div>
            </div>
            <div>
              <div className="grid place-items-center">
                <Image src={Automation} alt="" />
                <h3 className=" font-bold mt-5">{t("automation_and_analytics")}</h3>
                <p className="w-[340px] text-center pt-5">
                  {t("elgiz_provides_a_modular_structure_of_your_hotel_which_consists_of_independent_blocks_and_allows_you_to_individually_configure_the_services_available_to_your_guests")}
                </p>
              </div>
            </div>
          </Slider>
        </div>
      </>
    );
  }
}

export default withMyHook(OperationSlider);

function withMyHook(Component) {
  return function WrappedComponent(props) {
    const { t } = useTranslation();
    return <Component {...props} t={t} />;
  }
}