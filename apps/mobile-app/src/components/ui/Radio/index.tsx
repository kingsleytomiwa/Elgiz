import { TouchableOpacity, View } from "react-native";
import React from "react";
import { twMerge } from "tailwind-merge";
import CustomText from "../../CustomText";

export type Radio<T> = {
  id: T;
  value: T;
  setValue: React.Dispatch<React.SetStateAction<T>> | ((id: T) => void);
  className?: string;
  label?: string;
};

const Radio = <T extends unknown = string>({ value, setValue, className, id, label }: Radio<T>) => {
  return (
    <TouchableOpacity
      className="flex flex-row items-center"
      onPress={() => setValue(id)}
    >
      <View
        className={twMerge(
          "w-4 h-4 rounded-full flex items-center justify-center border-[1.5px] border-[#676E7629]",
          value === id && "bg-blue-400 border-blue-400",
          className
        )}
      >
        <View className="w-1.5 h-1.5 bg-white rounded-full" />
      </View>
      <CustomText className="text-[20px] text-blue-400 ml-2">
        {label}
      </CustomText>
    </TouchableOpacity>
  );
};

export default Radio;
