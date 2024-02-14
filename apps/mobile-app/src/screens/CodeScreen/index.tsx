import { KeyboardAvoidingView, Platform, View } from "react-native";
import CustomText from "../../components/CustomText";
import ScreenLayout from "../../components/ScreenLayout";
import Input from "../../components/ui/Input";
import { FormProvider, useForm } from "react-hook-form";
import { useState } from "react";
import { ROUTES } from "../../routes";
import queryString from "query-string";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { API_URL, QUERY_KEYS } from "../../../utils/actions";
import { useQuery } from "react-query";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { i18n, queryClient } from "../../../App";

export type CodeScreenData = zod.infer<typeof schema>;

export const schema = zod.object({
	code: zod.string().min(1, {
		message: "Указанный код не актуален",
	}),
});

const CodeScreen = () => {
	const [guest, setGuest] = useState({ code: '' });
	const { navigate } = useNavigation();
	const [isLoading, setIsLoading] = useState(false);

	const methods = useForm({
		defaultValues: {
			code: "",
		},
		resolver: zodResolver(schema),
	});
	const {
		control,
		handleSubmit,
		setError,
		formState: { errors },
	} = methods;

	const onSubmit = async ({ code }: CodeScreenData) => {
		if (!code) return;
		setIsLoading(true);
		try {
			const res = await axios.get(`${API_URL}/me/authorize?${queryString.stringify({ code })}`);

			const data = res.data;

			await AsyncStorage.setItem('accessToken', data.accessToken);
			await AsyncStorage.setItem('refreshToken', data.refreshToken);
			queryClient.setQueryData("me", { ...data.data, initialLogin: true });
			navigate(ROUTES.DataConfirmation);
		} catch (err) {
			console.log('err: ', err);
			setError("code", {
				message: "Указанный код не актуален",
			});
		}
		setIsLoading(false);
	}

	return (
		<FormProvider {...methods}>
			<ScreenLayout back onSubmit={handleSubmit(onSubmit)} isLoading={isLoading}>
				<KeyboardAvoidingView
					style={{ flex: 1 }}
					behavior={Platform.OS === "ios" ? "padding" : "height"}
				>
					<CustomText variant="bold" className="mt-12 text-center text-[20px]">
						{i18n?.t("enter_the_guest_code")}
					</CustomText>
					<View className="mt-[81px] px-[33px]">
						<CustomText variant="bold" className="text-[20px] mb-3">
							{i18n?.t("guest_code")}
						</CustomText>
						<Input
							editable={!(isLoading)}
							control={control}
							error={errors.code?.message}
							name="code"
							placeholder={i18n?.t("enter_the_guest_code_here")}
						/>
						{/* <View className="mt-3">
							<Checkbox
								value={check}
								setValue={setCheck}
								label="Запомнить устройство на 14 дней"
								id="remember"
							/>
						</View> */}
						<CustomText className="opacity-50 text-[18px] mt-12">
							{i18n?.t("your_unique_guest_code_was_issued_to_you_when_registering_at_the_hotel_if_you_cannot_find_it_or_forgot_your_code_present_any_identification_document_at_the_reception_and_request_your_guest_code")}
						</CustomText>
					</View>
				</KeyboardAvoidingView>
			</ScreenLayout>
		</FormProvider>
	);
};
export default CodeScreen;
