import { twMerge } from "tailwind-merge";

type variantStyle = "borderBottom";

type Props = {
  className?: string;
  variant?: variantStyle;
} & React.ComponentProps<"input">;

const Input: React.FC<Props> = ({ className, variant, ...inputProps }) => {
  return (
    <input
      className={twMerge(
        "p-4 bg-transparent rounded-[8px] border border-[#D9D9D9] text-base w-full h-[56px] notBorder",
        variant === "borderBottom" &&
          "p-0 pb-2 border-t-0 border-x-0 border-blue-500 h-[40px] rounded-none",
        className
      )}
      {...inputProps}
    />
  );
};

export default Input;
