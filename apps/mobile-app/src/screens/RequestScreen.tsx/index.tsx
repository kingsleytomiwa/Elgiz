import { ActivityIndicator, ScrollView, TouchableOpacity, View } from "react-native";
import CustomText from "../../components/CustomText";
import ScreenLayout from "../../components/ScreenLayout";
import { useNavigation } from "@react-navigation/native";
import { ROUTES } from "../../routes";
import { format } from "date-fns";
import { RequestPaymentPlaceTypeLabel, RequestTypeLabel, getNextStatus } from "utils/constants";
import { useAtom } from "jotai";
import { requestAtom } from "../../store/atoms";
import { useRequests } from "../../hooks";
import { i18n } from "../../../App";

const RequestScreen = () => {
  const { navigate } = useNavigation();
  const [, setRequest] = useAtom(requestAtom);

  const { data: requests, isLoading } = useRequests();

  

  return (
    <ScreenLayout burger white>
      <View className="px-4">
        <CustomText variant="bold" className="text-[20px]">
          {i18n?.t("my_requests")} - {requests?.count}
        </CustomText>
        <ScrollView showsVerticalScrollIndicator={false} className="mt-4">
          {isLoading && (
            <ActivityIndicator
              className="flex justify-center items-center z-30"
              size="large"
              color="black"
            />
          )}

          {requests?.data?.map((item, i) => {
            if (!item.id) return;
            const lastChanged = item?.history && item?.history?.length - 1;
            const changedAt = lastChanged && item?.history?.[lastChanged]?.changedAt;
            const date = format(new Date(changedAt ? changedAt : item.createdAt), "dd/MM/yyyy HH:mm:ss");
            const paymentPlace = RequestPaymentPlaceTypeLabel[(item?.data as any)?.paymentPlace as "ROOM"];

            return (
              <TouchableOpacity
                onPress={() => {
                  setRequest(item);
                  navigate(ROUTES.RequestInfo);
                }}
                key={i}
                className="mb-4 p-4 border-b border-[#B3B9C1]"
              >
                <CustomText variant="bold" className="text-[20px] text-blue-400">
                  {i18n?.t(RequestTypeLabel[item.type])}
                </CustomText>
                <CustomText className="text-[18px] mt-1.5 text-[#121828]">
                  {i18n?.t("status")}: {i18n?.t(getNextStatus(item.status).currentStatus.toLowerCase())}
                </CustomText>
                {paymentPlace && (
                  <CustomText className="text-[18px] mt-1.5 text-[#121828]">
                    {i18n?.t("payment")}: {paymentPlace}
                  </CustomText>
                )}
                <CustomText className="text-[18px] mt-1.5 text-[#121828]">
                  {date}
                </CustomText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </ScreenLayout>
  );
};

export default RequestScreen;
