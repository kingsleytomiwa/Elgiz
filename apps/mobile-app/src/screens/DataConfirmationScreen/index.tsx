import { View } from "react-native";
import CustomText from "../../components/CustomText";
import ScreenLayout from "../../components/ScreenLayout";
import { ROUTES } from "../../routes";
import { useNavigation } from "@react-navigation/native";
import { i18n, queryClient } from "../../../App";
import { Guest } from "@prisma/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useHotel } from "../../hooks";

const DataConfirmationScreen = () => {
	const { navigate } = useNavigation();
	

	const guest = queryClient.getQueryData("me") as Guest;
	useHotel();

	const onSubmit = async () => {
		await AsyncStorage.setItem("wasSplashDisplayed", "true");
		navigate(ROUTES.Index);
	};

	const goBack = async () => {
		await AsyncStorage.removeItem("accessToken");
		await AsyncStorage.removeItem("refreshToken");
		queryClient.setQueryData("me", null);
	};

	return (
		<ScreenLayout back={goBack} onSubmit={onSubmit}>
			<CustomText variant="bold" className="mt-12 text-center text-[20px]">
				{i18n?.t("confirm_the_data")}
			</CustomText>
			<View className="mt-[81px] px-[33px]">
				<CustomText className="text-[18px] opacity-50 mb-3">
					{i18n?.t("guest_code")}
				</CustomText>
				<CustomText variant="bold" className="text-[20px]">
					{guest?.code}
				</CustomText>
				<CustomText className="text-[18px] opacity-50 mb-3 mt-6">
					{i18n?.t("guest")}
				</CustomText>
				<CustomText variant="bold" className="text-[20px]">
					{guest?.name}
				</CustomText>
				<CustomText className="text-[18px] opacity-50 mb-3 mt-6">
					{i18n?.t("room")}
				</CustomText>
				<CustomText variant="bold" className="text-[20px]">
					{guest?.room}
				</CustomText>
			</View>
		</ScreenLayout>
	);
};
export default DataConfirmationScreen;
