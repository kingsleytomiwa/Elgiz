import React, { useState, useRef, useMemo } from "react";
import { TouchableOpacity, View, Animated, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowIcon } from "../ui/icons/ArrowIcon";
import { useNavigation } from "@react-navigation/native";
import { twMerge } from "tailwind-merge";
import { RootStackParamList } from "../../../typings/nav";
import CustomText from "../CustomText";
import { ROUTES } from "../../routes";
import { deviceHeight } from "../../../utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { i18n, queryClient } from "../../../App";

interface Props {
	children: React.ReactNode;
	to?: keyof RootStackParamList;
	back?: (() => void) | boolean;
	burger?: boolean;
	className?: string;
	white?: boolean;
	isLoading?: boolean;
	onSubmit?: () => void;
}

const ScreenLayout: React.FC<Props> = ({
	children,
	to,
	onSubmit,
	back = false,
	burger = false,
	className,
	white = false,
	isLoading = false
}) => {
	const { navigate, goBack } = useNavigation();
	const [openBurger, setOpenBurger] = useState(false);
	const fadeAnim = useRef(new Animated.Value(0)).current;

	useMemo(() => {
		if (openBurger) {
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 300,
				useNativeDriver: true,
			}).start();
		} else {
			Animated.timing(fadeAnim, {
				toValue: 0,
				duration: 300,
				useNativeDriver: true,
			}).start();
		}
	}, [openBurger]);

	const spinTop = fadeAnim.interpolate({
		inputRange: [0, 1],
		outputRange: ["0deg", "45deg"],
	});
	const spinBottom = fadeAnim.interpolate({
		inputRange: [0, 1],
		outputRange: ["0deg", "-45deg"],
	});
	const menuClick = (event: keyof RootStackParamList) => {
		// @ts-ignore
		navigate(event);
		setOpenBurger(false);
	};

	return (
		<>
			<SafeAreaView
				className={twMerge(
					"h-full bg-blue-400 pt-[21px] pb-[60px] relative",
					white && "bg-gray-100"
				)}
			>
				<View
					className={twMerge("h-full bg-gray-100 rounded-[20px]", className)}
				>
					{children}
				</View>
				<View
					className={twMerge(
						"absolute w-full bottom-6 right-0 flex flex-row justify-between px-10",
						Platform.OS === "android" && "bottom-2"
					)}
				>
					<View>
						<TouchableOpacity
							disabled={isLoading}
							onPress={typeof back === "function" ? back : goBack}
							className={twMerge(
								"hidden rotate-180 w-[93px] h-12 items-center justify-center rounded-[20px]",
								back && "flex"
							)}
						>
							<ArrowIcon fill={"white"} />
						</TouchableOpacity>
					</View>
					{onSubmit ? <View className={twMerge(burger && "hidden")}>
						<TouchableOpacity
							disabled={isLoading}
							onPress={onSubmit}
							className={twMerge(
								"flex w-[93px] h-12 items-center bg-gray-100 justify-center rounded-[20px]",
							)}
						>
							<ArrowIcon />
						</TouchableOpacity>
					</View> : null}
					<TouchableOpacity
						onPress={() => setOpenBurger(!openBurger)}
						className={twMerge("hidden w-12 h-10 relative", burger && "block")}
					>
						<Animated.View
							className={twMerge(
								"absolute top-0 left-0 w-full bg-gray-100 rounded-[20px] h-[3px]",
								openBurger && "top-3",
								white && "bg-blue-400"
							)}
							style={{ transform: [{ rotate: spinTop }] }}
						/>
						<View
							className={twMerge(
								"absolute top-3 left-0 w-full bg-gray-100 rounded-[20px] h-[3px]",
								openBurger && "hidden",
								white && "bg-blue-400"
							)}
						/>
						<Animated.View
							className={twMerge(
								"absolute top-6 left-0 w-full bg-gray-100 rounded-[20px] h-[3px]",
								openBurger && "top-3",
								white && "bg-blue-400"
							)}
							style={{ transform: [{ rotate: spinBottom }] }}
						/>
					</TouchableOpacity>
				</View>
				<Animated.View
					pointerEvents={openBurger ? "auto" : "none"}
					className={twMerge(
						"absolute top-0 bg-blue-400 w-full flex items-center justify-center",
						white && "bg-gray-100"
					)}
					style={[
						{
							opacity: fadeAnim,
							height:
								Platform.OS === "ios" ? deviceHeight - 68 : deviceHeight - 0,
						},
					]}
				>
					<TouchableOpacity onPress={() => menuClick(ROUTES.Main)}>
						<CustomText
							variant="bold"
							className={twMerge(
								"text-[20px] text-gray-100",
								white && "text-blue-400"
							)}
						>
							{i18n?.t("main_menu")}
						</CustomText>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => menuClick(ROUTES.Request)}>
						<CustomText
							variant="bold"
							className={twMerge(
								"text-[20px] text-gray-100 my-12",
								white && "text-blue-400"
							)}
						>
							{i18n?.t("my_requests")}
						</CustomText>
					</TouchableOpacity>
					<TouchableOpacity onPress={async() => {
						await AsyncStorage.removeItem("wasSplashDisplayed");
						await AsyncStorage.removeItem("accessToken");
						await AsyncStorage.removeItem("refreshToken");
						await queryClient.resetQueries();
						queryClient.setQueryData("me", null);
						queryClient.setQueryData("hotel", null);
						setOpenBurger(false);
					}}>
						<CustomText
							variant="bold"
							className={twMerge(
								"text-[20px] text-gray-100",
								white && "text-blue-400"
							)}
						>
							{i18n?.t("go_out")}
						</CustomText>
					</TouchableOpacity>
				</Animated.View>
			</SafeAreaView>
		</>
	);
};

export default ScreenLayout;
