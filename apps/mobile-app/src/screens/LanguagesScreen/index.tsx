import { TouchableOpacity, View } from "react-native";
import ScreenLayout from "../../components/ScreenLayout";
import CustomText from "../../components/CustomText";
import LineIcon from "../../../assets/icons/line.svg";
import { twMerge } from "tailwind-merge";
import { useCallback, useState } from "react";
import { ROUTES } from "../../routes";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { i18n } from "../../../App";
import { languagesMockups } from "utils";

const LanguagesScreen = () => {
  const [langActive, setLangActive] = useState(i18n.locale);
  const { navigate } = useNavigation();

  const onSubmit = useCallback(() => {
    navigate(ROUTES.Code);
  }, []);

  const handleLangChange = useCallback((newLang: string) => async () => {
    i18n.locale = newLang;
    setLangActive(newLang);
    await AsyncStorage.setItem("language", newLang);
  }, [langActive, navigate]);

  return (
    <ScreenLayout onSubmit={onSubmit}>
      <CustomText variant="bold" className="text-[20px] text-center mt-12">
        {i18n?.t("choose_your_tongue")}
      </CustomText>
      <View className="mt-[87px] flex items-center">
        <View className="w-[143px]">
          {languagesMockups.map((item) => (
            <TouchableOpacity
              onPress={handleLangChange(item.value)}
              key={item.value}
              className="flex flex-row items-center gap-4 p-4"
            >
              <View
                className={twMerge("hidden", langActive === item.value && "block")}
              >
                <LineIcon />
              </View>
              <CustomText variant="bold" className="text-[20px]">
                {item.label}
              </CustomText>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScreenLayout>
  );
};

export default LanguagesScreen;
