import { TouchableOpacity, View } from "react-native";
import React from "react";
import { twMerge } from "tailwind-merge";
import CheckIcon from "../icons/CheckIcon";
import CustomText from "../../CustomText";

interface Props {
  value: boolean;
  onClick: () => void;
  className?: string;
  label?: string;
}

const Checkbox: React.FC<Props> = ({
  value,
	onClick,
  className,
  label,
}) => {
  return (
    <TouchableOpacity
      className="flex flex-row items-center"
      onPress={onClick}
    >
      <View
        className={twMerge(
          "w-4 h-4 rounded-[4px] flex items-center justify-center border-[1.5px] border-[#676E7629]",
          value && "bg-blue-400 border-blue-400",
          className
        )}
      >
        <CheckIcon />
      </View>
      <CustomText className="text-[20px] text-blue-400 ml-2">
        {label}
      </CustomText>
    </TouchableOpacity>
  );
};

export default Checkbox;
