import { KeyboardAvoidingView, Platform, View } from "react-native";
import ScreenLayoutButton from "../../components/ScreenLayoutButton";
import CustomText from "../../components/CustomText";
import { ROUTES } from "../../routes";
import Input from "../../components/ui/Input";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { onCreateReview } from "../../queries";
import { useNavigation } from "@react-navigation/native";
import { i18n } from "../../../App";

const ReceptionFeedbackScreen = () => {
	const { control, getValues, setError, formState: {errors} } = useForm({});
	const [isLoading, setIsLoading] = useState(false);
	const { navigate } = useNavigation();

	

	const onSubmit = async () => {
		setIsLoading(true);
		if (!getValues().feedback) {
			setError("feedback", { message: i18n?.t("enter_your_review_here") });
			setIsLoading(false);
			return;
		}

		try {
			await onCreateReview({ text: getValues().feedback });
			navigate(ROUTES.Main);
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
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
			>
				<View className="px-4">
					<CustomText variant="bold" className="mt-4 text-[20px]">
						{i18n?.t("leave_a_review_about_the_work_of_the_hotel")}
					</CustomText>
					<View className="mt-6">
						<Input
							editable={!isLoading}
							control={control}
							name="feedback"
							placeholder={i18n?.t("enter_your_review_here")}
							className="h-[235px]"
							textAlignVertical="top"
						/>
						<CustomText className="text-red-400 mt-2">{errors?.feedback?.message as string}</CustomText>
					</View>
				</View>
			</KeyboardAvoidingView>
		</ScreenLayoutButton>
	);
};

export default ReceptionFeedbackScreen;
