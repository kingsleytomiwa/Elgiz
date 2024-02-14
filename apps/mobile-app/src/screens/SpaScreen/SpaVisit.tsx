import { ActivityIndicator, ScrollView, TouchableOpacity, View } from "react-native";
import ScreenLayoutButton from "../../components/ScreenLayoutButton";
import SpaIcon from "../../../assets/icons/spa.svg";
import CustomText from "../../components/CustomText";
import Item from "../../components/Item";
import { ROUTES } from "../../routes";
import { useNavigation } from "@react-navigation/native";
import { dateAtom, positionsAtom, spaTimeslotsAtom, spaWorkerAtom } from "../../store/atoms";
import { useAtom } from "jotai";
import { useSpaMenu } from "../../hooks";
import { useEffect } from "react";
import { i18n } from "../../../App";

const SpaVisitScreen = () => {
  const { navigate } = useNavigation();
  const [positions, setPositions] = useAtom(positionsAtom);
  const [date, setDate] = useAtom(dateAtom);
  const [select, setSelect] = useAtom(spaTimeslotsAtom);
  const [spaWorker, setSpaWorker] = useAtom(spaWorkerAtom);
  const { data, isLoading: isMenuLoading } = useSpaMenu({});

  const hotelLoading = isMenuLoading;

  // TODO! check if unnecessary
  useEffect(() => {
    const clear = () => {
      setDate(null);
      setSelect([]);
      setSpaWorker(null);
    };
    clear();

    return () => clear();
  }, [positions]);

  useEffect(() => {
    const clear = () => {
      if (!date) {
        setSelect([]);
        setSpaWorker(null);
      }
    };
    clear();

    return () => clear();
  }, [date]);

  return (
    <ScreenLayoutButton>
      <View className="mt-4 h-full">
        <View className="px-4">
          <View className="flex flex-row items-center justify-center bg-blue-300 py-4 rounded-[20px]">
            <View className="opacity-50">
              <SpaIcon />
            </View>
            <View className="opacity-50 ml-6">
              <CustomText className="text-[20px]">{i18n?.t("book_a_visit")}</CustomText>
            </View>
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} className="px-4 mt-[26px]">
          {hotelLoading && (
            <ActivityIndicator
              className="flex justify-center items-center z-30"
              size="large"
              color="black"
            />
          )}
          {data?.map((item, i) => {
            return (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  setPositions([{ ...item, count: 1, type: "PREPARE_SAUNA" }]);
                  navigate(ROUTES.SpaTime);
                }}
              >
                <Item
                  key={i}
                  id={item.id}
                  image={item.imageURL}
                  title={(item?.name as any)?.[i18n?.locale]}
                  description={(item?.description as any)?.[i18n?.locale]}
                  price={Number(item.price?.toFixed(2))}
                />
              </TouchableOpacity>
            );
          })}
          <View className="h-[210px]" />
        </ScrollView>
      </View>
    </ScreenLayoutButton>
  );
};

export default SpaVisitScreen;
