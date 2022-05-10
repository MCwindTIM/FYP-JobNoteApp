import React, { useEffect, useRef } from "react";
import {
    Text,
    StyleSheet,
    View,
    SafeAreaView,
    ScrollView,
    Pressable,
    Alert,
    ToastAndroid,
} from "react-native";

import FadeIn from "../../components/FadeIn";

import { AuthContext } from "../../components/context";

import AvatarImage from "../../components/Avatar";
import { Modalize } from "react-native-modalize";

export default function NoteDetailsScreen({ route, navigation }) {
    const {
        getJobRedirect,
        getAPIServiceURL,
        getUserToken,
        setJob,
        getUserData,
    } = React.useContext(AuthContext);
    const Note_ID = route.params._id;
    const { Job, Note } = route.params;
    const APIServiceURL = getAPIServiceURL();

    const modalizeDeleteRef = useRef(null);

    useEffect(() => {
        if (Job) {
            navigation.setOptions({
                title: decodeURIComponent(Job.Title),
            });
        }
    });

    const confirmPopUp = () => {
        if (modalizeDeleteRef.current) {
            modalizeDeleteRef.current.open();
        }
        // Alert.alert("Deleting Note", "Are you sure?", [
        //     {
        //         text: "Cancel",
        //     },
        //     {
        //         text: "I'm sure",
        //         onPress: () => {
        //             deleteNote();
        //         },
        //     },
        // ]);
    };
    const deleteNote = () => {
        fetch(`${APIServiceURL}/deleteNote`, {
            headers: {
                note_id: Note_ID ? Note_ID : Note._id,
            },
        }).then((response) => {
            if (response.status === 200) {
                response.json().then((json) => {
                    if (json.success) {
                        navigation.navigate("Notes List");
                        ToastAndroid.show(
                            "Successfully Deleted",
                            ToastAndroid.SHORT
                        );
                    } else {
                        Alert.alert("Error", json.message);
                    }
                });
            } else {
                Alert.alert(
                    "Error",
                    "Server currently not available, Please check your connection."
                );
            }
        });
    };

    return (
        <View style={{ backgroundColor: "#FFFFFF", height: "100%" }}>
            <SafeAreaView>
                <FadeIn>
                    <ScrollView style={{ backgroundColor: "white" }}>
                        {Job ? (
                            <Text
                                style={{
                                    fontSize: 30,
                                    fontWeight: "bold",
                                    textAlign: "center",
                                }}
                            >
                                {`${decodeURIComponent(Job.Title)}`}
                            </Text>
                        ) : null}
                        {Job ? (
                            <View
                                style={{
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                <View>
                                    <AvatarImage
                                        size={80}
                                        uri={Job.AuthorAvatar}
                                    ></AvatarImage>
                                </View>
                                <View
                                    style={{
                                        padding: 10,
                                        fontSize: 18,
                                        height: 66,
                                        flex: 1,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 25,
                                        }}
                                    >
                                        {decodeURIComponent(Job.Author)}
                                    </Text>
                                </View>
                            </View>
                        ) : null}
                        {Job ? (
                            <Text
                                style={{
                                    fontSize: 26,
                                    fontWeight: "bold",
                                    paddingLeft: "5%",
                                }}
                            >
                                {`${decodeURIComponent(Job.Details)}`}
                            </Text>
                        ) : null}
                        {Job ? (
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <View
                                    style={{
                                        flex: 1,
                                        height: 1,
                                        backgroundColor: "black",
                                    }}
                                />
                                <View>
                                    <Text
                                        style={{
                                            width: 50,
                                            textAlign: "center",
                                            color: "brown",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Note
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        flex: 1,
                                        height: 1,
                                        backgroundColor: "black",
                                    }}
                                />
                            </View>
                        ) : null}
                        <Text style={{ fontSize: 16 }}>
                            {`${
                                Note.Note
                                    ? decodeURIComponent(Note.Note)
                                    : decodeURIComponent(Note)
                            }`}
                        </Text>

                        <Pressable
                            style={styles.delButton}
                            onPress={() => {
                                confirmPopUp();
                            }}
                        >
                            <Text style={styles.buttonText}>🗑️</Text>
                        </Pressable>
                    </ScrollView>
                </FadeIn>
            </SafeAreaView>

            <Modalize ref={modalizeDeleteRef} modalHeight={200}>
                <SafeAreaView>
                    <View
                        style={{
                            alignItems: "center",
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                alignItems: "center",
                                paddingTop: 20,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 25,
                                    fontWeight: "bold",
                                    textAlign: "center",
                                }}
                            >
                                Are you sure?{" "}
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                flex: 1,
                                alignItems: "center",
                                paddingTop: 40,
                            }}
                        >
                            <Pressable
                                onPress={() => {
                                    //Delete
                                    deleteNote();
                                }}
                                style={styles.delButton}
                            >
                                <Text style={styles.buttonText}>
                                    ✅{"\n"}I'm Sure
                                </Text>
                            </Pressable>
                            <Pressable
                                onPress={() => {
                                    //Cancel
                                    modalizeDeleteRef.current.close();
                                }}
                                style={styles.cancelButton}
                            >
                                <Text style={styles.cancelText}>
                                    ❌{"\n"}No! I'm going Back
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </SafeAreaView>
            </Modalize>
        </View>
    );
}

//#NOTE: sample route.params object
// Object {
// "Job": Object {
//   "Author": "Cheungwaiyin",
//   "AuthorID": "61d2c4e2cddf3454f88c77d2",
//   "Details": "Abc",
//   "Title": "Abc",
//   "_id": "61d2ccb34fecc0b50fc085ff",
// },
// "Note": Object {
//   "Author": Object {
// "UserToken": "nrkjkkcv2dmksl45cw9uw",
// "_id": "61d2b58fcddf3454f88c77d1",
// "email": "pw860563576@gmail.com",
// "password": "!Zz860563576",
// "username": "pw860563576",
//   },
//   "Job_id": "61d2ccb34fecc0b50fc085ff",
//   "Note": "7",
//   "_id": "61d43d961028f772796f609c",
// },
//   }

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        margin: 5,
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: "#406E9F",
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "bold",
        textAlign: "center",
    },
    cancelText: {
        color: "#000",
        fontSize: 15,
        fontWeight: "bold",
        textAlign: "center",
    },

    delButton: {
        margin: 20,
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: "red",
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    forwardsButton: {
        margin: 5,
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: "green",
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    emailButton: {
        margin: 5,
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: "purple",
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonView: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginTop: 20,
    },
});
