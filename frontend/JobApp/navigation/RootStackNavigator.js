import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

//Screen names
const loginName = "Login";
const registerName = "Register";

//Screen
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";

import { Navigation } from "react-native-navigation";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";

const RootStackNavigator = () => {
    Navigation.registerComponent("tk.duckduckdoc.appRootScreen", () =>
        gestureHandlerRootHOC(App)
    );
    return (
        <Stack.Navigator>
            <Stack.Screen
                name={loginName}
                component={LoginScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={registerName}
                component={RegisterScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

export default RootStackNavigator;
