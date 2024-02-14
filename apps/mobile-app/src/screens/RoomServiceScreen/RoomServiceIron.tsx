import { View } from "react-native";
import ScreenLayoutButton from "../../components/ScreenLayoutButton";
import CustomText from "../../components/CustomText";
import IronIcon from "../../../assets/icons/iron.svg";
import Radio from "../../components/ui/Radio";
import { useState } from "react";
import { ROUTES } from "../../routes";
import { onCreateHotelRequest } from "../../queries";
import { useNavigation } from "@react-navigation/native";
import { i18n } from "../../../App";

const RoomServiceIronScreen = () => {
	const [ironStatus, setIronStatus] = useState<"BRING" | "TAKEOUT">("BRING");
	const { navigate } = useNavigation();

	

	const onSubmit = async () => {
		const getData = {
			subModuleId: "IRONING",
			data: {
				ironing: "BRING",
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
			onSubmit={onSubmit}
		>
			<View className="px-4">
				<View className="flex flex-row items-center justify-center bg-blue-300 py-4 rounded-[20px] mt-4">
					<View className="opacity-50">
						<IronIcon />
					</View>
					<View className="opacity-50 ml-6 w-[60%]">
						<CustomText className="text-[20px]">
							{i18n?.t("bring_pick_up_an_iron_and_ironing_board")}
						</CustomText>
					</View>
				</View>
				<View className="my-6">
					<Radio
						label={i18n?.t("bring")}
						value={ironStatus}
						setValue={setIronStatus}
						id={"BRING"}
					/>
				</View>
				<Radio
					label={i18n?.t("take")}
					value={ironStatus}
					setValue={setIronStatus}
					id={"TAKEOUT"}
				/>
			</View>
		</ScreenLayoutButton>
	);
};

export default RoomServiceIronScreen;
