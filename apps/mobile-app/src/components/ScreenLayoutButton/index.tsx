import React, { useMemo } from "react";
import { KeyboardAvoidingView, Platform, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { twMerge } from "tailwind-merge";
import ArrowIcon from "../../../assets/icons/arrow.svg";
import CustomText from "../CustomText";
import { RootStackParamList } from "../../../typings/nav";
import { i18n } from "../../../App";

interface Props {
  children: React.ReactNode;
  buttonText?: string;
  buttonTo?: keyof RootStackParamList;
  onSubmit?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  goesBack?: boolean;
}

const ScreenLayoutButton: React.FC<Props> = ({
  children,
  buttonText,
  buttonTo,
  onSubmit,
  isLoading,
  disabled = false,
  goesBack = true,
}) => {
  const { navigate, goBack } = useNavigation();
  const submitDisabled = useMemo(() => disabled || isLoading, [disabled, isLoading]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView className="h-full pt-[21px] bg-gray-100 relative">
        {goesBack && (
          <TouchableOpacity
            onPress={() => goBack()}
            className="flex flex-row items-center ml-4"
            disabled={isLoading}
          >
            <ArrowIcon />
            <CustomText className="text-[20px] ml-4">{i18n?.t("back")}</CustomText>
          </TouchableOpacity>
        )}
        {children}
        {buttonText && (
          <View className="absolute bottom-[5%] flex items-center left-0 right-0">
            <TouchableOpacity
              disabled={submitDisabled}
              onPress={async () => {
                await onSubmit?.();
                // @ts-ignore
                buttonTo && navigate(buttonTo);
              }}
              className={twMerge("bg-red-400 w-[252px] h-[55px] flex items-center justify-center rounded-[20px]", submitDisabled && "bg-red-300")}
            >
              <CustomText variant="bold" className="text-[20px] text-gray-100">
                {buttonText}
              </CustomText>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default ScreenLayoutButton;
