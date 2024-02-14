import { twMerge } from "tailwind-merge";
import Image from "next/image";
import React from "react";

interface Props {
  label: string;
  check: boolean;
  click: () => void;
}

const Checkbox2: React.FC<Props> = ({ label, check = false, click }) => {
  const addunderline = (label) => {
    const words = label.split('');
    return words.map((word, index) => {
      if (index >= 13) {
        return <span style={{ textDecoration: 'underline' }} key={index}>{word}</span>;
      }
      return word;
    });
  };

  return (
    <>
    <div className="flex items-center gap-2">
      <button onClick={click} className="flex gap-2 items-center">
        <div
          className={twMerge(
            "w-4 h-4 flex items-center justify-center bg-white  border border-blue-500 rounded-[4px]",
            check && "bg-blue-500"
          )}
        >
          {check && (
            <Image
              src={"/icons/check2.svg"}
              alt="check icon"
              width={12}
              height={12}
            />
          )}
        </div>
      </button>
      <label className="">
        <p>
          {addunderline(label)}
        </p>
      </label>
      </div>
    </>


  );
};

export default Checkbox2;
