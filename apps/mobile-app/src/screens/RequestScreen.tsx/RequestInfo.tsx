import { TouchableOpacity, View } from "react-native";
import ScreenLayoutButton from "../../components/ScreenLayoutButton";
import CustomText from "../../components/CustomText";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { requestAtom } from "../../store/atoms";
import { useAtom } from "jotai";
import { FoodPosition } from "@prisma/client";
import { format } from "date-fns";
import { RequestPaymentPlaceTypeLabel, RequestTypeLabel, dateTimeFormat, getNextStatus } from "utils";
import { i18n } from "../../../App";

const RequestInfoScreen = () => {
	const [active, setActive] = useState("menu");
	const [request, setRequest] = useAtom(requestAtom);

	useEffect(() => {
		return () => setRequest(null);
	}, []);

	useEffect(() => {
		// add here all menus
		if (request?.type !== "FOOD_ORDER" && request?.type !== "SHOP") {
			setActive("status")
		}
	}, [request])

	const isMenu = request?.type === "FOOD_ORDER" || request?.type === "SHOP";
	const datetime = request?.createdAt && format(new Date(request.createdAt), dateTimeFormat);

	return (
		<ScreenLayoutButton>
			<View className="px-4">
				<CustomText variant="bold" className="mt-16 text-[20px]">
					{request?.type && i18n?.t(RequestTypeLabel[request?.type])}
				</CustomText>
				{/* @ts-ignore */}
				{request?.data?.paymentPlace && <CustomText className="text-[18px] opacity-50 mt-1.5">
					{/* @ts-ignore */}
					{i18n?.t("payment")}: {RequestPaymentPlaceTypeLabel[request.data.paymentPlace]}
				</CustomText>}
				<CustomText className="text-[18px] opacity-50 mt-1.5">
					Время заказа: {datetime}
				</CustomText>
				{/* TABS */}
				<View className="mt-6 flex flex-row">
					{isMenu && <TouchableOpacity
						onPress={() => setActive("menu")}
						className={twMerge(
							"flex-1 flex items-center justify-center py-3.5 bg-[#d5d6e1] rounded-l-full",
							active === "menu" && "bg-blue-400"
						)}
					>
						<CustomText
							className={twMerge(
								"text-[18px] text-blue-400",
								active === "menu" && "text-gray-100"
							)}
						>
							{i18n?.t("order_menu")}
						</CustomText>
					</TouchableOpacity>}
					<TouchableOpacity
						onPress={() => setActive("status")}
						className={twMerge(
							"flex-1 flex items-center justify-center py-3.5 bg-[#d5d6e1]",
							active === "status" && "bg-blue-400",
							isMenu ? "rounded-r-full" : "rounded-full"
						)}
					>
						<CustomText
							className={twMerge(
								"text-[18px] text-blue-400",
								active === "status" && "text-gray-100"
							)}
						>
							{i18n?.t("statuses")}
						</CustomText>
					</TouchableOpacity>
				</View>

				{/* TABS CONTENTS */}
				<View className="mt-6">
					{active === "menu" ? (
						// paste food order here
						<View>
							{((request?.data as any)?.products as (FoodPosition & { count: number })[])?.map((prod) => (
								<View key={prod?.id}>
									<CustomText className="mt-4 text-[20px] opacity-50">
										{(prod as any)?.category?.name[i18n?.locale]}
									</CustomText>
									<View className="flex flex-row justify-between mt-2">
										<CustomText className="text-[20px]">
											{(prod?.name as any)[i18n?.locale]}
										</CustomText>
										<CustomText className="text-[20px]">{prod.count}шт.</CustomText>
									</View>
								</View>
							))}
						</View>
					) : (
						<View>
							{/* paste statuses here */}
							{request?.history?.map(item => {
								const time = format(new Date(item.changedAt || request?.createdAt), dateTimeFormat);
								return (
									<View key={item.id}>
										<CustomText className="text-[20px] text-blue-400 mt-6">
											{i18n?.t(getNextStatus(item.status).currentStatus.toLowerCase())}
										</CustomText>
										<CustomText className="opacity-50 text-[18px]">
											Время статуса: {time}
										</CustomText>
									</View>
								)
							})}
						</View>
					)}
				</View>
			</View>
		</ScreenLayoutButton>
	);
};

export default RequestInfoScreen;
