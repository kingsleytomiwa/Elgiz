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
import { useAtom, useAtomValue } from "jotai";
import { orderAtom, orderPriceAtom, positionsAtom } from "../../store/atoms";
import { DeliveryPaymentType, FoodPosition, Parameter, ParameterType } from "@prisma/client";
import { FormProvider, useForm } from "react-hook-form";
import { useHotel } from "../../hooks";
import Prices from "../../components/Prices";
import { getPriceByParam } from "utils";
import { i18n } from "../../../App";

const MenuOrderScreen = () => {
  const { data: hotel } = useHotel();
  const [order, setOrder] = useAtom(orderAtom);

  const methods = useForm({
    defaultValues: {
      data: new Date(),
      time: 0,
    },
  });
  const {
    control,
    watch,
    formState: { errors },
  } = methods;
  const time = watch("time");

  const orderPrice = useAtomValue(orderPriceAtom);
  const [positions, setPositions] = useAtom(positionsAtom);

  const price = useMemo(() => {
    const parameter = hotel?.parameters?.find((par) => par.type === ParameterType.RESTAURANT);
    if (!parameter || parameter?.isDeliveryFree)
      return { sum: Number(orderPrice?.toFixed(2)), tax: 0 };

    return getPriceByParam(parameter, orderPrice);
  }, [hotel?.parameters, orderPrice]);

  useEffect(() => {
    if (!time) return;
    setOrder({ ...order, time: new Date(time) });
  }, [time]);

  return (
    <ScreenLayoutButton buttonText={i18n?.t("to_pay")} buttonTo={ROUTES.Price}>
      <View className="px-4 mt-4 h-[75%]">
        <CustomText variant="bold" className="text-[20px] text-blue-400">
          {i18n?.t("my_order")}
        </CustomText>
        <ScrollView showsVerticalScrollIndicator={false} className="mt-[55px] max-h-[284px]">
          {(positions as FoodPosition[]).map((item, i) => (
            <Item
              key={i}
              id={item.id}
              image={item.imageURL}
              weight={item.weight}
              title={(item?.name as any)?.[i18n?.locale]}
              description={(item?.description as any)?.[i18n?.locale]}
              price={Number(item.price?.toFixed(2))}
              onAdd={() => {
                setPositions?.((prevState) => {
                  const newState = [...prevState];

                  const currentIndex = newState.findIndex((el) => el.id === item.id);

                  if (currentIndex !== -1) {
                    newState[currentIndex].count++;
                  } else {
                    newState.push({ ...item, count: 1, type: "FOOD_ORDER" });
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
              "opacity-0 mt-2",
              order!.serveTime === "BY_SPECIFIC_TIME" && "opacity-100"
            )}
          >
            <FormProvider {...methods}>
              <Timepicker name="time" label={i18n?.t("choose_the_time")} />
            </FormProvider>
          </View>
        </View>

        <Prices {...price} />
      </View>
    </ScreenLayoutButton>
  );
};

export default MenuOrderScreen;
