import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

import { BottomTabNavigator } from "./TabNavigator";
import { NotesListStackNavigator } from "./NotesNavigator";
import { FollowingListStackNavigator } from "./FollowingNavigator";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
    return (
        <Drawer.Navigator
            // initialRouteName="Main Page"
            screenOptions={{
                swipeEdgeWidth: 150,
            }}
        >
            <Drawer.Screen
                name="Job"
                component={BottomTabNavigator}
                options={{ headerShown: false }}
            />
            <Drawer.Screen
                name="NotesList"
                component={NotesListStackNavigator}
                options={{ headerShown: false }}
            />
            <Drawer.Screen
                name="Following Job"
                component={FollowingListStackNavigator}
                options={{ headerShown: false }}
            />
        </Drawer.Navigator>
    );
};

export { DrawerNavigator };
