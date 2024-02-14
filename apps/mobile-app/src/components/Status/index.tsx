import React from "react";
import ScreenLayoutButton from "../ScreenLayoutButton";
import CustomText from "../CustomText";
import { View, Image } from "react-native";
import { RootStackParamList } from "../../../typings/nav";

interface Props {
  title: string;
  image: any;
  children: React.ReactNode;
  buttonText: string;
  description: string;
  buttonTo: keyof RootStackParamList;
}

const Status: React.FC<Props> = ({
  title,
  image,
  children,
  buttonText,
  description,
  buttonTo,
}) => {
  return (
    <ScreenLayoutButton goesBack={false} buttonText={buttonText} buttonTo={buttonTo}>
      <CustomText
        variant="bold"
        className="text-[20px] mt-6 w-full text-center"
      >
        {title}
      </CustomText>
      <View className="mt-6 bg-blue-400 py-6 px-4 flex items-center h-[65%]">
        <Image source={image} className="h-[213px]" resizeMode="contain" />
        <View className="mt-[80px]">{children}</View>
      </View>
      <CustomText className="mt-5 w-full text-center text-[14px]">
        {description}
      </CustomText>
    </ScreenLayoutButton>
  );
};

export default Status;
