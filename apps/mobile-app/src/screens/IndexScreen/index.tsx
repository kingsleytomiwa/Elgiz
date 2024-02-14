import { ImageBackground, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomText from "../../components/CustomText";
import { ArrowIcon } from "../../components/ui/icons/ArrowIcon";
import { useNavigation } from "@react-navigation/native";
import { ROUTES } from "../../routes";
import { useHotel } from "../../hooks";

const IndexScreen = () => {
	const { navigate } = useNavigation();
	const { isLoading, data: hotel } = useHotel();

	return (
		<SafeAreaView className="h-full bg-[#1A1A1A] pt-[62px] pb-[50px] px-1 relative">
			{isLoading && (
				<ActivityIndicator
					className="absolute top-0 right-0 left-0 bottom-0 flex justify-center items-center z-30"
					size="large"
					color="white"
				/>
			)}
			<ImageBackground
				imageStyle={{ borderRadius: 20 }}
				source={{ uri: (hotel?.settings as any)?.splash?.image }}
				resizeMode="cover"
				className="h-full w-full rounded-[20px] flex justify-end items-center"
			>
				<Text className="text-white text-[60px] text-center font-extrabold">
					{hotel?.name}
				</Text>
				<CustomText className="text-center text-[20px] text-white mt-3">
					{hotel?.country}
				</CustomText>
				<TouchableOpacity
					onPress={() => navigate(ROUTES.Main)}
					className="w-[93px] h-12 items-center bg-gray-100 justify-center rounded-[20px] flex mt-5 mb-10"
				>
					<ArrowIcon fill={"#054982"} />
				</TouchableOpacity>
			</ImageBackground>
		</SafeAreaView>
	);
};

export default IndexScreen;
