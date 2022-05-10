import * as React from "react";
import {
    View,
    Text,
    Button,
    StyleSheet,
    Pressable,
    ImageEditor,
    ToastAndroid,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { useEffect, useState, useLayoutEffect } from "react";
import * as ImageManipulator from "expo-image-manipulator";

import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarImage from "../../components/Avatar";

import { AuthContext } from "../../components/context";

export default function SettingsScreen({ navigation }) {
    const { signOut, getUserData, setLUT, getAPIServiceURL, updateAvatar } =
        React.useContext(AuthContext);
    const [image, setImage] = useState(null);
    const APIServiceURL = getAPIServiceURL();
    const signOutWithClearCache = () => {
        signOut(true);
    };

    const selectAvatar = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (result.cancelled === true) return;

        let base64output = await ImageManipulator.manipulateAsync(
            result.uri,
            [{ resize: { width: 500, height: 500 } }],
            { format: "jpeg", base64: true }
        );
        //upload base64 to server
        fetch(`${APIServiceURL}/updateAvatar`, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                _id: getUserData()._id,
            },
            method: "POST",
            body: JSON.stringify({ avatar: base64output.base64 }),
        }).then((response) => {
            if (response.status === 200) {
                response.json().then((json) => {
                    if (json.success) {
                        ToastAndroid.show(
                            "Avatar updated!",
                            ToastAndroid.SHORT
                        );
                        updateAvatar(base64output.base64);
                        setImage(base64output.base64);
                    } else {
                        ToastAndroid.show(
                            "Failed to update avatar! Please Try Again Later!",
                            ToastAndroid.SHORT
                        );
                    }
                });
            } else {
            }
        });
    };

    const selectResume = async () => {
        await DocumentPicker.getDocumentAsync({
            type: "application/pdf",
            copyToCacheDirectory: false,
        }).then(async (response) => {
            if (response.type != "success")
                return alert("File selection failed!");
            let { uri, name, size } = response;
            if (Platform.OS === "android" && uri[0] === "/") {
                uri = `file://${uri}`;
                uri = uri.replace(/%/g, "%25");
            }
            var file2Upload = {
                name: `${getUserData()._id}_resume.pdf`,
                size: size,
                uri: uri,
                type: "application/pdf",
            };
            //upload file to server
            postDocument(file2Upload);
        });
    };

    const postDocument = (file2Upload) => {
        const formData = new FormData();
        formData.append("pdf", file2Upload);
        fetch(`${APIServiceURL}/updateResume`, {
            method: "POST",
            body: formData,
        }).then((response) => {
            if (response.status === 200) {
                response.json().then((json) => {
                    if (json.success) {
                        ToastAndroid.show(
                            "Resume updated!",
                            ToastAndroid.SHORT
                        );
                    } else {
                        ToastAndroid.show(
                            "Failed to update resume! Please Try Again Later!",
                            ToastAndroid.SHORT
                        );
                    }
                });
            }
        });
    };

    useEffect(() => {
        setImage(getUserData().avatar);
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <MaterialCommunityIcons
                    name="logout"
                    size={30}
                    onPress={() => {
                        signOut();
                    }}
                />
            ),
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
    }, []);

    return (
        <View
            style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white",
            }}
        >
            {/* <Text
                onPress={() => console.log(getUserData())}
                style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    textAlign: "center",
                }}
            >
                [DEBUG] PRESS ME
            </Text> */}
            {/* <Pressable
                onPress={() => {
                    signOut();
                }}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Sign Out</Text>
            </Pressable> */}
            {/* <Pressable
                onPress={() => {
                    signOutWithClearCache();
                }}
                style={styles.button}
            >
                <Text style={styles.buttonText}>
                    Sign Out With Deleting All The User Data
                </Text>
            </Pressable> */}

            <AvatarImage uri={image}></AvatarImage>
            <Pressable
                onPress={() => {
                    selectAvatar();
                }}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Select Avatar to upload</Text>
            </Pressable>
            <Pressable
                onPress={() => {
                    selectResume();
                }}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Select PDF to upload</Text>
            </Pressable>
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
        margin: 20,
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: "#406E9F",
        borderRadius: 9,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
    },
});
