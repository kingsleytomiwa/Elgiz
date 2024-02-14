import { View } from "react-native";
import ScreenLayoutButton from "../../components/ScreenLayoutButton";
import CustomText from "../../components/CustomText";
import CarIcon from "../../../assets/icons/car.svg";
import Radio from "../../components/ui/Radio";
import { useEffect, useMemo, useState } from "react";
import { ROUTES } from "../../routes";
import Select from "../../components/ui/Select";
import Timepicker from "../../components/ui/Timepicker";
import { twMerge } from "tailwind-merge";
import { FormProvider, useForm } from "react-hook-form";
import { onCreateHotelRequest } from "../../queries";
import { useNavigation } from "@react-navigation/native";
import Datepicker from "../../components/ui/Datepicker";
import * as dateFns from "date-fns";
import { useHotel } from "../../hooks";
import { i18n } from "../../../App";

const ReceptionTransferScreen = () => {
  const [transferStatus, setTransferStatus] = useState("IMMEDIATELY");
  const [select, setSelect] = useState("");
  const { data: hotel } = useHotel();
  const { navigate } = useNavigation();

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

  const data = watch("data");
  const time = watch("time");
  const datetime = dateFns
    .setHours(data, new Date(time).getHours())
    .setMinutes(new Date(time).getMinutes());

  const onSubmit = async () => {
    const getData = {
      subModuleId: "TAXI",
      data: {
        transferTo: select,
        serveTime: transferStatus,
        specificServeTime: new Date(datetime),
      },
    };

    try {
      await onCreateHotelRequest(getData);

      navigate(ROUTES.Status);
    } catch (err) {
      console.error(err);
    }
  };

  const routes = useMemo(
    () => hotel?.parameters?.find((param) => param.type === "RECEPTION")?.routes,
    [hotel?.parameters]
  );
  useEffect(() => {
    if (routes?.length) {
      setSelect(routes?.[0]);
    }
  }, [routes]);

  return (
    <ScreenLayoutButton
      buttonText={i18n?.t("confirm")}
      buttonTo={ROUTES.Status}
			onSubmit={onSubmit}
    >
      <View className="px-4">
        <View className="flex flex-row items-center justify-center bg-blue-300 py-4 rounded-[20px] mt-4">
          <View className="opacity-50">
            <CarIcon />
          </View>
          <View className="opacity-50 ml-6">
            <CustomText className="text-[20px]">{i18n?.t("request_transfer")}</CustomText>
          </View>
        </View>
        <CustomText variant="bold" className="text-[20px] mt-6">
          {i18n?.t("request_transfer")}
        </CustomText>
        <CustomText className="text-[20px] mt-6">{i18n?.t("select_the_airport")}</CustomText>
        <Select
          options={routes?.map((el) => ({ value: el, label: el })) ?? []}
          onChange={(value) => setSelect(value)}
          selectedValue={select}
        />
        <View className="my-6">
          <Radio
            label={i18n?.t("as_soon_as_possible")}
            value={transferStatus}
            setValue={setTransferStatus}
            id="IMMEDIATELY"
          />
        </View>
        <Radio
          label={i18n?.t("by_a_certain_time")}
          value={transferStatus}
          setValue={setTransferStatus}
          id="specificServeTime"
        />
        <View className={twMerge("hidden mt-3", transferStatus === "specificServeTime" && "block")}>
          <FormProvider {...methods}>
            <View className="mt-6 flex flex-row justify-between">
              <Datepicker
                label="Выберите дату"
                name="data"
                date={data}
                options={{
                  value: data,
                  minimumDate: new Date(),
                }}
              />
              <Timepicker name="time" label={i18n?.t("choose_the_time")} />
            </View>
          </FormProvider>
        </View>
      </View>
    </ScreenLayoutButton>
  );
};

export default ReceptionTransferScreen;
