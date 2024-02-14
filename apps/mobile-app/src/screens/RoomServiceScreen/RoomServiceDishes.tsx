import { View } from "react-native";
import ScreenLayoutButton from "../../components/ScreenLayoutButton";
import CustomText from "../../components/CustomText";
import MenuIcon from "../../../assets/icons/menu.svg";
import { useState } from "react";
import { ROUTES } from "../../routes";
import DishesItem, { Accessory } from "./DishesItem";
import { onCreateHotelRequest } from "../../queries";
import { useNavigation } from "@react-navigation/native";
import { i18n } from "../../../App";

const DISHES = [
	{
		id: "plate",
	},
	{
		id: "spoon",
	},
	{
		id: "fork",
	},
	{
		id: "cup",
	},
	{
		id: "corkscrew",
	},
	{
		id: "a_set_of_disposable_dishes",
	},
];

const RoomServiceDishesScreen = () => {
	const [selectedDishes, setSelectedDishes] = useState<(Accessory & { count: number; })[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const { navigate } = useNavigation();

	

	const onSubmit = async () => {
		const getData = {
			subModuleId: "BRING_DISHES",
			data: {
				products: selectedDishes,
			},
		};

		try {
			setIsLoading(true);
			await onCreateHotelRequest(getData);

			navigate(ROUTES.Status);
		} catch (err) {
			console.error(err);
		}
		setIsLoading(false);
	}

	return (
		<ScreenLayoutButton
			buttonText={i18n?.t("confirm")}
			onSubmit={onSubmit}
			isLoading={isLoading}
		>
			<View className="px-4">
				<View className="flex flex-row items-center justify-center bg-blue-300 py-4 rounded-[20px] mt-4 px-4">
					<View className="opacity-50">
						<MenuIcon />
					</View>
					<View className="opacity-50 ml-6">
						<CustomText className="text-[20px]">{i18n?.t("request_dishes")}</CustomText>
						<CustomText className="text-[14px]">
							{i18n?.t("request_cutlery_dishes_or_disposable_set")}
						</CustomText>
					</View>
				</View>
				<View>
					{DISHES.map((dish, i) => {
						const name = i18n?.t(dish?.id);
						
						const count = selectedDishes?.find((el) => el.name === name)?.count;
						return (
							<DishesItem
								key={name}
								count={count ?? 0}
								name={name}
								isDisabled={isLoading}
								onAdd={() => {
									setSelectedDishes &&
										setSelectedDishes((prevState) => {
											const newState = [...prevState];
											const currentIndex = newState.findIndex((el) => el.name === name);
											if (currentIndex !== -1) {
												newState[currentIndex].count = newState[currentIndex].count + 1;
											} else {
												newState.push({ ...dish, name, count: 1 });
											}

											return newState;
										});
								}}
								onSubtract={() => {
									setSelectedDishes &&
										setSelectedDishes((prevState) => {
											const newState = [...prevState];
											const currentIndex = newState.findIndex((el) => el.name === name);
											if (currentIndex !== -1) {
												newState[currentIndex].count = newState[currentIndex].count - 1;
											}

											return newState;
										});
								}}
								onClear={() => setSelectedDishes &&
									setSelectedDishes((prevState) => {
										const newState = [...prevState];
										const currentIndex = newState.findIndex((el) => el.name === name);
										newState.splice(currentIndex, 1)

										return newState;
									})
								}
							/>
						)
					})}
				</View>
			</View>
		</ScreenLayoutButton>
	);
};

export default RoomServiceDishesScreen;
