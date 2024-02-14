import LanguagesScreen from "./src/screens/LanguagesScreen";
import React, { useEffect, useState } from "react";
import CodeScreen from "./src/screens/CodeScreen";
import DataConfirmationScreen from "./src/screens/DataConfirmationScreen";
import IndexScreen from "./src/screens/IndexScreen";
import MainScreen from "./src/screens/MainScreen";
import RestaurantScreen from "./src/screens/RestaurantScreen";
import MenuScreen from "./src/screens/RestaurantScreen/menu";
import MenuOrderScreen from "./src/screens/RestaurantScreen/menuOrder";
import PriceScreen from "./src/screens/RestaurantScreen/price";
import StatusScreen from "./src/screens/RestaurantScreen/status";
import RoomServiceScreen from "./src/screens/RoomServiceScreen";
import RoomServiceIronScreen from "./src/screens/RoomServiceScreen/RoomServiceIron";
import RoomServiceTechnicalScreen from "./src/screens/RoomServiceScreen/RoomServiceTechnical";
import RoomServiceCleanScreen from "./src/screens/RoomServiceScreen/RoomServiceCleen";
import RoomServiceDishesScreen from "./src/screens/RoomServiceScreen/RoomServiceDishes";
import ReceptionScreen from "./src/screens/ReceptionScreen";
import ReceptionTransferScreen from "./src/screens/ReceptionScreen/ReceptionTransfer";
import ReceptionShopScreen from "./src/screens/ReceptionScreen/ReceptionShop";
import ReceptionOrderScreen from "./src/screens/ReceptionScreen/ReceptionOrder";
import ReceptionFeedbackScreen from "./src/screens/ReceptionScreen/ReceptionFeedback";
import SpaScreen from "./src/screens/SpaScreen";
import RequestScreen from "./src/screens/RequestScreen.tsx";
import SpaVisitScreen from "./src/screens/SpaScreen/SpaVisit";
import SpaTimeScreen from "./src/screens/SpaScreen/SpaTime";
import SpaMasterScreen from "./src/screens/SpaScreen/SpaMaster";
import SpaConfirmationScreen from "./src/screens/SpaScreen/SpaConfirmation";
import RequestInfoScreen from "./src/screens/RequestScreen.tsx/RequestInfo";
import ChatScreen from "./src/screens/ChatScreen";
import { useGuest, useHotel } from "./src/hooks";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getPushToken, i18n } from "./App";
import { setPushToken } from "./src/queries";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();

const Routes = () => {
	const [wasSplashDisplayed, setWasSplashDisplayed] = useState(false);
	const { data: guest } = useGuest();
	const { data: hotel } = useHotel();

	useEffect(() => {
		AsyncStorage.getItem("language").then((lang) => {
			if (lang) {
				i18n.locale = lang;
			}
		});
	}, []);

	useEffect(() => {
		AsyncStorage.getItem('wasSplashDisplayed').then((result) => {
			setWasSplashDisplayed(!!result);
		});

		if (!guest?.pushToken) {
			getPushToken().then((token) =>
				setPushToken({ token })
			);
		}
	}, [guest]);

	return (
		<Stack.Navigator screenOptions={{ gestureEnabled: false, animation: 'none' }}>
			{guest ? (
				<>
					{/* @ts-ignore */}
					{guest?.initialLogin && (
						<Stack.Screen
							name="DataConfirmation"
							component={DataConfirmationScreen}
							options={{ headerShown: false }}
						/>
					)}

					<Stack.Screen
						name="Main"
						component={MainScreen}
						options={{ headerShown: false }}
					/>

					<Stack.Screen
						name="Index"
						component={(hotel?.settings as any)?.splash?.screen && !wasSplashDisplayed ? IndexScreen : MainScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="Restaurant"
						component={RestaurantScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="Menu"
						component={MenuScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="MenuOrder"
						component={MenuOrderScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="Price"
						component={PriceScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="RoomService"
						component={RoomServiceScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="RoomServiceIron"
						component={RoomServiceIronScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="Status"
						component={StatusScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="RoomServiceTechnical"
						component={RoomServiceTechnicalScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="RoomServiceClean"
						component={RoomServiceCleanScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="RoomServiceDishes"
						component={RoomServiceDishesScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="Reception"
						component={ReceptionScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="ReceptionTransfer"
						component={ReceptionTransferScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="ReceptionShop"
						component={ReceptionShopScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="ReceptionOrder"
						component={ReceptionOrderScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="ReceptionFeedback"
						component={ReceptionFeedbackScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="Spa"
						component={SpaScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="SpaVisit"
						component={SpaVisitScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="SpaTime"
						component={SpaTimeScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="SpaMaster"
						component={SpaMasterScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="SpaConfirmation"
						component={SpaConfirmationScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="Request"
						component={RequestScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="RequestInfo"
						component={RequestInfoScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="Chat"
						component={ChatScreen}
						options={{ headerShown: false }}
					/>
				</>
			) : (
				<>
					<Stack.Screen
						name="Languages"
						component={LanguagesScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="Code"
						component={CodeScreen}
						options={{ headerShown: false }}
					/>
				</>
			)}
		</Stack.Navigator>
	);
};

export default Routes;