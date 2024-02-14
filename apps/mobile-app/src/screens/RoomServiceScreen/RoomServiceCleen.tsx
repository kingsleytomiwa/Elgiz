import { View } from "react-native";
import ScreenLayoutButton from "../../components/ScreenLayoutButton";
import CustomText from "../../components/CustomText";
import CleanIcon from "../../../assets/icons/clean.svg";
import { ROUTES } from "../../routes";
import { FormProvider, useForm } from "react-hook-form";
import Datepicker from "../../components/ui/Datepicker";
import * as dateFns from "date-fns";
import { onCreateHotelRequest } from "../../queries";
import { useNavigation } from "@react-navigation/native";
import DropdownPicker from "../../components/ui/DropdownPicker";
import { useState } from "react";

type TimeslotWithLabel = {
  label: string;
  value: string;
};

const RoomServiceCleanScreen = () => {
  const [open, setOpen] = useState(false);
  const [select, setSelect] = useState<TimeslotWithLabel[] | null>(null);
  const { navigate } = useNavigation();

  const onSubmit = async () => {
    const getData = {
      subModuleId: "CLEANING",
      data: {
        specificServeTime: new Date(select?.[0]?.value!),
      },
    };

    try {
      await onCreateHotelRequest(getData);

      navigate(ROUTES.Status);
    } catch (err) {
      console.error(err);
    }
  };

  const generalProps = {
    showTickIcon: true,
    open: !!open,
    setOpen,
    textStyle: { color: "black" },
    style: { width: 150, backgroundColor: "#BAD7E9", borderColor: "transparent", borderRadius: 15 },
    disabled: false,
    items: (DATA || []) as any,
    placeholder: "Время",
  };

  return (
    <ScreenLayoutButton
      buttonText="Подтвердить"
      buttonTo={ROUTES.Status}
      onSubmit={onSubmit}
      isLoading={!select}
    >
      <View className="px-4">
        <View className="flex flex-row items-center justify-center bg-blue-300 py-4 rounded-[20px] mt-4 px-4">
          <View className="opacity-50">
            <CleanIcon />
          </View>
          <View className="opacity-50 ml-6">
            <CustomText className="text-[20px]">Уборка комнаты</CustomText>
          </View>
        </View>
        <View className="mt-6 flex flex-row justify-between">
          {/* <Timepicker name="time" label="Выберите время" /> */}
          <View>
            <DropdownPicker
              {...generalProps}
              placeholder={select?.[0]?.label ?? "Время"}
              multiple={false}
              // @ts-ignore
              onSelectItem={(val: TimeslotWithLabel) => {
                // @ts-ignore
                return setSelect((prev: TimeslotWithLabel[]) => {
                  if (prev?.[0]?.label === val?.label) {
                    return [];
                  } else {
                    return [val];
                  }
                });
              }}
              value={[]}
            />
          </View>
        </View>
      </View>
    </ScreenLayoutButton>
  );
};

export default RoomServiceCleanScreen;

const DATA = [
  { label: "7:30", value: "2024-02-05T07:30:00.000Z" },
  { label: "8:00", value: "2024-02-05T08:00:00.000Z" },
  { label: "8:30", value: "2024-02-05T08:30:00.000Z" },
  { label: "9:00", value: "2024-02-05T09:00:00.000Z" },
  { label: "9:30", value: "2024-02-05T09:30:00.000Z" },
  { label: "10:00", value: "2024-02-05T10:00:00.000Z" },
  { label: "10:30", value: "2024-02-05T10:30:00.000Z" },
  { label: "11:00", value: "2024-02-05T11:00:00.000Z" },
  { label: "11:30", value: "2024-02-05T11:30:00.000Z" },
  { label: "12:00", value: "2024-02-05T12:00:00.000Z" },
  { label: "12:30", value: "2024-02-05T12:30:00.000Z" },
  { label: "13:00", value: "2024-02-05T13:00:00.000Z" },
  { label: "13:30", value: "2024-02-05T13:30:00.000Z" },
  { label: "14:00", value: "2024-02-05T14:00:00.000Z" },
  { label: "14:30", value: "2024-02-05T14:30:00.000Z" },
  { label: "15:00", value: "2024-02-05T15:00:00.000Z" },
  { label: "15:30", value: "2024-02-05T15:30:00.000Z" },
  { label: "16:00", value: "2024-02-05T16:00:00.000Z" },
  { label: "16:30", value: "2024-02-05T16:30:00.000Z" },
  { label: "17:00", value: "2024-02-05T17:00:00.000Z" },
  { label: "17:30", value: "2024-02-05T17:30:00.000Z" },
  { label: "18:00", value: "2024-02-05T18:00:00.000Z" },
  { label: "18:30", value: "2024-02-05T18:30:00.000Z" },
  { label: "19:00", value: "2024-02-05T19:00:00.000Z" },
  { label: "19:30", value: "2024-02-05T19:30:00.000Z" },
  { label: "20:00", value: "2024-02-05T20:00:00.000Z" },
  { label: "20:30", value: "2024-02-05T20:30:00.000Z" },
  { label: "21:00", value: "2024-02-05T21:00:00.000Z" },
  { label: "21:30", value: "2024-02-05T21:30:00.000Z" },
  { label: "22:00", value: "2024-02-05T22:00:00.000Z" },
];
