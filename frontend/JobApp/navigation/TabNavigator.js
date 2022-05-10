import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useState } from "react";

import {
    HomeStackNavigator,
    ChatStackNavigator,
    SettingsStackNavigator,
} from "./StackNavigator";

//Screen names
const homeName = "Home";
const chatName = "Chat";
const settingsName = "Settings";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    const [hide, setHide] = useState(false);
    const checkFunction = () => {
        return true;
    };
    return (
        <Tab.Navigator
            initialRouteName={homeName}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    let rn = route.name;
                    if (rn === homeName) {
                        iconName = focused ? "home" : "home-outline";
                    } else if (rn === chatName) {
                        iconName = focused
                            ? "chatbox-ellipses"
                            : "chatbox-ellipses-outline";
                    } else if (rn === settingsName) {
                        iconName = focused ? "settings" : "settings-outline";
                    }

                    return (
                        <Ionicons name={iconName} size={size} color={color} />
                    );
                },
                unmountOnBlur: true,
            })}
        >
            <Tab.Screen
                name={homeName}
                component={HomeStackNavigator}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name={chatName}
                component={ChatStackNavigator}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name={settingsName}
                component={SettingsStackNavigator}
                options={{ headerShown: false }}
            />
        </Tab.Navigator>
    );
};

export { BottomTabNavigator };
