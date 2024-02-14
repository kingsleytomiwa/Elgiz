import { TouchableOpacity, Image, ScrollView, View } from "react-native";
import CustomText from "../../components/CustomText";
import ScreenLayout from "../../components/ScreenLayout";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { ROUTES } from "../../routes";
import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";
import { Module } from "@prisma/client";
import { useGuest, useHotel, useLastRequest } from "../../hooks";
import UserData from "../../components/UserData";
import { getNextStatus } from "utils";
import { useAtom } from "jotai";
import { positionsAtom } from "../../store/atoms";
import { i18n } from "../../../App";
import { queryClient } from "../../../App";

const BUTTONS = [
  {
    id: "RESTAURANT",
    image: require("../../../assets/image/restaurant.png"),
    navigate: ROUTES.Restaurant,
  },
  {
    id: "ROOM_SERVICE",
    image: require("../../../assets/image/room-service.png"),
    navigate: ROUTES.RoomService,
  },
  {
    id: "RECEPTION",
    image: require("../../../assets/image/reception.png"),
    navigate: ROUTES.Reception,
  },
  {
    id: "CHAT",
    image: require("../../../assets/image/chat.png"),
    navigate: ROUTES.Chat,
  },
  {
    id: "SPA",
    image: require("../../../assets/image/spa.png"),
    navigate: ROUTES.Spa,
  },
  {
    id: "SHOP",
    image: require("../../../assets/image/store.png"),
    navigate: ROUTES.ReceptionShop,
  },
];

const MainScreen = () => {
	const isFocused = useIsFocused();
	const { data: guest } = useGuest();
	const { data: hotel } = useHotel();
	const { data: lastRequest } = useLastRequest();
	const [modules, setModules] = useState<Module[]>();
	const [positions, setPositions] = useAtom(positionsAtom);
	const { navigate } = useNavigation();
	const [isHidden, setIsHidden] = useState(true);

	useEffect(() => {
		if (isFocused) {
			if (!hotel) {
				queryClient.invalidateQueries("hotel");
				navigate(ROUTES.Languages)
				return;
			}
			setPositions([]);
		}

    if (!hotel?.modules) return;
    const activeModules = hotel?.modules?.filter((module) => module.value);
    if (!activeModules) return;

    setModules(activeModules);
  }, [hotel?.modules, isFocused]);

  return (
    <ScreenLayout burger>
      <UserData />

      <View
        className={twMerge(
          "w-full flex flex-row justify-end relative mt-12 mb-10",
          isHidden && "opacity-100"
        )}
      >
        <TouchableOpacity
          className={twMerge(
            "px-6 pr-10 py-4 bg-red-400 rounded-[20px_0_0_20px] max-w-[230px] w-full z-40",
            isHidden ? "-right-52" : "right-0"
          )}
          onPress={() => setIsHidden((prev) => !prev)}
        >
          <CustomText className="text-h2 text-gray-100">Заказ</CustomText>
          {lastRequest?.status && (
            <CustomText className="text-[14px] text-gray-100">
              {i18n?.t(getNextStatus(lastRequest.status).currentStatus.toLowerCase())}
            </CustomText>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="px-[22px]">
        <View className="flex flex-row flex-wrap gap-5 mb-5">
          {modules ? (
            <>
              {modules?.map((item, i) => (
                <TouchableOpacity
                  onPress={() => navigate(BUTTONS.find((el) => item.name === el.id)?.navigate!)}
                  key={i}
                  className={twMerge("bg-blue-300 rounded-[20px] py-4 pl-6 pr-2 flex-[0_0_44%]")}
                >
                  <Image
                    source={BUTTONS.find((el) => item.name === el.id)?.image!}
                    className="w-[84px] h-[84px]"
                    resizeMode="contain"
                    alt="button image"
                  />
                  <CustomText variant="bold" className={twMerge("text-[20px] mt-5 text-right")}>
                    {i18n?.t(item.name.toLowerCase())}
                  </CustomText>
                </TouchableOpacity>
              ))}
            </>
          ) : (
            <CustomText>...</CustomText>
          )}
        </View>
      </ScrollView>
    </ScreenLayout>
  );
};

export default MainScreen;
