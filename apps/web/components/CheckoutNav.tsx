import DownloadIcon from "@/public/icons/download.svg";
import BigCheckIcon from "@/public/icons/big-check.svg";
import PencilIcon from "@/public/icons/pencil.svg";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { twMerge } from "tailwind-merge";
import { useTranslation } from "react-i18next";

type StepNumber = "step1" | "step2" | "step3" | "step4";

interface Props {
  step: StepNumber;
  setView: Dispatch<SetStateAction<string>>;
}

const DATA_NAV = [
  {
    text: "hotel_data",
    link: "checkout1",
  },
  {
    text: "rate",
    link: "checkout2",
  },
  {
    text: "payment",
    link: "checkout",
  },
];

const ChekcoutNav: React.FC<Props> = ({ step, setView }) => {
  const { t } = useTranslation("landing-signup");

  return (
    <div className="w-[280px] max-sm:w-[338px] rounded-[20px] border border-blue-500 h-fit">
      {DATA_NAV.map((item, i) => {
        const isStepCompleted =
          step === "step3" ||
          (step === "step2" && i < 2) ||
          (step === "step1" && i === 0);

        const isPreviousStepCompleted =
          (step === "step3" && i < 2) ||
          (step === "step2" && i < 1) ||
          (step === "step1" && i < 0);

        return (
          <div
            key={i}
            className={twMerge(
              "p-4 flex justify-between items-center border-b border-blue-500 border-opacity-50 first:pt-6 last:pb-6 last:border-none"
            )}
          >
            <div className="flex items-center gap-2">
              <Image
                src={isPreviousStepCompleted ? BigCheckIcon : DownloadIcon}
                alt={"icon"}
                width={24}
                height={24}
                className={twMerge(!isStepCompleted && "opacity-0")}
              />
              <p
                className={twMerge(
                  "text-[20px] text-blue-500",
                  isStepCompleted ? "opacity-100" : "opacity-30"
                )}
              >
                {t(item.text)}
              </p>
            </div>
            <button
              onClick={() => setView(item.link)}
              className={twMerge(!isStepCompleted || i === 2 ? "hidden" : "")}
            >
              <Image src={PencilIcon} alt="check icon" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ChekcoutNav;
