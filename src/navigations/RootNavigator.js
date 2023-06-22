import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Landing } from "../modules";
import { Styles } from "../assets";
import { transitionConfig } from "../utils";
import { DashboardNavigator, GamePlayNavigator } from "./navigators";
import SplashScreen from "react-native-splash-screen";

const RootStack = createStackNavigator();

const Container = Platform.OS == "ios" ? KeyboardAvoidingView : View;

const RootNavigator = () => {

	// States

	const INSETS = useSafeAreaInsets();
	const [READY, SET_READY] = useState(false);
	const [INITIAL_ROUTE, SET_INITIAL_ROUTE] = useState("LANDING_SCREEN");

	// Handlers

	const handlerUnhandledAction = (e) => {
		console.log("[NAVIGATION ERROR]: ", e);
	};

	// Effects

	useEffect(() => {

		/* Hide splash screen in android */
		SplashScreen?.hide();
		
		AsyncStorage.getItem("USER").then((value) => {
			if (value) SET_INITIAL_ROUTE("DASHBOARD_NAVIGATOR")
			SET_READY(true)
		}).catch((err) => console.log("[AsyncStorage]: ", err));
	}, []);

	// Renders

	if (!READY) return null

	return (
		<Container
			style={Styles.container}
			behavior="padding"
			keyboardVerticalOffset={-INSETS.bottom} >
			
			<NavigationContainer onUnhandledAction={handlerUnhandledAction}>
				
				<RootStack.Navigator
					initialRouteName={INITIAL_ROUTE}
					screenOptions={{headerShown: false}}>
				
					<RootStack.Screen
						name="LANDING_SCREEN"
						component={Landing}
						options={{ ...transitionConfig }} />
				
					<RootStack.Screen
						name="DASHBOARD_NAVIGATOR"
						component={DashboardNavigator}
						options={{ ...transitionConfig }} />
				
					<RootStack.Screen
						name="GAMEPLAY_NAVIGATOR"
						component={GamePlayNavigator}
						options={{ ...transitionConfig }} />
						
				</RootStack.Navigator>
			</NavigationContainer>
		</Container>
	);
};

export default RootNavigator;
