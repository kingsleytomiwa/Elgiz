import { View, Image, TouchableOpacity } from "react-native";
import CustomText from "../../components/CustomText";
import ScreenLayout from "../../components/ScreenLayout";
import SpaIcon from "../../../assets/icons/spa.svg";
import { useNavigation } from "@react-navigation/native";
import { ROUTES } from "../../routes";
import { useHotel } from "../../hooks";
import UserData from "../../components/UserData";
import { i18n } from "../../../App";

const SpaScreen = () => {
  const { navigate } = useNavigation();
  const { data: hotel, isLoading } = useHotel();
  

  const isSubModuleActive = hotel?.modules?.find((mod) => mod.name === "SPA")?.value;

  return (
    <ScreenLayout back className="px-[22px]">
      <UserData />

      <View className="mt-[165px] bg-blue-300 rounded-[20px] flex flex-row items-center justify-center w-full py-4">
        <Image
          className="w-[84px] h-[84px]"
          resizeMode="cover"
          source={require("../../../assets/image/spa.png")}
        />
        <CustomText variant="bold" className="text-[20px] ml-5">
          {i18n?.t("spa")}
        </CustomText>
      </View>

      {isSubModuleActive && (
        <TouchableOpacity
          onPress={() => navigate(ROUTES.SpaVisit)}
          className="mt-6 flex flex-row items-center pb-6"
          disabled={isLoading}
        >
          <SpaIcon />
          <View className="ml-6">
            <CustomText className="text-[20px]">{i18n?.t("book_a_visit")}</CustomText>
          </View>
        </TouchableOpacity>
      )}
      <View className="border-b border-black opacity-25 w-full" />
    </ScreenLayout>
  );
};

export default SpaScreen;
