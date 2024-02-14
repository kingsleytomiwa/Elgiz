import { ScrollView, View } from "react-native";
import ScreenLayoutButton from "../../components/ScreenLayoutButton";
import { deviceHeight } from "../../../utils";
import CustomText from "../../components/CustomText";
import Item from "../../components/Item";
import Radio from "../../components/ui/Radio";
import { useEffect, useMemo, useState } from "react";
import { ROUTES } from "../../routes";
import Timepicker from "../../components/ui/Timepicker";
import { twMerge } from "tailwind-merge";
import { FormProvider, useForm } from "react-hook-form";
import { useAtom, useAtomValue } from "jotai";
import { orderAtom, orderPriceAtom, positionsAtom } from "../../store/atoms";
import Prices from "../../components/Prices";
import { useHotel } from "../../hooks";
import { ParameterType } from "@prisma/client";
import { getParameterByRequestType } from "../RestaurantScreen/price";
import { getPriceByParam } from "utils";
import { i18n } from "../../../App";

const ReceptionOrderScreen = () => {
  const [positions, setPositions] = useAtom(positionsAtom);
  const [order, setOrder] = useAtom(orderAtom);
  const orderPrice = useAtomValue(orderPriceAtom);
  const { data: hotel } = useHotel();

  const price = useMemo(() => {
    const parameter = hotel?.parameters?.find(
      (par) => par.type === getParameterByRequestType(positions?.[0].type)
    );
    if (!parameter || parameter?.isDeliveryFree)
      return { sum: Number(orderPrice?.toFixed(2)), tax: 0 };

    return getPriceByParam(parameter, orderPrice);
  }, [hotel?.parameters, orderPrice]);

  const methods = useForm({
    defaultValues: {
      date: new Date(),
      time: 0,
    },
  });

  const {
    control,
    watch,
    formState: { errors },
  } = methods;

  const time = watch("time");

  useEffect(() => {
    if (!time) return;
    setOrder({ ...order, time: new Date(time) });
  }, [time]);

  return (
    <ScreenLayoutButton buttonText={i18n?.t("to_pay")} buttonTo={ROUTES.Price}>
      <View className="px-4 mt-4">
        <CustomText variant="bold" className="text-[20px] text-blue-400">
          {i18n?.t("my_order")}
        </CustomText>
        <ScrollView showsVerticalScrollIndicator={false} className="max-h-[284px] mt-2">
          {positions.map((item, i) => (
            <Item
              key={item.id}
              id={item.id}
              image={item.imageURL}
              title={(item?.name as any)?.[i18n?.locale]}
              description={(item.description as any)?.[i18n?.locale]}
              price={Number(item.price?.toFixed(2))}
              // move out
              onAdd={() => {
                setPositions?.((prevState) => {
                  const newState = [...prevState];

                  const currentIndex = newState.findIndex((el) => el.id === item.id);

                  if (currentIndex !== -1) {
                    newState[currentIndex].count++;
                  } else {
                    newState.push({ ...item, count: 1, type: "SHOP" });
                  }

                  return newState;
                });
              }}
              onRemove={() => {
                setPositions?.((prevState) => {
                  const newState = [...prevState];
                  const currentIndex = newState.findIndex((el) => el.id === item.id);

                  if (currentIndex !== -1 && newState[currentIndex].count > 0) {
                    if (newState[currentIndex].count === 1) {
                      newState.splice(currentIndex, 1);
                    } else {
                      newState[currentIndex].count--;
                    }
                  }

                  return newState;
                });
              }}
            />
          ))}
        </ScrollView>
        <CustomText variant="bold" className="text-[20px] text-blue-400 mt-4">
          {i18n?.t("model_time")}
        </CustomText>
        <View className="mt-4">
          <Radio
            value={order!.serveTime!}
            setValue={(id: string) => setOrder({ ...order, serveTime: id })}
            id="IMMEDIATELY"
            label={i18n?.t("as_ready")}
          />
        </View>
        <View className="mt-6">
          <Radio
            value={order!.serveTime!}
            setValue={(id: string) => setOrder({ ...order, serveTime: id })}
            id="BY_SPECIFIC_TIME"
            label={i18n?.t("by_a_certain_time")}
          />
          <View
            pointerEvents={order!.serveTime === "BY_SPECIFIC_TIME" ? "auto" : "none"}
            className={twMerge(
              "mt-3 opacity-0",
              order!.serveTime === "BY_SPECIFIC_TIME" && "opacity-100"
            )}
          >
            <FormProvider {...methods}>
              <Timepicker name="time" label={i18n?.t("choose_the_time")} />
            </FormProvider>
          </View>
        </View>
      </View>
      <View className="absolute bottom-[15%] w-full left-0 px-4">
        <Prices {...price} />
      </View>
    </ScreenLayoutButton>
  );
};

export default ReceptionOrderScreen;
