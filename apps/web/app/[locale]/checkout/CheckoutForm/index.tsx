"use client";

import Footer from "@/components/Footer";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Checkbox from "@/components/ui/Checkbox";
import Image from "next/image";
import Link from "next/link";
import LogoIcon from "@/public/icons/logo.svg";
import SignUpIcon from "@/public/icons/signup1.svg";
import SignUpIcon2 from "@/public/icons/signup2.svg";
import SignUpIcon3 from "@/public/icons/signup3.svg";
import SuccessIcon from "@/public/icons/success.svg";
import WaitingReviewIcon from "@/public/icons/waiting-review.svg";
import LineIconLeft from "@/public/icons/Line_l.svg";
import LineIconRight from "@/public/icons/Line_r.svg";
import { useCallback, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import ChekcoutNav from "@/components/CheckoutNav";
import Price, { Data } from "@/components/Price";
import ArrowIcon from "@/public/icons/arrow.svg";
import CountrySelect from "@/components/ui/CountrySelect";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { checkEmailExists, createHotel } from "../actions";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { languagesAndLocales } from "utils/constants";

export const VIEW = {
  signUp1: "signUp1",
  signUp2: "signUp2",
  signUp3: "signUp3",
  checkout1: "checkout1",
  checkout2: "checkout2",
  checkout3: "checkout3",
  checkout4: "checkout4",
  success: "success",
  waitingConfirmation: "waitingConfirmation",
} as const;
export type View = (typeof VIEW)[keyof typeof VIEW];

interface Props extends Partial<Data> { }

const CheckoutForm: React.FC<Props> = ({ rooms, period, extras }) => {
  const [data, setData] = useState({
    password: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    responsiblePersonName: "",
    responsiblePersonPosition: "",
    rooms: rooms || 0,
    period: period || 3,
    extras: extras || [],
  });
  const [isChecked, setIsChecked] = useState(false);
  const [hotelId, setHotelId] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { t, i18n } = useTranslation("landing-signup");

  const [view, setView] = useState<View>(VIEW.signUp1);

  const onViewChange = useCallback((view: View) => {
    setView(view);
  }, []);

  const signupFields = useMemo(() => {
    const emailField = (
      <Input
        placeholder={t("your_mail")}
        onChange={(e) => setData({ ...data, email: e.target.value })}
        value={data.email}
        disabled={view !== VIEW.signUp1}
        required
        type="email"
      />
    );

    switch (view) {
      case VIEW.signUp1: {
        return {
          label: t("let_s_start_dating"),
          image: SignUpIcon,
          fields: <>{emailField}</>,
          action: async () => {
            if (await checkEmailExists(data.email)) {
              toast.error("Пользователь с такой почтой уже существует");
              return;
            }

            onViewChange(VIEW.signUp2);
          },
        };
      }

      case VIEW.signUp2: {
        return {
          label: t("the_last_details_about_you"),
          image: SignUpIcon2,
          fields: (
            <>
              {emailField}
              <Input
                placeholder={t("responsible_person")}
                value={data.responsiblePersonName}
                onChange={(e) =>
                  setData((data) => ({ ...data, responsiblePersonName: e.target.value }))
                }
                required
              />
              <Input
                placeholder={t("job_title")}
                value={data.responsiblePersonPosition}
                onChange={(e) =>
                  setData((data) => ({ ...data, responsiblePersonPosition: e.target.value }))
                }
                required
              />
              <Input
                placeholder={t("password")}
                value={data.password}
                onChange={(e) => setData((data) => ({ ...data, password: e.target.value }))}
                required
                type="password"
              />
              <Input
                placeholder={t("confirm_the_password")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                type="password"
              />
            </>
          ),
          action: async () => {
            if (data.password !== confirmPassword) {
              toast.error("Пароли не совпадают");
              return;
            }

            onViewChange(VIEW.signUp3);
          },
        };
      }

      case VIEW.signUp3: {
        return {
          label: t("tell_us_about_the_hotel"),
          image: SignUpIcon3,
          fields: (
            <>
              <Input
                placeholder={t("the_name_of_the_hotel")}
                value={data.name}
                onChange={(e) => setData((data) => ({ ...data, name: e.target.value }))}
              />
              <Input
                placeholder={t("telephone")}
                value={data.phone}
                onChange={(e) => setData((data) => ({ ...data, phone: e.target.value }))}
              />
              <Input
                placeholder={t("address")}
                value={data.address}
                onChange={(e) => setData((data) => ({ ...data, address: e.target.value }))}
              />
              <Input
                placeholder={t("city")}
                value={data.city}
                onChange={(e) => setData((data) => ({ ...data, city: e.target.value }))}
              />
              <CountrySelect
                value={data.country}
                onChange={(e) => setData((data) => ({ ...data, country: e.target.value }))}
              />
            </>
          ),
          action: async () => {
            onViewChange(VIEW.checkout1);
          },
        };
      }
    }
  }, [view, data, setData, view, onViewChange, confirmPassword, setConfirmPassword]);

  const createSubscription = useCallback(async () => {
    return fetch("/api/subscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.text())
      .then((id) => id);
  }, [data]);

  const onApprove = useCallback(async (data: any) => {
    try {
      await fetch("/api/subscription/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      onViewChange(VIEW.success);
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <>
      <div
        className={twMerge(
          "fixed w-screen duration-500 opacity-0 pointer-events-none",
          [VIEW.signUp1, VIEW.signUp2, VIEW.signUp3].includes(view as any) &&
          "opacity-100 pointer-events-auto"
        )}
      >
        <div className="h-screen overflow-y-auto">
          <div className="flex">
            <div className="flex-1 bg-[#FDFFF1] flex justify-end md:mx-10">
              <form
                className="max-w-[600px] w-full pt-6"
                onSubmit={async (e) => {
                  e.preventDefault();
                  await signupFields?.action();
                }}
              >
                <div className="w-full max-sm:border-b-2 max-sm:pb-5 max-sm:pl-5">
                  <Link href="/">
                    <Image src={LogoIcon} alt="logo icon" />
                  </Link>
                </div>
                <div className="max-sm:max-w-[393px] max-sm:mx-auto">
                  <p className="mt-[144px] max-sm:mt-10 max-sm:ml-5 text-3xl max-sm:text-[24px] font-bold text-blue-500">
                    {t("welcome_to_elgiz")}
                  </p>
                  <p className="mt-4 max-sm:mt-2 max-sm:ml-5 text-xl max-sm:text-[24px] text-blue-500">
                    {signupFields?.label}
                  </p>
                  <div className="w-full max-sm:max-w-[345px] flex flex-col gap-6 mt-12 max-sm:mt-16 max-w-[321px] max-sm:mx-auto">
                    {signupFields?.fields}
                  </div>
                  <div className="max-sm:grid max-sm:place-items-center pb-20">
                    <Button type="submit" className="max-w-[321px] max-sm:max-w-[345px] mt-6 block">
                      {t("continue")}
                    </Button>
                  </div>
                </div>
              </form>
            </div>

            <div className="h-screen sticky top-0 flex-1 bg-blue-500 flex items-center justify-center max-sm:hidden">
              <Image src={signupFields?.image} alt="sign-up icon" />
            </div>
          </div>
          <Footer checkout />
        </div>
      </div>

      <div
        className={twMerge(
          "fixed w-screen pointer-events-none opacity-0 duration-500",
          view === "checkout1" && "pointer-events-auto opacity-100  scale-y-100"
        )}
      >
        <div className="h-screen overflow-y-auto">
          <form
            className="max-w-[1444px] mx-auto pt-6 h-screen max-sm:h-auto max-sm:mb-10"
            onSubmit={async (e) => {
              e.preventDefault();

              if (!isChecked) {
                toast.error("Пожалуйста, согласитесь с Правилами и условиями пользования");
                return;
              }

              if (await checkEmailExists(data.email)) {
                toast.error("Пользователь с такой почтой уже существует");
                return;
              }

              onViewChange(VIEW.checkout2);
            }}
          >
            <div className="w-full max-sm:border-b-2 max-sm:pb-5  max-sm:pl-5">
              <Link href="/">
                <Image src={LogoIcon} alt="logo icon" />
              </Link>
            </div>
            <div className="flex max-sm:flex-col max-sm:mx-auto max-sm:max-w-[393px] gap-6 mt-20 max-sm:mt-14">
              <div className="max-sm:mx-auto max-sm:mb-20">
                <ChekcoutNav setView={onViewChange} step="step1" />
              </div>
              <div className="flex-1 grid grid-cols-2  max-sm:grid-cols-1 max-sm:place-items-center gap-x-16 gap-y-8 h-fit max-sm:max-w-[345px] max-sm:mx-auto">
                <Input
                  placeholder={t("the_name_of_the_hotel")}
                  value={data.name}
                  onChange={(e) => setData((data) => ({ ...data, name: e.target.value }))}
                />
                <Input
                  placeholder={t("your_mail")}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  value={data.email}
                  required
                  type="email"
                />
                <Input
                  placeholder={t("responsible_person")}
                  value={data.responsiblePersonName}
                  onChange={(e) =>
                    setData((data) => ({ ...data, responsiblePersonName: e.target.value }))
                  }
                  required
                />
                <Input
                  placeholder={t("job_title")}
                  value={data.responsiblePersonPosition}
                  onChange={(e) =>
                    setData((data) => ({ ...data, responsiblePersonPosition: e.target.value }))
                  }
                  required
                />
                <Input
                  placeholder={t("telephone")}
                  value={data.phone}
                  onChange={(e) => setData((data) => ({ ...data, phone: e.target.value }))}
                />
                <Input
                  placeholder={t("address")}
                  value={data.address}
                  onChange={(e) => setData((data) => ({ ...data, address: e.target.value }))}
                />
                <Input
                  placeholder={t("city")}
                  value={data.city}
                  onChange={(e) => setData((data) => ({ ...data, city: e.target.value }))}
                />
                <CountrySelect
                  value={data.country}
                  onChange={(e) => setData((data) => ({ ...data, country: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-center max-sm:block ml-64 max-sm:mx-0 mt-12 max-sm:mt-8 max-sm:mb-10">
              <div className="grid place-items-center">
                <Button type="submit" className="max-w-[300px] block max-sm:max-w-[345px]">
                  {t("confirm")}
                </Button>

                <div className="mt-6 max-sm:max-w-[345px] max-sm:mb-5">
                  <Checkbox
                    label={
                      <a
                        className="underline"
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://elgiz.notion.site/Terms-and-Conditions-d50aa90813684b5b890cc2422da7e99e"
                      >
                        {t("i_agree_with_the_rules_and_conditions_of_use")}
                      </a>
                    }
                    check={isChecked}
                    click={() => setIsChecked(!isChecked)}
                  />
                </div>
              </div>
            </div>
          </form>
          <Footer checkout />
        </div>
      </div>

      <div
        className={twMerge(
          "fixed w-screen duration-500 pointer-events-none opacity-0",
          view === "checkout2" && "pointer-events-auto opacity-100"
        )}
      >
        <div className="h-screen overflow-y-auto">
          <div className="max-w-[1444px] lg:max-w-[1440px] mx-auto pt-6 pb-[180px] max-sm:pb-12">
            <div className="w-full max-sm:border-b-2 max-sm:pb-5  max-sm:pl-5">
              <Link href="/">
                <Image src={LogoIcon} alt="logo icon" />
              </Link>
            </div>

            <form
              className="mt-20 flex gap-6 max-sm:gap-0"
              onSubmit={(e) => {
                e.preventDefault();
                onViewChange(VIEW.checkout3);
              }}
            >
              <div className="max-sm:mx-auto">
                <ChekcoutNav setView={onViewChange} step="step2" />
              </div>
              <div className="max-sm:w-[345px] max-sm:mx-auto sm:hidden ">
                <p className="max-w-[280px] mb-16 mt-4">
                  Мы уже заполнили тариф по вашим пожеланиям!
                </p>
              </div>

              <div className="flex-1 max-sm:grid max-sm:place-items-center max-sm:mt-0">
                <Price checkout data={data as any} setData={setData as any} />

                <div className="mt-[67px] max-sm:mt-5 flex justify-between gap-4 max-sm:grid max-sm:grid-cols-1">
                  <Button
                    onClick={() => onViewChange(VIEW.checkout1)}
                    type="button"
                    className="border max-w-[321px] max-sm:w-[345px] w-full border-blue-500 bg-transparent text-blue-500 max-sm:order-last"
                  >
                    {t("the_last_step")}
                  </Button>

                  <Button
                    type="submit"
                    className="max-w-[321px] max-sm:w-[345px] w-full max-sm:mt-4 max-sm:order-first"
                  >
                    {t("confirm")}
                  </Button>
                </div>
              </div>
            </form>
          </div>
          <Footer checkout />
        </div>
      </div>

      <div
        className={twMerge(
          "fixed w-screen duration-500 pointer-events-none opacity-0",
          view === "checkout3" && "pointer-events-auto opacity-100"
        )}
      >
        <div className="h-screen overflow-y-auto">
          <div className="max-w-[1444px] mx-auto pt-6 pb-[180px] max-sm:pb-10 h-screen max-sm:h-auto">
            <div className="w-full max-sm:border-b-2 max-sm:pb-5  max-sm:pl-5">
              <Link href="/">
                <Image src={LogoIcon} alt="logo icon" />
              </Link>
            </div>
            <div className="mt-20 flex gap-4 max-sm:gap-14 max-sm:flex-col max-sm:items-center">
              <ChekcoutNav setView={onViewChange} step="step3" />
              <div className="flex-1 flex flex-col gap-6 items-center pr-[300px]">
                {view === VIEW.checkout3 && (
                  <PayPalScriptProvider
                    options={{
                      clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
                      locale: languagesAndLocales?.find(l => l.lang === i18n.language)?.locale,
                      currency: "EUR",
                      vault: true,
                    }}
                  >
                    <div className="max-w-[300px] w-[300px]">
                      <PayPalButtons
                        onApprove={onApprove}
                        createSubscription={createSubscription}
                      />
                    </div>
                  </PayPalScriptProvider>
                )}

                <div className="flex max-sm:justify-center items-center gap-16 relative">
                  <div className="flex items-center ">
                    <Image src={LineIconLeft} alt="line icon" />
                  </div>
                  <div className="opacity-50 absolute left-[124px] max-sm:left-[132px] -top-3.5">
                    или
                  </div>
                  <div className="">
                    <Image src={LineIconRight} alt="line icon" />
                  </div>
                </div>

                <Button
                  onClick={async () => {
                    try {
                      setHotelId(await createHotel(data));
                      onViewChange(VIEW.checkout4);
                    } catch (error) {
                      console.error(error);
                      toast.error("Произошла ошибка");
                    }
                  }}
                  className="max-w-[300px] w-full"
                >
                  {t("banking_transfer")}
                </Button>
              </div>
            </div>
          </div>
          <Footer checkout />
        </div>
      </div>

      <div
        className={twMerge(
          "fixed w-screen duration-500 pointer-events-none opacity-0",
          view === "checkout4" && "pointer-events-auto opacity-100"
        )}
      >
        <div className="h-screen overflow-y-auto">
          <div className="max-w-[1444px] mx-auto pt-6 pb-[180px]  max-sm:pb-20 min-h-screen">
            <div className="w-full max-sm:border-b-2 max-sm:pb-5  max-sm:pl-5">
              <Link href="/">
                <Image src={LogoIcon} alt="logo icon" />
              </Link>
            </div>
            <div className="flex gap-16 mt-20 max-sm:grid max-sm:place-items-center max-sm:max-w-[393px]">
              <ChekcoutNav setView={onViewChange} step="step3" />
              <div className="flex-1 max-w-[500px] h-fit text-blue-500 max-sm:text-center">
                <button
                  onClick={() => onViewChange(VIEW.checkout3)}
                  className="flex gap-4 items-center w-fit"
                >
                  <Image src={ArrowIcon} alt="arrow icon" />
                  <p className="text-[20px]">{t("back")}</p>
                </button>
                <p className="my-4 font-bold text-[20px]">{t("bank_details_for_transfer")}</p>
                <p className="text-[14px]">
                  IBAN: <span className="text-[20px]">200029388103038100MD</span>
                </p>
                <p className="text-[14px]">
                  SWIFT/BIC: <span className="text-[20px]">CR0094M</span>
                </p>
                <p className="text-[14px]">
                  Name: <span className="text-[20px]">Moldova bank</span>
                </p>
                <p className="text-[14px]">
                  ID отеля: <span className="text-[20px]">{hotelId}</span>
                </p>
                <p className="mt-[190px] max-sm:mt-10 w-full max-sm:max-w-[345px] text-center text-[14px]">
                  {t("click")} <span className="font-bold">«{t("confirm")}»</span>, {t("to_finish_the_registration_process")}
                </p>

                <Button
                  className="mt-4 mx-auto max-w-[300px] block"
                  onClick={() => setView(VIEW.waitingConfirmation)}
                >
                  {t("confirm")}
                </Button>
              </div>
            </div>
          </div>
          <Footer checkout />
        </div>
      </div>

      {[VIEW.success, VIEW.waitingConfirmation].includes(view as any) && (
        <div className="fixed w-screen duration-500">
          <div className="h-screen overflow-y-auto">
            <div className="max-w-[1444px] mx-auto pt-6 pb-[180px] max-sm:pb-20 min-h-screen">
              <div className="w-full max-sm:border-b-2 max-sm:pb-5  max-sm:pl-5">
                <Link href="/">
                  <Image src={LogoIcon} alt="logo icon" />
                </Link>
              </div>

              <div className="flex-col mt-20 grid place-items-center max-sm:max-w-[393px]">
                {view === VIEW.success ? (
                  <>
                    <Image src={SuccessIcon} alt="logo icon" />

                    <h2 className="mt-10 text-[24px] max-sm:w-[345px] max-sm:text-center">
                      {t("you_have_successfully_registered")}
                    </h2>

                    <p className="mt-5 max-w-[500px] text-center max-sm:w-[345px]">
                      {t("go_to_the_portal_to_start_work")}
                    </p>
                  </>
                ) : (
                  <>
                    <Image src={WaitingReviewIcon} alt="logo icon" />

                    <h2 className="mt-10 text-[24px] max-sm:w-[345px] max-sm:text-center">
                      {t("thanks_for_your_request")}
                    </h2>

                    <p className="mt-5 max-w-[500px] text-center max-sm:w-[345px]">
                      {t("as_soon_as_the_bank_transfer_is_received_we_activate_your_account")}
                    </p>
                  </>
                )}

                <div className="mt-10">
                  <a href="https://portal.elgiz.io">
                    <Button className="w-[321px]">{t("go_to_the_portal")}</Button>
                  </a>

                  <Link href="/">
                    <Button className="mt-4 w-[321px] block bg-[#2B3467] bg-opacity-10 text-blue-500">
                      {t("the_main_page")}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <Footer checkout />
          </div>
        </div>
      )}
    </>
  );
};

export default CheckoutForm;
