import { ActivityIndicator, View } from "react-native";
import ScreenLayoutButton from "../../components/ScreenLayoutButton";
import CustomText from "../../components/CustomText";
import Radio from "../../components/ui/Radio";
import { ROUTES } from "../../routes";
import { PositionType, orderAtom, orderPriceAtom, positionsAtom, spaTimeslotsAtom, spaWorkerAtom } from "../../store/atoms";
import { useAtom, useAtomValue } from "jotai";
import { RequestPaymentPlaceType, RequestPaymentType } from "utils";
import { onCreateHotelRequest, onCreateHotelRequests } from "../../queries";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import Prices from "../../components/Prices";
import { getPriceByParam } from "utils";
import { useHotel } from "../../hooks";
import { ParameterType } from "@prisma/client";
import { i18n } from "../../../App";

export const getParameterByRequestType = (type: PositionType): ParameterType => {
	switch (type) {
		case "FOOD_ORDER":
			return ParameterType.RESTAURANT;
		case "PREPARE_SAUNA":
			return ParameterType.SPA;
		case "SHOP":
			return ParameterType.SHOP;
	}
};

const PriceScreen = () => {
	const { data: hotel } = useHotel();
	const [order, setOrder] = useAtom(orderAtom);
	const spaTimeslots = useAtomValue(spaTimeslotsAtom);
	const positions = useAtomValue(positionsAtom);
	const [spaWorker] = useAtom(spaWorkerAtom);
	const [isLoading, setIsLoading] = useState(false);
	const orderPrice = useAtomValue(orderPriceAtom);
	const { navigate } = useNavigation();

	const { type, id } = useMemo(() => positions?.[0], [positions]);

	const { price, parameter } = useMemo(() => {
		const parameter = hotel?.parameters?.find(par => par.type === getParameterByRequestType(positions?.[0].type));
		if (!parameter || parameter?.isDeliveryFree) return { parameter, price: { sum: Number(orderPrice?.toFixed(2)), tax: 0 } };

		return { parameter, price: getPriceByParam(parameter, orderPrice) };
	}, [hotel?.parameters, positions, orderPrice]);

	const onSubmit = async () => {
		const getData = (reserveStart?: Date, reserveEnd?: Date) => ({
			subModuleId: type,
			...(type === "PREPARE_SAUNA" && {
				workerId: spaWorker?.id ?? null,
				positionId: id ?? null,
				reserveStart,
				reserveEnd,
			}),
			data: {
				price: price.sum,
				paymentPlace: order?.paymentPlace,
				paymentType: order?.paymentType,
				serveTime: order?.serveTime,
				specificServeTime: order?.time && new Date(order.time),
				products: positions,
			},
		});

		try {
			setIsLoading(true);

			if (spaTimeslots.length) {
				await onCreateHotelRequests(spaTimeslots.map(({ value }) => getData(value[0], value[1])));
			} else {
				await onCreateHotelRequest(getData());
			}

			navigate(ROUTES.Status);
		} catch (err) {
			console.error(err);
		}
		setIsLoading(false);
	};

	const isPaymentInRoomAvailable = useMemo(() => !parameter || (parameter?.cashPayment || parameter?.cardPayment), [parameter]);
	useEffect(() => {
		if (isPaymentInRoomAvailable) {
			setOrder({ ...order, paymentPlace: RequestPaymentPlaceType.ROOM, paymentType: parameter?.cashPayment ? RequestPaymentType.CASH : RequestPaymentType.CARD });
		} else {
			setOrder({ ...order, paymentPlace: RequestPaymentPlaceType.AT_CHECKOUT });
		}
	}, [isPaymentInRoomAvailable]);

	return (
		<ScreenLayoutButton buttonText={i18n?.t("confirm")} onSubmit={onSubmit} isLoading={isLoading}>
			<View className="flex justify-between px-4 flex-1 pb-[120px]">
				<View>
					{isLoading && (
						<ActivityIndicator
							className="flex justify-center items-center z-30"
							size="large"
							color="black"
						/>
					)}
					<CustomText variant="bold" className="text-[20px] mt-4">
						{i18n?.t("payment")}
					</CustomText>
					<View className="mt-12">
						{isPaymentInRoomAvailable &&
							(
								<>
									<Radio
										label={i18n?.t("payment_in_the_room")}
										id={RequestPaymentPlaceType.ROOM}
										value={order!.paymentPlace!}
										setValue={(value: RequestPaymentPlaceType) => setOrder({ ...order, paymentPlace: value!, paymentType: RequestPaymentType.CASH })}
									/>
									<View className="pl-4 mb-6 flex">
										{(!parameter || parameter?.cashPayment) && (
											<View className="mt-6">
												<Radio
													id={RequestPaymentType.CASH}
													label={i18n?.t("cash")}
													value={order?.paymentType!}
													setValue={(value: RequestPaymentType) => setOrder({ ...order, paymentPlace: RequestPaymentPlaceType.ROOM, paymentType: value! })}
												/>
											</View>
										)}
										{(!parameter || parameter?.cardPayment) && (
											<View className="mt-6">
												<Radio
													label={i18n?.t("payment_by_card_visa_mastercard")}
													id={RequestPaymentType.CARD}
													value={order?.paymentType!}
													setValue={(value: RequestPaymentType) => setOrder({ ...order, paymentPlace: RequestPaymentPlaceType.ROOM, paymentType: value! })}
												/>
											</View>
										)}
									</View>
								</>
							)}
						{(!parameter || parameter?.checkoutPayment) && <Radio
							label={i18n?.t("payment_at_departure")}
							id={RequestPaymentPlaceType.AT_CHECKOUT}
							value={order!.paymentPlace!}
							setValue={(value: RequestPaymentPlaceType) => setOrder({ ...order, paymentType: undefined, paymentPlace: value! })}
						/>}
					</View>
				</View>

				<Prices {...price} />
			</View>
		</ScreenLayoutButton>
	);
};

export default PriceScreen;
