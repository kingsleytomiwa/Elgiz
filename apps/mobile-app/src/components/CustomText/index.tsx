import { Text, TextProps } from "react-native";
import { twMerge } from "tailwind-merge";

const VARIANT_STYLES = {
  regular: {
    fontFamily: "GolosRegular",
  },
  medium: {
    fontFamily: "GolosMedium",
  },
  bold: {
    fontFamily: "GolosBold",
  },
} as const;

export type FontVariant = keyof typeof VARIANT_STYLES;

type CustomTextProps = TextProps & {
  variant?: FontVariant;
};

const CustomText: React.FC<CustomTextProps> = ({
  children,
  className,
  variant = "regular",
  ...props
}) => {
  return (
    <Text
      style={{
        fontFamily: VARIANT_STYLES[variant].fontFamily,
      }}
      className={twMerge("text-gray-400", className)}
      {...props}
    >
      {children}
    </Text>
  );
};

export default CustomText;
