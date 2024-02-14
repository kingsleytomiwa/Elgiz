import { View } from "react-native";
import ScreenLayoutButton from "../../components/ScreenLayoutButton";
import CustomText from "../../components/CustomText";
import { ROUTES } from "../../routes";
import { FormProvider, useForm } from "react-hook-form";
import Datepicker from "../../components/ui/Datepicker";
import { useEffect } from "react";
import { dateAtom, positionsAtom, spaTimeslotsAtom } from "../../store/atoms";
import { useAtom, useAtomValue } from "jotai";
import { SpaPosition } from "@prisma/client";
import SPADropdownPicker from "./components/SPADropdownPicker";
import { i18n } from "../../../App";

const SpaTimeScreen = () => {
	const positions = useAtomValue(positionsAtom);
	const [slots, setSpaTimeslots] = useAtom(spaTimeslotsAtom);
	const [date, setDate] = useAtom(dateAtom);

	const methods = useForm({
		defaultValues: {
			data: date ? new Date(date) : null,
		},
	});
	const {
		watch,
	} = methods;

	const dateField = watch("data");
	const selectedPosition = positions?.[0] as SpaPosition | undefined;

	useEffect(() => {
		if (dateField) {
			setDate(dateField);
			setSpaTimeslots([]);
		}
	}, [dateField]);

	return (
		<FormProvider {...methods}>
			<ScreenLayoutButton disabled={!date || !slots.length} buttonText={i18n?.t("confirm")} buttonTo={selectedPosition?.duration ? ROUTES.SpaMaster : ROUTES.SpaConfirmation}>
				<View className="px-4">
					<CustomText variant="bold" className="text-[20px] mt-4">
						{i18n?.t("procedure")}
					</CustomText>
					<CustomText className="text-[20px] mt-6">{(selectedPosition?.name as any)?.[i18n?.locale]}</CustomText>
					<CustomText className="text-[18px] opacity-50 mt-2">
						{(selectedPosition?.description as any)?.[i18n?.locale]}
					</CustomText>
					<CustomText variant="bold" className="mt-6 text-[20px]">
						{i18n?.t("choose_the_time")}
					</CustomText>
					<View className="mt-6 flex flex-row justify-between">
						<Datepicker
							label={i18n?.t("select_the_date")}
							name="data"
							date={date}
							options={{
								value: date ?? new Date(),
								minimumDate: new Date(),
							}}
						/>
						<SPADropdownPicker />
					</View>
				</View>
			</ScreenLayoutButton>
		</FormProvider>
	);
};

export default SpaTimeScreen;
