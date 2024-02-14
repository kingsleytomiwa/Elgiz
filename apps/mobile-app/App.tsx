import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef, useState } from "react";
import * as Linking from "expo-linking";
import { useFonts } from "expo-font";
import React from "react";
import { QueryClient, QueryClientProvider } from 'react-query';
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { Subscription } from "expo-modules-core";
import { persistQueryClient } from 'react-query/persistQueryClient-experimental';
import { createAsyncStoragePersistor } from 'react-query/createAsyncStoragePersistor-experimental';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Routes from "./Routes";
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import translations from "translations";

export const i18n = new I18n({});
i18n.translations = translations;
// Set the locale once at the beginning of your app.
i18n.locale = Localization.getLocales()[0].languageCode;

// When a value is missing from a language it'll fall back to another language with the key present.
i18n.enableFallback = true;

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
	}),
});

export async function getPushToken() {
	if (!Device.isDevice) {
		alert("Must use physical device for Push Notifications");
	}

	const { status: existingStatus } = await Notifications.getPermissionsAsync();

	let finalStatus = existingStatus;

	if (existingStatus !== "granted") {
		const { status } = await Notifications.requestPermissionsAsync();
		finalStatus = status;
	}

	if (finalStatus !== "granted") {
		alert("Failed to get push token for push notification!");
		return;
	}

	const token = (await Notifications.getExpoPushTokenAsync()).data;

	if (Platform.OS === "android") {
		Notifications.setNotificationChannelAsync("default", {
			name: "default",
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: "#FF231F7C",
		});
	}

	return token;
}

SplashScreen.preventAutoHideAsync();

const cacheTime = "Infinity";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			cacheTime: cacheTime as any,
		},
	},
});

const asyncStoragePersistor = createAsyncStoragePersistor({
	storage: AsyncStorage,
});

persistQueryClient({
	queryClient,
	persistor: asyncStoragePersistor,
	maxAge: cacheTime as any
});

export default function Native() {
	const [appIsReady, setAppIsReady] = useState(false);
	const [notification, setNotification] =
		useState<Notifications.Notification | null>(null);
	const notificationListener = useRef<Subscription>();
	const responseListener = useRef<Subscription>();

	const [isFontsLoaded] = useFonts({
		GolosRegular: require("../../packages/fonts/Golos-Regular.ttf"),
		GolosMedium: require("../../packages/fonts/Golos-Medium.ttf"),
		GolosBold: require("../../packages/fonts/Golos-Bold.ttf"),
	});

	useEffect(() => {
		async function prepare() {
			try {
				await new Promise((resolve) => setTimeout(resolve, 1800));
			} catch (e) {
				console.warn(e);
			} finally {
				setAppIsReady(true);
			}
		}

		prepare();

		notificationListener.current =
			Notifications.addNotificationReceivedListener(async (notification) => {
				setNotification(notification);
			});

		responseListener.current =
			Notifications.addNotificationResponseReceivedListener((response) => {
				console.log(response);
			});

		return () => {
			Notifications.removeNotificationSubscription(
				notificationListener.current!
			);
			Notifications.removeNotificationSubscription(responseListener.current!);
		};
	}, []);

	useEffect(() => {
		setNotification(prevState => {
			if (prevState?.date !== notification?.date) {
				Notifications.scheduleNotificationAsync({
					content: {
						title: notification?.request?.content?.title ?? "",
						body: notification?.request?.content?.body ?? ""
					},
					trigger: null,
				}).catch(error => console.log(error));
			}
			return notification;
		});
	}, [notification]);

	const onLayoutRootView = React.useCallback(async () => {
		if (isFontsLoaded) {
			await SplashScreen.hideAsync();
		}
	}, [isFontsLoaded]);

	if (!isFontsLoaded) {
		return null;
	}

	return (
		<QueryClientProvider client={queryClient}>
			<SafeAreaProvider onLayout={onLayoutRootView}>
				<NavigationContainer
					linking={{
						prefixes: [Linking.createURL("/")],
						config: { screens: { Languages: "Languages" } },
					}}
				>
					<Routes />
				</NavigationContainer>
			</SafeAreaProvider>
		</QueryClientProvider>
	);
}
