import { twMerge } from "tailwind-merge";

type variantStyle = "borderBottom";

type Props = {
  className?: string;
  variant?: variantStyle;
  options: { value: string; label: string }[];
  label?: string;
} & React.ComponentProps<"select">;

const Select: React.FC<Props> = ({ className, variant, options, label, ...props }) => {
  return (
    <select
      className={twMerge(
        "bg-transparent rounded-[8px] border border-[#D9D9D9] text-base w-full h-[56px] notBorder",
        variant === "borderBottom" &&
          "p-0 border-t-0 border-x-0 border-blue-500 h-[40px] rounded-none",
        className
      )}
      {...props}
    >
    {options.map((option) => (
        <option key={option.value} className="text-base font-secondary" value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
