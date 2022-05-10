import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
    ToastAndroid,
} from "react-native";

import { AuthContext } from "../../components/context";

import Header from "../../components/Header";
import { theme } from "../../Core/Theme";
import TextInput from "../../components/TextInput";
import Background from "../../components/Background";
import Button from "../../components/Button";

export default function CreateNoteScreen({ navigation, route }) {
    const FromRedirectButton = route.params === undefined ? false : true;
    const { getUserToken, getAPIServiceURL } = React.useContext(AuthContext);
    const UserToken = getUserToken();
    const APIServiceURL = getAPIServiceURL();
    const [Note, setNote] = useState({ value: "", error: "" });
    const Job = FromRedirectButton ? route.params.Job : {};

    const onSubmitPressed = () => {
        if (Note.value === "") {
            return setNote({
                ...Note,
                error: "Please enter Note",
            });
        }
        if (FromRedirectButton) {
            fetch(`${APIServiceURL}/addNote`, {
                headers: {
                    UserToken: UserToken,
                    job_id: Job._id,
                    Note: encodeURIComponent(Note.value),
                },
            }).then((response) => {
                if (response.status === 200) {
                    response.json().then((json) => {
                        if (json.success) {
                            ToastAndroid.show("Note Added", ToastAndroid.SHORT);
                            //DONE: goto Note details page
                            fetch(`${APIServiceURL}/getNote`, {
                                headers: {
                                    job_id: Job._id,
                                    usertoken: UserToken,
                                },
                            }).then((response) => {
                                if (response.status === 200) {
                                    response.json().then((json) => {
                                        if (json.success) {
                                            navigation.navigate(
                                                "Note Details",
                                                {
                                                    Job: Job,
                                                    Note: json.data,
                                                }
                                            );
                                        } else {
                                            navigation.goBack();
                                        }
                                    });
                                } else {
                                    Alert.alert(
                                        "Server currently not available"
                                    );
                                }
                            });
                        } else {
                            Alert.alert(json.message);
                        }
                    });
                } else {
                    setNote({
                        ...Note,
                        error: "Server currently not available",
                    });
                }
            });
        } else {
            fetch(`${APIServiceURL}/addNote`, {
                headers: {
                    usertoken: UserToken,
                    note: encodeURIComponent(Note.value),
                },
            }).then((response) => {
                if (response.status === 200) {
                    response.json().then((json) => {
                        if (json.success) {
                            ToastAndroid.show("Note Added", ToastAndroid.SHORT);
                            navigation.goBack();
                        } else {
                            Alert.alert(json.message);
                        }
                    });
                } else {
                    setNote({
                        ...Note,
                        error: "Server currently not available",
                    });
                }
            });
        }
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#FFF" }}>
            <Background>
                {FromRedirectButton ? (
                    <View>
                        <Header>Add New Note To The Job</Header>
                        <Text style={styles.text}>
                            {decodeURIComponent(Job.Title)}
                        </Text>
                    </View>
                ) : (
                    <Header>Add New Note</Header>
                )}
                <TextInput
                    label="Note (Mutiple lines supported)"
                    returnKeyType="done"
                    value={Note.value}
                    onChangeText={(text) => setNote({ value: text, error: "" })}
                    multiline
                    style={styles.Details}
                    error={!!Note.error}
                    errorText={Note.error}
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

// #NOTE: This is Example route.params
// Object {
//     "key": "Create Note-4NaN9Lo9dESFnzA_kLNJ5",
//     "name": "Create Note",
//     "params": Object {
//       "Job": Object {
//         "Author": "Cheungwaiyin",
//         "AuthorID": "61d2c4e2cddf3454f88c77d2",
//         "Details": "Wwe",
//         "Title": "Abbb",
//         "_id": "61d2cf1b4fecc0b50fc08600",
//       },
//     },
//     "path": undefined,
//   }
