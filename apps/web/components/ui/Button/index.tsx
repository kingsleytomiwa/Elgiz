import { twMerge } from "tailwind-merge";

const Button: React.FC<React.ComponentProps<"button">> = ({ className, children, ...props }) => {
  return (
    <button
      className={twMerge(
        "py-2.5 px-6 bg-blue-500 rounded-[10px] w-full text-sm text-white hover:opacity-80 duration-300",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
