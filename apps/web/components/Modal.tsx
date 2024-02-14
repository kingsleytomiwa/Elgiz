"use client";

import { useTranslation } from "react-i18next";
import React, { useEffect } from "react";

const BACKGROUND_STYLE = {
  top: "0",
  left: "0",
  bottom: "0",
  backgroundColor: "rgb(0,0,0,0.2)",
  zindex: "1000",
};

const Modal = ({ isOpen, onClose }) => {
  const i18n = useTranslation();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }
  return (
    <>
      <div
        style={BACKGROUND_STYLE}
        className="fixed backdrop-blur-sm z-40 w-full  flex justify-center items-center"
      >
        <div className=" overflow-auto w-full max-w-[1228px]  h-[838px] max-sm:h-full  border bg-[#FFFFFF] rounded-[50px] max-sm:rounded-none">
          <h2 className="flex justify-center mt-6 mb-16 text-[#2B3467] max-sm:ml-5">
            {i18n?.t("what_is_implementation")}
          </h2>
          <div className="grid grid-cols place-items-center ">
            <div className=" grid grid-cols-2 place-items-center gap-y-14 gap-x-40 max-sm:grid-cols-1">
              <div className=" max-sm:mx-5 text-[#2B3467]">
                <img src="/images/employee.svg" alt="" />
                <p className="max-w-[350px] mt-5">
                  {i18n?.t("we_will_create_staff_accounts_and_train_them_to_work_with_our_service_in_order_to_reveal_the_entire_potential_of_elgiz")}
                </p>
              </div>
              <div className=" max-sm:mx-5 place-items-center text-[#2B3467]">
                <img src="/images/translate.svg" alt="" />
                <p className="max-w-[350px] mt-5">
                  {i18n?.t("we_will_make_a_certified_translation_of_all_the_goods_and_services_of_your_hotel_presented_in_our_portal_and_add_them_to_the_database")}
                </p>
              </div>
              <div className=" max-sm:mx-5 text-[#2B3467]">
                <img src="/images/setting.svg" alt="" />
                <p className="max-w-[350px] mt-5">
                  {i18n?.t("similarly_we_will_configure_the_portal_according_to_the_needs_of_the_hotel")}
                </p>
              </div>
              <div className=" max-sm:mx-5 text-[#2B3467]">
                <img src="/images/calendary.svg" alt="" />
                <p className="max-w-[350px] mt-5">
                  {i18n?.t("we_guarantee_the_support_of_all_your_changes_the_transfer_of_new_goods_and_services_during_the_year_assistance_with_setting_up_the_elgiz_portal")}
                </p>
              </div>
            </div>
            <div className="flex justify-center mt-20 w-full max-sm:mb-10">
              <button
                onClick={onClose}
                className=" max-w-[300px] w-full h-[62px] rounded-lg bg-[#2B3467] text-white"
              >
                {i18n?.t("close")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
