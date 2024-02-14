import { View, Image, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import CustomText from "../../components/CustomText";
import ScreenLayout from "../../components/ScreenLayout";
import BellIcon from "../../../assets/icons/bell.svg";
import BasketIcon from "../../../assets/icons/basket.svg";
import { useNavigation } from "@react-navigation/native";
import { ROUTES } from "../../routes";
import MenuIcon from "../../../assets/icons/menu.svg";
import { onCreateHotelRequest } from "../../queries";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import UserData from "../../components/UserData";
import { useHotel } from "../../hooks";
import { i18n } from "../../../App";

const SERVICES = [
	{
		id: "FOOD_ORDER",
		image: <BellIcon />,
		title: "menu",
		description: "order_food_to_your_room",
		to: ROUTES.Menu,
	},
	{
		id: "BRING_DISHES",
		image: <MenuIcon />,
		title: "request_dishes",
		description: "request_cutlery_dishes_or_disposable_set",
		to: ROUTES.RoomServiceDishes,
	},
	{
		id: "WASH_DISHES",
		image: <BasketIcon />,
		title: "remove_dirty_dishes",
		to: ROUTES.Status,
	},
];

const RestaurantScreen = () => {
	const { navigate } = useNavigation();
	const [isLoading, setIsLoading] = useState(false);

	

	const { data: hotel, isLoading: isHotelLoading } = useHotel();

	return (
		<ScreenLayout back className="px-[22px]">
			<UserData />

			<View className="mt-[165px] bg-blue-300 rounded-[20px] flex flex-row items-center justify-center w-full py-4">
				<Image
					className="w-[84px] h-[84px]"
					resizeMode="cover"
					source={require("../../../assets/image/restaurant.png")}
				/>
				<CustomText variant="bold" className="text-[20px] ml-5">
					Ресторан
				</CustomText>
			</View>
			<ScrollView showsVerticalScrollIndicator={false}>
				{(isLoading || isHotelLoading) && (
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
							disabled={isLoading}
							key={i}
							className={twMerge("mt-6 px-4", isLoading && "bg-gray-50 rounded-xl")}
							onPress={async () => {
								setIsLoading(true);
								if (item.id === "WASH_DISHES") {
									const getData = {
										subModuleId: "WASH_DISHES",
										data: {}
									};

									try {
										await onCreateHotelRequest(getData);
									} catch (err) {
										console.error(err);
									}
								}

								setIsLoading(false);
								navigate(item.to);
							}}
						>
							<View className="flex flex-row items-center">
								{item.image}
								<View className="ml-6 w-[90%]">
									<CustomText className="text-[20px]">{i18n?.t(item.title)}</CustomText>
									{item.description && (
										<CustomText className="text-[14px] opacity-50">
											{i18n?.t(item.description)}
										</CustomText>
									)}
								</View>
							</View>
							<View className="border-b border-black opacity-25 mt-6 w-full" />
						</TouchableOpacity>
					);
				})}
			</ScrollView>
		</ScreenLayout>
	);
};

export default RestaurantScreen;
