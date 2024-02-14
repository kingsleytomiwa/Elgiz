import { View } from "react-native";
import CustomText from "../CustomText";
import { useMemo } from "react";
import { Parameter, ParameterType } from "@prisma/client";
import { i18n } from "../../../App";

const Prices = ({ sum, tax }: { sum: number; tax?: number }) => {
  return (
    <View>
      {tax ? (
        <View className="flex flex-row items-center mt-[20px] opacity-50">
          <CustomText variant="regular" className="text-[20px] text-[#2B3467]">
            Доставка в номер
          </CustomText>
          <View className="flex-1 border-b border-blue-400 opacity-25 ml-[15px] mr-2.5" />
          <CustomText className="text-[14px] text-blue-400">EUR {tax}</CustomText>
        </View>
      ) : null}

      <View className="flex flex-row items-center mt-[8px]">
        <CustomText variant="bold" className="text-[20px] text-blue-400">
          {i18n?.t("to_pay")}
        </CustomText>
        <View className="flex-1 border-b border-blue-400 opacity-25 ml-[15px] mr-2.5" />
        <CustomText className="text-[14px] text-blue-400">EUR {sum}</CustomText>
      </View>
    </View>
  );
};

export default Prices;
