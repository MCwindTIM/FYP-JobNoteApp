import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, ToastAndroid } from "react-native";

import { AuthContext } from "../../components/context";

import Header from "../../components/Header";
import { theme } from "../../Core/Theme";
import TextInput from "../../components/TextInput";
import Background from "../../components/Background";
import Button from "../../components/Button";

// import {MarkdownEditor} from 'react-native-markdown-editor';

export default function PostJob({ navigation }) {
    const { getUserToken, getAPIServiceURL } = React.useContext(AuthContext);
    const UserToken = getUserToken();
    const APIServiceURL = getAPIServiceURL();
    const [JobTitle, setJobTitle] = useState({ value: "", error: "" });
    const [JobDetails, setJobDetails] = useState({ value: "", error: "" });

    const onSubmitPressed = () => {
        if (JobTitle.value === "") {
            return setJobTitle({
                ...JobTitle,
                error: "Please enter a job title",
            });
        }
        if (JobDetails.value === "") {
            return setJobDetails({
                ...JobDetails,
                error: "Please enter job details",
            });
        }
        fetch(`${APIServiceURL}/postJob`, {
            headers: {
                UserToken: UserToken,
                JobTitle: encodeURIComponent(JobTitle.value),
                JobDetails: encodeURIComponent(JobDetails.value),
            },
        }).then((response) => {
            if (response.status === 200) {
                response.json().then((json) => {
                    if (json.success) {
                        ToastAndroid.show("Post Success!", ToastAndroid.SHORT);
                        navigation.navigate("JobList");
                    } else {
                        console.log(json);
                        console.log("failed!");
                    }
                });
            } else {
                setJobDetails({
                    ...JobDetails,
                    error: "Server currently not available",
                });
            }
        });
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#FFF" }}>
            <Background>
                <Header>Post a New Job</Header>
                <TextInput
                    label="Title"
                    returnKeyType="next"
                    value={JobTitle.value}
                    onChangeText={(text) =>
                        setJobTitle({ value: text, error: "" })
                    }
                    error={!!JobTitle.error}
                    errorText={JobTitle.error}
                />
                <TextInput
                    label="Details (Mutiple lines supported)"
                    returnKeyType="done"
                    value={JobDetails.value}
                    onChangeText={(text) =>
                        setJobDetails({ value: text, error: "" })
                    }
                    multiline
                    style={styles.Details}
                    error={!!JobDetails.error}
                    errorText={JobDetails.error}
                />
                <Button mode="contained" onPress={onSubmitPressed}>
                    Submit
                </Button>
            </Background>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    forgotPassword: {
        width: "100%",
        alignItems: "flex-end",
        marginBottom: 24,
    },
    row: {
        flexDirection: "row",
        marginTop: 4,
    },
    forgot: {
        fontSize: 13,
        color: theme.colors.secondary,
    },
    link: {
        fontWeight: "bold",
        color: theme.colors.primary,
    },
    TextInput: {
        padding: 50,
    },
    Details: {
        backgroundColor: "#fff",
        borderBottomColor: "#000000",
        borderBottomWidth: 1,
    },
});
