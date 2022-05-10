import React, { useEffect, useLayoutEffect } from "react";
import { View, Text, ToastAndroid } from "react-native";

import NotesFlatList from "../util/FlatListNotes";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AuthContext } from "../../components/context";

export default function NotesListScreen({ navigation }) {
    const { getJobRedirect, getAPIServiceURL, getUserToken } =
        React.useContext(AuthContext);
    const UserToken = getUserToken();
    const APIServiceURL = getAPIServiceURL();
    const { Forward, Job } = getJobRedirect();
    if (Forward) {
        fetch(`${APIServiceURL}/getNote`, {
            headers: {
                usertoken: UserToken,
                job_id: Job._id,
            },
        }).then((response) => {
            if (response.status === 200) {
                response.json().then((json) => {
                    if (json.success) {
                        navigation.navigate("Note Details", {
                            Job: Job,
                            Note: json.data,
                        });
                    } else {
                        navigation.navigate("Create Note", { Job: Job });
                    }
                });
            } else {
                ToastAndroid.show("Server currently not available");
            }
        });
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => <AddNotesIconButton navigation={navigation} />,
            headerLeft: () => (
                <Ionicons
                    name="ios-menu"
                    size={30}
                    onPress={() => {
                        navigation.openDrawer();
                    }}
                />
            ),
        });
    }, [navigation]);

    useEffect(() => {});

    return <NotesFlatList navigation={navigation} />;
}

const AddNotesIconButton = ({ navigation }) => {
    return (
        <Ionicons
            name="add"
            size={35}
            onPress={() => {
                navigation.navigate("Create Note");
            }}
        />
    );
};
