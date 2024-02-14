import { ActivityIndicator, ScrollView, View } from "react-native";
import ScreenLayoutButton from "../../components/ScreenLayoutButton";
import ShopIcon from "../../../assets/icons/shop.svg";
import CustomText from "../../components/CustomText";
import Item from "../../components/Item";
import { ROUTES } from "../../routes";
import { useAtom } from "jotai";
import { positionsAtom } from "../../store/atoms";
import { useShopPositions } from "../../hooks";
import { i18n } from "../../../App";

const ReceptionShopScreen = () => {
  const [positions, setPositions] = useAtom(positionsAtom);

  const { data: shopPositions, isLoading } = useShopPositions();

  const count = positions.reduce((prev, acc) => {
    return acc.count + prev;
  }, 0);

  return (
    <ScreenLayoutButton
      buttonText={`${i18n?.t("my_order")} (${count})`}
      buttonTo={ROUTES.ReceptionOrder}
    >
      <View className="mt-4 h-full">
        <View className="px-4">
          <View className="flex flex-row items-center justify-center bg-blue-300 py-4 rounded-[20px]">
            <View className="opacity-50">
              <ShopIcon />
            </View>
            <View className="opacity-50 ml-6">
              <CustomText className="text-[20px]">{i18n?.t("hotel_store")}</CustomText>
            </View>
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} className="px-4 mt-[26px]">
          {isLoading && (
            <ActivityIndicator
              className="flex justify-center items-center z-30"
              size="large"
              color="black"
            />
          )}
          {shopPositions?.map((item, i) => (
            <Item
              key={item.id}
              id={item.id}
              image={item.imageURL}
              title={(item?.name as any)?.[i18n?.locale]}
              description={(item.description as any)?.[i18n?.locale]}
              price={Number(item.price?.toFixed(2))}
              onAdd={() => {
                setPositions?.((prevState) => {
                  const newState = [...prevState];
                  const current = newState.find((el) => el.id === item.id);

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
          <View className="h-[210px]" />
        </ScrollView>
      </View>
    </ScreenLayoutButton>
  );
};

export default ReceptionShopScreen;
