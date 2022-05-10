import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

//Screens
import HomeScreen from "./screens/HomeScreen";
import ChatScreen from "./screens/ChatScreen";
import SettingsScreen from "./screens/SettingsScreen";
import JobDetails from "./screens/JobDetails";
import PostJob from "./screens/PostJob";
import ConversationScreen from "./screens/conversationScreen";
import ResumeScreen from "./screens/ResumeScreen";

const Stack = createStackNavigator();

//Screen names
const homeName = "JobList";
const chatsName = "Chat ";
const settingsName = "Settings ";

const conversationName = "Conversation";
const resumeName = "Resume";

const HomeStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name={homeName} component={HomeScreen} />
            <Stack.Screen name="JobDetails" component={JobDetails} />
            <Stack.Screen name="PostJob" component={PostJob} />
        </Stack.Navigator>
    );
};
const ChatStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name={chatsName} component={ChatScreen} />
            <Stack.Screen
                name={conversationName}
                component={ConversationScreen}
            />
            <Stack.Screen name={resumeName} component={ResumeScreen} />
        </Stack.Navigator>
    );
};
const SettingsStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name={settingsName} component={SettingsScreen} />
        </Stack.Navigator>
    );
};

export { HomeStackNavigator, ChatStackNavigator, SettingsStackNavigator };
