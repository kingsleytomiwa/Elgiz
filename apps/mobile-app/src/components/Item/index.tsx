import { View, Image, TouchableOpacity } from "react-native";
import CustomText from "../CustomText";
import PlusIcon from "../../../assets/icons/plus.svg";
import MinusIcon from "../../../assets/icons/minus.svg";
import { deviceWidth } from "../../../utils";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { positionsAtom } from "../../store/atoms";
import { useAtom } from "jotai";

interface Props {
  id: string;
  image: string;
  weight?: number;
  title: string;
  description?: string;
  price?: number;
  one?: boolean;
  onRemove?: () => void;
  onAdd?: () => void;
}

const Item: React.FC<Props> = ({
  id,
  image,
  weight,
  title,
  description,
  price,
  one = false,
  onRemove,
  onAdd,
}) => {
  const [positions, setPositions] = useAtom(positionsAtom);

  const position = positions.length ? positions?.find((el) => el.id === id) : null;
  const count = position?.count || 0;

  return (
    <View className="flex flex-row justify-between w-full items-center pb-[37px] border-b border-[#2B346740] mb-[53px]">
      <View className={twMerge("flex flex-row items-center w-[55%]", one && "w-[75%]")}>
        <Image
          source={typeof image === "string" ? { uri: image } : image}
          className="w-[83px] h-[88px] rounded-[10px]"
          resizeMode="cover"
        />
        <View className="ml-4">
          {weight && <CustomText className="opacity-25 text-[14px]">{weight}г</CustomText>}
          <CustomText variant="bold" className="text-[20px] mt-1.5">
            {title}
          </CustomText>
          <CustomText className="text-[18px] opacity-25 mt-1.5">{description}</CustomText>
          {price && (
            <CustomText className="text-[14px] flex-1 mt-1.5">{price?.toFixed(2)}€</CustomText>
          )}
        </View>
      </View>
      <View className={twMerge("relative h-full", one && "hidden")}>
        <View className="flex flex-row items-center absolute bottom-0 right-0">
          <View
            pointerEvents={count > 0 ? "auto" : "none"}
            className={twMerge("opacity-0", count > 0 && "opacity-100")}
          >
            {onRemove && (
              <TouchableOpacity
                onPress={onRemove}
                className="w-6 h-6 rounded-[5px] border border-gray-400 flex items-center justify-center"
              >
                <MinusIcon />
              </TouchableOpacity>
            )}
          </View>

          {position?.type && ["FOOD_ORDER", "SHOP"].includes(position?.type) ? (
            <CustomText className="mx-4 text-[14px]">{count > 0 ? count : ""}</CustomText>
          ) : null}
          {onAdd && (
            <TouchableOpacity
              onPress={onAdd}
              className="w-6 h-6 rounded-[5px] border border-gray-400 flex items-center justify-center"
            >
              <PlusIcon />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default Item;
