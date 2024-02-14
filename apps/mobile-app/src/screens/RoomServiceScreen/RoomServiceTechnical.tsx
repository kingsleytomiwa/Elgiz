import { KeyboardAvoidingView, Platform, View } from "react-native";
import ScreenLayoutButton from "../../components/ScreenLayoutButton";
import CustomText from "../../components/CustomText";
import RepairIcon from "../../../assets/icons/repair.svg";
import Radio from "../../components/ui/Radio";
import { useState } from "react";
import { ROUTES } from "../../routes";
import Input from "../../components/ui/Input";
import { useForm } from "react-hook-form";
import { onCreateHotelRequest } from "../../queries";
import { useNavigation } from "@react-navigation/native";
import { i18n } from "../../../App";

const RoomServiceTechnicalScreen = () => {
  const [repairStatus, setRepairStatus] = useState("TV");
  const { navigate } = useNavigation();
  const { getValues, control } = useForm({});

  const onSubmit = async () => {
    const getData = {
      subModuleId: "STAFF_HELP",
      data: {
        issue: repairStatus,
        ...(repairStatus === "other" && { issueText: getValues().problem })
      },
    };

    try {
      await onCreateHotelRequest(getData);

      navigate(ROUTES.Status);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <ScreenLayoutButton
      buttonText={i18n?.t("confirm")}
      buttonTo={ROUTES.Status}
      onSubmit={onSubmit}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="px-4">
          <View className="flex flex-row items-center justify-center bg-blue-300 py-4 rounded-[20px] mt-4 px-4">
            <View className="opacity-50">
              <RepairIcon />
            </View>
            <View className="opacity-50 ml-6">
              <CustomText className="text-[20px]">
                {i18n?.t("staff_help")}
              </CustomText>
            </View>
          </View>
          <View className="mt-6">
            <Radio
              label={i18n?.t("problems_with_tv_setting_up")}
              value={repairStatus}
              setValue={setRepairStatus}
              id="TV"
            />
          </View>
          <View className="mt-6">
            <Radio
              label={i18n?.t("a_light_bulb_burned_out")}
              value={repairStatus}
              setValue={setRepairStatus}
              id="light"
            />
          </View>
          <View className="mt-6">
            <Radio
              label={i18n?.t("problems_with_plumbing")}
              value={repairStatus}
              setValue={setRepairStatus}
              id="plumber"
            />
          </View>
          <View className="mt-6">
            <Radio
              label={i18n?.t("other")}
              value={repairStatus}
              setValue={setRepairStatus}
              id="other"
            />
          </View>
          {repairStatus === "other" && (
            <View className="mt-6">
              <Input
                control={control}
                name="problem"
                placeholder={i18n?.t("describe_the_problem")}
                className="h-[235px]"
                textAlignVertical="top"
              />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </ScreenLayoutButton>
  );
};

export default RoomServiceTechnicalScreen;
