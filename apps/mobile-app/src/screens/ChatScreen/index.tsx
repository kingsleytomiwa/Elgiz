import {
  Button,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import ScreenLayoutButton from "../../components/ScreenLayoutButton";
import ChatIcon from "../../../assets/icons/chat.svg";
import CustomText from "../../components/CustomText";
import MessageCard from "./MessageCard";
import Input from "../../components/ui/Input";
import { useForm } from "react-hook-form";
import { onSendMessage } from "../../queries";
import { useState } from "react";
import { useGuest, useMessages, useOptimisticMutation } from "../../hooks";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation } from "react-query";
import { i18n, queryClient } from "../../../App";
import { formatTime } from "utils";
import SendIcon from "../../../assets/icons/send.svg";

const ChatScreen = () => {
  const { control, getValues, resetField } = useForm();
  const { data: guest } = useGuest();
  const [isLoading, setIsLoading] = useState(false);

  const { data: messages, refetch } = useMessages();

  const { mutateAsync } = useOptimisticMutation(
    {
      mutationFn: onSendMessage,
    },
    "messages",
    {
      senderId: guest?.id,
      createdAt: new Date(),
    }
  );

  const onSend = async () => {
    const text = getValues()?.message;
    if (!text) return;
    setIsLoading(true);

    try {
      await mutateAsync({
        text,
      });
      await refetch();
      resetField("message");
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  return (
    <ScreenLayoutButton>
      <View className="mt-4 py-4 flex flex-row justify-center bg-[#BAD7E9] opacity-50 rounded-[20px]">
        <ChatIcon />
        <CustomText className="text-[20px] ml-6">{i18n?.t("chat")}</CustomText>
      </View>

      <View className="flex-1 px-4">
        <FlatList
          className="mt-2"
          inverted
          contentContainerStyle={{ flexDirection: "column-reverse" }}
          data={messages}
          keyExtractor={({ id }) => id}
          renderItem={({ item: { text, createdAt, senderId, id }, index }) => {
            const isLastOfAuthor = senderId !== messages?.[index + 1]?.senderId;

            return (
              <MessageCard
                key={id}
                isMe={senderId === guest?.id}
                text={text}
                time={isLastOfAuthor ? formatTime(new Date(createdAt!)) : ""}
                className={isLastOfAuthor ? "mb-4" : "mb-2"}
              />
            );
          }}
        />
        <View className="relative">
          <Input
            control={control}
            name="message"
            placeholder={i18n?.t("enter_your_message")}
            editable={!isLoading}
            onSubmitEditing={onSend}
            className="bg-gray-100 border border-[#D9D9D9] rounded-[8px]"
          />
          <TouchableOpacity onPress={onSend} className="absolute right-3 top-1/2 -mt-3 w-6 h-6">
            <SendIcon />
          </TouchableOpacity>
        </View>
      </View>
    </ScreenLayoutButton>
  );
};

export default ChatScreen;
