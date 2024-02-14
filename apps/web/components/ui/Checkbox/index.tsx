import { twMerge } from "tailwind-merge";
import Image from "next/image";

interface Props {
  label: string | React.ReactNode;
  check: boolean;
  click: () => void;
}

const Checkbox: React.FC<Props> = ({ label, check = false, click }) => {
  return (
    <button type="button" onClick={click} className="flex gap-2 items-center">
      <div
        className={twMerge(
          "w-4 h-4 flex items-center justify-center bg-blue-500  border border-white rounded-[4px]"
        )}
      >
        {check && <Image src={"/icons/check2.svg"} alt="check icon" width={12} height={12} />}
      </div>

      <p className="text-[20px]">{label}</p>
    </button>
  );
};

export default Checkbox;
