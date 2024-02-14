import { View, Image, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import CustomText from "../../components/CustomText";
import ScreenLayout from "../../components/ScreenLayout";
import CarIcon from "../../../assets/icons/car.svg";
import ShopIcon from "../../../assets/icons/shop.svg";
import FeedbackIcon from "../../../assets/icons/feedback.svg";
import { useNavigation } from "@react-navigation/native";
import { ROUTES } from "../../routes";
import UserData from "../../components/UserData";
import { useHotel } from "../../hooks";
import { i18n } from "../../../App";

const SERVICES = [
  {
    id: "TAXI",
    image: <CarIcon />,
    title: "request_transfer",
    to: ROUTES.ReceptionTransfer,
  },
  {
    id: "LEAVE_REVIEW",
    image: <FeedbackIcon />,
    title: "leave_feedback",
    to: ROUTES.ReceptionFeedback,
  },
];

const ReceptionScreen = () => {
  const { navigate } = useNavigation();
  const { data: hotel, isLoading: isHotelLoading } = useHotel();

  return (
    <ScreenLayout back>
      <UserData />

      <View className="px-4">
        <View className="mt-[165px] bg-blue-300 rounded-[20px] flex flex-row items-center justify-center w-full py-4">
          <Image
            className="w-[84px] h-[84px]"
            resizeMode="cover"
            source={require("../../../assets/image/reception.png")}
          />
          <CustomText variant="bold" className="text-[20px] ml-5">
            {i18n?.t("reception")}
          </CustomText>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {(isHotelLoading) && (
          <ActivityIndicator
            className="flex justify-center items-center z-30"
            size="large"
            color="black"
          />
        )}
        {SERVICES.map((item, i) => {
          const isSubModuleActive = hotel?.subModules?.find(mod => mod.name === item.id)?.value;
          if (!isSubModuleActive) return;

          return (
            <TouchableOpacity
              key={i}
              className="mt-6 px-4"
              onPress={() => navigate(item.to)}
            >
              <View className="flex flex-row items-center">
                {item.image}
                <View className="ml-6">
                  <CustomText className="text-[20px]">{i18n?.t(item.title)}</CustomText>
                </View>
              </View>
              <View className="border-b border-black opacity-25 mt-6 w-full" />
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </ScreenLayout>
  );
};

export default ReceptionScreen;
