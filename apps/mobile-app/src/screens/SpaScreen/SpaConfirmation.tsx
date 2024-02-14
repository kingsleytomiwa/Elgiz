import { TouchableOpacity, View } from "react-native";
import ScreenLayoutButton from "../../components/ScreenLayoutButton";
import CustomText from "../../components/CustomText";
import { ROUTES } from "../../routes";
import { FormProvider, useForm } from "react-hook-form";
import Datepicker from "../../components/ui/Datepicker";
import { dateAtom, positionsAtom, spaWorkerAtom } from "../../store/atoms";
import { useAtomValue } from "jotai";
import Item from "../../components/Item";
import SPADropdownPicker from "./components/SPADropdownPicker";
import { i18n } from "../../../App";
import { useMemo } from "react";

const SpaConfirmationScreen = () => {
  const positions = useAtomValue(positionsAtom);
  const date = useAtomValue(dateAtom);
  const spaWorker = useAtomValue(spaWorkerAtom);
  const selectedPosition = useMemo(() => positions?.[0], [positions]);

  const methods = useForm({
    defaultValues: {
      data: date ? new Date(date) : null,
    },
  });
  const { watch } = methods;

  const data = useMemo(() => watch("data"), [watch]);

  return (
    <FormProvider {...methods}>
      <ScreenLayoutButton buttonText={i18n?.t("to_pay")} buttonTo={ROUTES.Price}>
        <View className="px-4">
          <CustomText variant="bold" className="text-[20px] mt-4">
            {i18n?.t("procedure")}
          </CustomText>
          <CustomText className="text-[20px] mt-6">
            {(selectedPosition?.name as any)?.[i18n?.locale]}
          </CustomText>
          <CustomText className="text-[18px] opacity-50 mt-2">
            {(selectedPosition?.description as any)?.[i18n?.locale]}
          </CustomText>
          <CustomText variant="bold" className="mt-6 text-[20px]">
            {/* TODO: change text to i18n */}
            {i18n?.t("time")}
          </CustomText>
          <View className="mt-6 flex flex-row justify-between">
            <Datepicker
              disabled
              label={i18n?.t("select_the_date")}
              name="data"
              date={data}
              options={{
                value: date ?? new Date(),
                minimumDate: new Date(),
              }}
            />
            <SPADropdownPicker disabled />
          </View>
        </View>

        {spaWorker && (
          <>
            {/* TODO: change text to i18n */}
            <CustomText variant="bold" className="text-[20px] font-bold text-blue-400 px-4 mt-4">
              {i18n?.t("therapist")}
            </CustomText>

            <View className="px-4 mt-5">
              <TouchableOpacity>
                <Item
                  id={spaWorker?.id}
                  image={spaWorker?.image ?? require("../../../assets/avatar.png")}
                  title={spaWorker?.name ?? ""}
                  description=""
                  one={true}
                />
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScreenLayoutButton>
    </FormProvider>
  );
};

export default SpaConfirmationScreen;
