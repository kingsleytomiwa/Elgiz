import { View, Image, TouchableOpacity, ScrollView } from "react-native";
import CustomText from "../../components/CustomText";
import ScreenLayout from "../../components/ScreenLayout";
import IronIcon from "../../../assets/icons/iron.svg";
import RepairIcon from "../../../assets/icons/repair.svg";
import CleanIcon from "../../../assets/icons/clean.svg";
import { useNavigation } from "@react-navigation/native";
import { ROUTES } from "../../routes";
import UserData from "../../components/UserData";
import { i18n } from "../../../App";

const SERVICES = [
  {
    image: <IronIcon />,
    title: "bring_pick_up_an_iron_and_ironing_board",
    to: ROUTES.RoomServiceIron,
  },
  {
    image: <RepairIcon />,
    title: "staff_help",
    to: ROUTES.RoomServiceTechnical,
  },
  {
    image: <CleanIcon />,
    title: "room_cleaning",
    to: ROUTES.RoomServiceClean,
  },
];

const RoomServiceScreen = () => {
  const { navigate } = useNavigation();

  return (
    <ScreenLayout back>
      <UserData />

      <View className="px-4">
        <View className="mt-[165px] bg-blue-300 rounded-[20px] flex flex-row items-center justify-center w-full py-4">
          <Image
            className="w-[84px] h-[84px]"
            resizeMode="cover"
            source={require("../../../assets/image/room-service.png")}
          />
          <CustomText variant="bold" className="text-[20px] ml-5">
            {i18n?.t("room_service")}
          </CustomText>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {SERVICES.map((item, i) => (
          <TouchableOpacity
            key={i}
            className="mt-6 px-4"
            onPress={() => navigate(item.to)}
          >
            <View className="flex flex-row items-center">
              {item.image}
              <View className="ml-6 w-[90%]">
                <CustomText className="text-[20px]">{i18n?.t(item.title)}</CustomText>
              </View>
            </View>
            <View className="border-b border-black opacity-25 mt-6 w-full" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ScreenLayout>
  );
};

export default RoomServiceScreen;
