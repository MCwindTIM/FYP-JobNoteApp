import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

//Screens
import FollowingFlatList from "./util/FlatListFollowing";
import JobDetails from "./screens/JobDetails";

const Stack = createStackNavigator();

//Screen names
const followingListName = "Following";
const followingJobDetailsName = "JobDetailsFromFollowing";

const FollowingListStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name={followingListName}
                component={FollowingFlatList}
            />
            <Stack.Screen
                name={followingJobDetailsName}
                component={JobDetails}
            />
        </Stack.Navigator>
    );
};

export { FollowingListStackNavigator };
