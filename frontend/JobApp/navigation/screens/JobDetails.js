import * as React from "react";
import {
    View,
    Text,
    StyleSheet,
    Button,
    Alert,
    Linking,
    SafeAreaView,
    ScrollView,
    Pressable,
    ToastAndroid,
    KeyboardAvoidingView,
    TouchableOpacity,
} from "react-native";

import TextInput from "../../components/TextInput";
import { useEffect, useState, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

// import Dialog from "react-native-dialog";
import { Modalize } from "react-native-modalize";
import { Picker } from "@react-native-picker/picker";

import AvatarImage from "../../components/Avatar";
import FadeIn from "../../components/FadeIn";

import { AuthContext } from "../../components/context";

export default function JobDetails(item) {
    const navigation = useNavigation();
    const { getUserToken, getUserData, getAPIServiceURL, setJob } =
        React.useContext(AuthContext);
    const UserToken = getUserToken();
    const UserData = getUserData();
    const APIServiceURL = getAPIServiceURL();
    const [showDelButton, setShowDelButton] = useState(false);
    const [followingCurrentJob, setFollowingCurrentJob] = useState(false);
    const reportOptions = [
        "Inappropriate content",
        "Scamming",
        "Duplicate post",
        "Illegal content",
    ];
    const [reportReason, setReportReason] = useState(reportOptions[0]);

    let fetching = false;
    var job = item.route.params;

    const modalizeReportRef = useRef(null);
    const modalizeDeleteRef = useRef(null);
    const pickerRef = useRef();

    const openPicker = () => {
        pickerRef.current.focus();
    };

    const closePicker = () => {
        pickerRef.current.blur();
    };
    //Job object sample
    // Object {
    // "Author": "Cheungwaiyin",
    // "AuthorID": "61d2c4e2cddf3454f88c77d2",
    // "Details": "Wwe",
    // "Timestamp": 1650757154516,
    // "Title": "Abbb",
    // "_id": "61d2cf1b4fecc0b50fc08600",
    // "AuthorAvatar": if this user has an avatar, it will be the base64 Image
    //   }

    const FollowingJob = () => {
        if (fetching) {
            return;
        }
        fetching = true;
        if (followingCurrentJob) {
            fetch(`${APIServiceURL}/unfollowJob`, {
                headers: {
                    user_id: UserData._id,
                    job_id: job._id,
                },
            })
                .then((response) => {
                    if (response.status === 200) {
                        response.json().then((json) => {
                            if (json.success) {
                                setFollowingCurrentJob(false);
                                ToastAndroid.show(
                                    "Unfollowed!",
                                    ToastAndroid.SHORT
                                );
                            } else {
                                console.log("failed!");
                            }
                        });
                    }
                })
                .finally(() => {
                    fetching = false;
                });
        } else {
            fetching = true;
            fetch(`${APIServiceURL}/followJob`, {
                headers: {
                    user_id: UserData._id,
                    job_id: job._id,
                },
            })
                .then((response) => {
                    if (response.status === 200) {
                        response.json().then((json) => {
                            if (json.success) {
                                setFollowingCurrentJob(true);
                                ToastAndroid.show(
                                    "Followed!",
                                    ToastAndroid.SHORT
                                );
                            } else {
                                console.log("failed!");
                            }
                        });
                    }
                })
                .finally(() => {
                    fetching = false;
                });
        }
    };

    const checkFollowing = async () => {
        fetching = true;
        fetch(`${APIServiceURL}/checkFollowing`, {
            headers: {
                user_id: UserData._id,
                job_id: job._id,
            },
        })
            .then((response) => {
                if (response.status === 200) {
                    response.json().then((json) => {
                        if (json.success) {
                            setFollowingCurrentJob(true);
                        } else {
                            setFollowingCurrentJob(false);
                        }
                    });
                } else {
                    setFollowingCurrentJob(false);
                }
            })
            .finally(() => {
                fetching = false;
            });
    };

    useEffect(() => {
        async function fetchData() {
            const User = await JobAuthor(UserToken);
            if (User === job.Author) {
                setShowDelButton(true);
            }
            checkFollowing();
        }
        fetchData();
        navigation.setOptions({
            title: decodeURIComponent(decodeURIComponent(job.Title)),
            // headerLeft: null,
            headerRight: () => <FollowingIconButton navigation={navigation} />,
        });
    });

    const getJobAuthorEmailByAuthorID = async (author_id) => {
        return new Promise((resolve, reject) => {
            fetch(`${APIServiceURL}/getJobAuthorEmail`, {
                headers: {
                    author_id: author_id,
                },
            }).then((response) => {
                if (response.status === 200) {
                    response.json().then((json) => {
                        if (json.success) {
                            resolve(json.email);
                        } else {
                            reject(json.success);
                        }
                    });
                } else {
                    reject(false);
                }
            });
        });
    };

    const FollowingIconButton = ({ navigation }) => {
        if (followingCurrentJob) {
            return (
                <Ionicons
                    name="star"
                    size={35}
                    onPress={() => {
                        FollowingJob();
                    }}
                />
            );
        } else {
            return (
                <Ionicons
                    name="star-outline"
                    size={35}
                    onPress={() => {
                        FollowingJob();
                    }}
                />
            );
        }
    };

    const report = () => {
        if (modalizeReportRef.current) {
            modalizeReportRef.current.open();
        }
    };

    const submitReport = () => {
        fetching = true;
        //fetch api to submit report (data: job_id, user_id, reason)
        fetch(`${APIServiceURL}/jobReport`, {
            headers: {
                job_id: job._id,
                user_id: UserData._id,
                report_reason: reportReason,
            },
        })
            .then((response) => {
                if (response.status === 200) {
                    response.json().then((json) => {
                        if (json.success) {
                            ToastAndroid.show(
                                "Report submitted!",
                                ToastAndroid.SHORT
                            );
                        } else {
                            ToastAndroid.show(
                                `Report failed! ${json.message}`,
                                ToastAndroid.SHORT
                            );
                        }
                    });
                }
            })
            .finally(() => {
                fetching = false;
                modalizeReportRef.current.close();
            });
    };

    const confirmPopUp = () => {
        if (modalizeDeleteRef.current) {
            modalizeDeleteRef.current.open();
        }
        // Alert.alert("Deleting Job", "Are you sure?", [
        //     {
        //         text: "Cancel",
        //     },
        //     {
        //         text: "I'm sure",
        //         onPress: () => {
        //             deleteJob();
        //         },
        //     },
        // ]);
    };
    const deleteJob = () => {
        fetch(`${APIServiceURL}/deleteJob`, {
            headers: {
                jobid: job._id,
            },
        }).then((response) => {
            if (response.status === 200) {
                response.json().then((json) => {
                    if (json.success) {
                        ToastAndroid.show(
                            "Delete Success!",
                            ToastAndroid.SHORT
                        );
                        navigation.navigate("JobList");
                    } else {
                        ToastAndroid.show("Delete Failed!", ToastAndroid.SHORT);
                    }
                });
            } else {
                ToastAndroid.show("Delete Failed!", ToastAndroid.SHORT);
            }
        });
    };
    const JobAuthor = async (UserToken) => {
        return new Promise((resolve, reject) => {
            fetch(`${APIServiceURL}/getUser`, {
                headers: {
                    usertoken: UserToken,
                },
            }).then((response) => {
                if (response.status === 200) {
                    response.json().then((json) => {
                        if (json.success) {
                            resolve(json.data.username);
                        } else {
                            reject(json.success);
                        }
                    });
                } else {
                    reject(false);
                }
            });
        });
    };

    const createNewChatRoom = (targetId) => {
        //check chat room with 2 users is exist or not
        fetch(`${APIServiceURL}/checkChatRoom`, {
            headers: {
                user_id: UserData._id,
                target_id: targetId,
            },
        }).then((response) => {
            if (response.status === 200) {
                response.json().then((json) => {
                    if (json.success) {
                        enterChat(json.data._id);
                    } else {
                        //create new chat room
                        fetch(`${APIServiceURL}/createNewChatRoom`, {
                            headers: {
                                user_id: UserData._id,
                                target_id: targetId,
                            },
                        }).then((response) => {
                            if (response.status === 200) {
                                response.json().then((json) => {
                                    if (json.success) {
                                        enterChat(json.data.insertedId);
                                    } else {
                                        if (json.data?._id) {
                                            enterChat(json.data._id);
                                        } else {
                                            ToastAndroid.show(
                                                "Error!",
                                                ToastAndroid.SHORT
                                            );
                                        }
                                    }
                                });
                            } else {
                                ToastAndroid.show(
                                    "Create Chat Failed!",
                                    ToastAndroid.SHORT
                                );
                            }
                        });
                    }
                });
            } else {
                ToastAndroid.show("Check Chat Failed!", ToastAndroid.SHORT);
            }
        });
    };

    const enterChat = (chatRoomID) => {
        window.CustomVar_forwardChatRoomID = chatRoomID;
        navigation.navigate("Chat");
    };

    return (
        <View style={{ backgroundColor: "#FFFFFF", height: "100%" }}>
            <SafeAreaView>
                <FadeIn>
                    <ScrollView style={{ backgroundColor: "transparent" }}>
                        <Text
                            style={{
                                fontSize: 30,
                                fontWeight: "bold",
                                textAlign: "center",
                            }}
                        >
                            {`${decodeURIComponent(job.Title)}`}
                        </Text>
                        <View
                            style={{
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <View>
                                <AvatarImage
                                    size={80}
                                    uri={job.AuthorAvatar}
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
                                    {decodeURIComponent(job.Author)}
                                </Text>
                            </View>
                        </View>
                        <Text
                            style={{
                                fontSize: 26,
                                fontWeight: "bold",
                                paddingLeft: "5%",
                            }}
                        >
                            {`${decodeURIComponent(job.Details)}`}
                        </Text>

                        <View style={styles.buttonView}>
                            {showDelButton ? (
                                <Pressable
                                    style={styles.delButton}
                                    onPress={() => {
                                        confirmPopUp();
                                    }}
                                >
                                    <Text style={styles.buttonText}>
                                        🗑️{"\n"}Delete This Post
                                    </Text>
                                </Pressable>
                            ) : (
                                <>
                                    <Pressable
                                        onPress={async () => {
                                            createNewChatRoom(job.AuthorID);
                                        }}
                                        style={styles.chatButton}
                                    >
                                        <Text style={styles.buttonText}>
                                            💬{"\n"}Message Me!
                                        </Text>
                                    </Pressable>
                                    <Pressable
                                        onPress={async () =>
                                            Linking.openURL(
                                                `mailto:${await getJobAuthorEmailByAuthorID(
                                                    job.AuthorID
                                                )}`
                                            )
                                        }
                                        style={styles.emailButton}
                                    >
                                        <Text style={styles.buttonText}>
                                            📮{"\n"}Mail Me!
                                        </Text>
                                    </Pressable>
                                </>
                            )}
                            <Pressable
                                onPress={() => {
                                    setJob(true, job);
                                    navigation.navigate("NotesList");
                                }}
                                style={styles.forwardsButton}
                            >
                                <Text style={styles.buttonText}>
                                    📒{"\n"}Take Some Notes
                                </Text>
                            </Pressable>
                        </View>
                        {showDelButton ? null : (
                            <View>
                                <Pressable
                                    onPress={() => {
                                        report();
                                    }}
                                    style={styles.reportButton}
                                >
                                    <Text style={styles.buttonText}>
                                        🚨{"\n"}Report This Post
                                    </Text>
                                </Pressable>
                            </View>
                        )}
                    </ScrollView>
                </FadeIn>
            </SafeAreaView>

            <Modalize ref={modalizeReportRef} modalHeight={200}>
                <SafeAreaView>
                    <View
                        style={{
                            alignItems: "center",
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                flex: 1,
                                alignItems: "center",
                                paddingTop: 10,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: "bold",
                                    textAlign: "center",
                                }}
                            >
                                The reason you{" "}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: "bold",
                                    textAlign: "center",
                                    color: "red",
                                }}
                            >
                                report{" "}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: "bold",
                                    textAlign: "center",
                                }}
                            >
                                this post?
                            </Text>
                        </View>
                        <Picker
                            style={{
                                height: 50,
                                width: "80%",
                                borderRadius: 10,
                                paddingTop: "3%",
                                paddingBottom: "3%",
                            }}
                            selectedValue={reportReason}
                            onValueChange={(itemValue, itemIndex) =>
                                setReportReason(itemValue)
                            }
                            mode={"dialog"}
                            ref={pickerRef}
                        >
                            {reportOptions.map((item) => (
                                <Picker.Item
                                    label={item}
                                    value={item}
                                    key={item}
                                />
                            ))}
                        </Picker>
                        <View
                            style={{
                                flexDirection: "row",
                                flex: 1,
                                paddingTop: 10,
                                alignItems: "center",
                            }}
                        >
                            <Pressable
                                onPress={() => {
                                    //report
                                    submitReport();
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
                                    modalizeReportRef.current.close();
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
                                    deleteJob();
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

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        margin: 5,
        padding: 10,
        paddingLeft: 5,
        paddingRight: 5,
        backgroundColor: "#406E9F",
        borderRadius: 8,
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
        margin: 5,
        padding: 5,
        paddingLeft: 8,
        paddingRight: 8,
        backgroundColor: "red",
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    reportButton: {
        margin: 5,
        padding: 5,
        paddingLeft: 8,
        paddingRight: 8,
        backgroundColor: "red",
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    forwardsButton: {
        margin: 5,
        padding: 5,
        paddingLeft: 8,
        paddingRight: 8,
        backgroundColor: "green",
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    cancelButton: {
        margin: 5,
        padding: 5,
        paddingLeft: 8,
        paddingRight: 8,
        backgroundColor: "#e6e6e6",
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    emailButton: {
        margin: 5,
        padding: 5,
        paddingLeft: 8,
        paddingRight: 8,
        backgroundColor: "purple",
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    chatButton: {
        margin: 5,
        padding: 5,
        paddingLeft: 8,
        paddingRight: 8,
        backgroundColor: "#2B68E6",
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
