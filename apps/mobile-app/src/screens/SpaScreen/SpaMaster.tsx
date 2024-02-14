import { ScrollView, TouchableOpacity, View } from "react-native";
import ScreenLayoutButton from "../../components/ScreenLayoutButton";
import CustomText from "../../components/CustomText";
import { ROUTES } from "../../routes";
import { FormProvider, useForm } from "react-hook-form";
import Datepicker from "../../components/ui/Datepicker";
import { useNavigation } from "@react-navigation/native";
import Item from "../../components/Item";
import { dateAtom, positionsAtom, spaTimeslotsAtom, spaWorkerAtom } from "../../store/atoms";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { SpaPosition } from "@prisma/client";
import SPADropdownPicker from "./components/SPADropdownPicker";
import { useSpaTherapists } from "../../hooks";
import { i18n } from "../../../App";

const SpaMasterScreen = () => {
  const positions = useAtomValue(positionsAtom);
  const setSpaWorker = useSetAtom(spaWorkerAtom);
  const select = useAtomValue(spaTimeslotsAtom);
  const [date, setDate] = useAtom(dateAtom);

  const methods = useForm({
    defaultValues: {
      data: date ? new Date(date) : null,
    },
  });
  const {
    watch,
  } = methods;

  const data = watch("data");
  const { navigate } = useNavigation();
  const selectedPosition = positions?.[0] as SpaPosition;
  const { data: availableTherapists } = useSpaTherapists(
    selectedPosition?.id,
    select?.[0].value?.[0],
    select?.[0].value?.[1],
    !!selectedPosition?.duration
  );

  useEffect(() => {
    if (data) {
      setDate(data);
    }
  }, [data]);

  return (
    <FormProvider {...methods}>
      <ScreenLayoutButton>
        <View className="px-4">
          <CustomText variant="bold" className="text-[20px] mt-4">
            {i18n?.t("procedure")}
          </CustomText>
          <CustomText className="text-[20px] mt-6">
            {(selectedPosition.name as any)?.[i18n?.locale]}
          </CustomText>
          <CustomText className="text-[18px] opacity-50 mt-2">
            {(selectedPosition.description as any)?.[i18n?.locale]}
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

          <CustomText variant="bold" className="mt-6 text-[20px]">
            {/* TODO: change text to i18n */}
            {i18n?.t("choose_the_therapist")}
          </CustomText>

          <ScrollView showsVerticalScrollIndicator={false} className="px-4 mt-4">
            {availableTherapists?.map(({ name, image, id }) => (
              <TouchableOpacity
                key={id}
                onPress={() => {
                  setSpaWorker({ id, name, image });
                  navigate(ROUTES.SpaConfirmation);
                }}
              >
                <Item
                  id={id}
                  image={image ?? require("../../../assets/avatar.png")}
                  title={name ?? ""}
                  description=""
                  one={true}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScreenLayoutButton>
    </FormProvider>
  );
};

export default SpaMasterScreen;
