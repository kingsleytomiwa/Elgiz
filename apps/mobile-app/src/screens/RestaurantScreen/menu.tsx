import { ActivityIndicator, ScrollView, View } from "react-native";
import ScreenLayoutButton from "../../components/ScreenLayoutButton";
import BellIcon from "../../../assets/icons/bell.svg";
import CustomText from "../../components/CustomText";
import Item from "../../components/Item";
import Tabs from "../../components/ui/Tabs";
import { useEffect, useMemo, useState } from "react";
import { ROUTES } from "../../routes";
import { positionsAtom } from "../../store/atoms";
import { useAtom } from "jotai";
import { useRestaurantCategories, useRestaurantMenu } from "../../hooks";
import { i18n } from "../../../App";

const MenuScreen = () => {
  const [view, setView] = useState("");
  const [positions, setPositions] = useAtom(positionsAtom);

  const { data, isLoading: isMenuLoading } = useRestaurantMenu({ categoryId: view });

  const { data: categories, isLoading: isCategoriesLoading } = useRestaurantCategories();

  useEffect(() => {
    return () => setPositions([]);
  }, []);

  const categoriesTabs = useMemo(() => {
    if (!categories) return;

    return [
      {
        id: "",
        label: i18n?.t("all_all_positions"),
      },
      ...categories.map((category) => {
        return {
          id: category.id,
          label: (category.name as any)?.[i18n?.locale],
        };
      }),
    ];
  }, [categories]);

  const count = positions.reduce((prev, acc) => {
    return acc.count + prev;
  }, 0);

  const isLoading = isMenuLoading || isCategoriesLoading;

  return (
    <ScreenLayoutButton
      buttonText={`${i18n?.t("my_order")} (${count})`}
      buttonTo={ROUTES.MenuOrder}
    >
      <View className="mt-4 h-full">
        <View className="px-4">
          <View className="flex flex-row items-center justify-center bg-blue-300 py-4 rounded-[20px]">
            <View className="opacity-50">
              <BellIcon />
            </View>
            <View className="opacity-50 ml-6">
              <CustomText className="text-[20px]">{i18n?.t("menu")}</CustomText>
              <CustomText className="text-[14px]">{i18n?.t("order_food_to_your_room")}</CustomText>
            </View>
          </View>
        </View>
        {categoriesTabs && (
          <>
            {isLoading && (
              <ActivityIndicator
                className="flex justify-center items-center z-30"
                size="large"
                color="black"
              />
            )}

            <View className="mt-4">
              <Tabs view={view} setView={setView} tabs={categoriesTabs} />
            </View>
            <ScrollView showsVerticalScrollIndicator={false} className="px-4 mt-[26px]">
              {data?.map((item, i) => (
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
                      const current = newState.find((el) => el.id === item.id);

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
              <View className="h-[210px]" />
            </ScrollView>
          </>
        )}
      </View>
    </ScreenLayoutButton>
  );
};

export default MenuScreen;
