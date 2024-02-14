import React from "react";
import { View, Animated, Easing } from "react-native";
import LoadingIcon from "../../../assets/icons/loading.svg";
import CheckOpacityIcon from "../../../assets/icons/check-opacity.svg";
import CheckIcon from "../../../assets/icons/check.svg";
import CustomText from "../CustomText";
import { useRef, useEffect } from "react";

const VARIANT_STATUS = {
  process: "process",
  inWaiting: "inWaiting",
  ready: "ready",
};

export type VariantStatus = keyof typeof VARIANT_STATUS;

interface Props {
  status?: VariantStatus;
  text: string;
}

const Item: React.FC<Props> = ({ status = "inWaiting", text }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [fadeAnim]);

  const rotate = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View className="flex flex-row mt-5">
      {status === "inWaiting" ? (
        <CheckOpacityIcon />
      ) : status === "process" ? (
        <Animated.View style={{ transform: [{ rotate }] }}>
          <LoadingIcon />
        </Animated.View>
      ) : (
        <CheckIcon />
      )}
      <CustomText className="ml-4 text-[20px] text-white">{text}</CustomText>
    </View>
  );
};

export default Item;
