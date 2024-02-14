import { Image, ImageSourcePropType, View } from "react-native";
import { twMerge } from "tailwind-merge";
import CustomText from "../../../components/CustomText";

type MessageCardProps = {
  isMe: boolean;
  className: string;
  avatar?: ImageSourcePropType;
  text: string;
  time: string;
};

const MessageCard: React.FC<MessageCardProps> = ({ className, isMe, avatar, text, time }) => (
  <View className={twMerge("flex flex-row w-full mb-1.5", isMe ? "justify-end" : "", className)}>
    <View className={twMerge("max-w-[310px]", isMe ? "items-end" : "")}>
      <View
        className={twMerge(
          "px-6 py-2 rounded-[15px]",
          isMe
            ? "bg-blue-400 rounded-tr-[50px] rounded-bl-[50px]"
            : "bg-[#DBEBED] rounded-tl-[50px] rounded-br-[50px]"
        )}
      >
        <CustomText className={twMerge("text-[20px] text-blue-400", isMe && "text-gray-100")}>
          {text}
        </CustomText>
        {time && (
          <View className={"items-end"}>
            <CustomText
              className={twMerge("text-[14px] opacity-50", isMe ? "text-white" : "text-blue-400")}
            >
              {time}
            </CustomText>
          </View>
        )}
      </View>
    </View>
  </View>
);

export default MessageCard;
