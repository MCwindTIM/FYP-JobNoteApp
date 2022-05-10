import React, { useEffect, useState, useLayoutEffect } from "react";
import { View, StyleSheet, Platform, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import AntIcon from "react-native-vector-icons/AntDesign";
import * as FileSystem from "expo-file-system";
import { StorageAccessFramework } from "expo-file-system";
import { AuthContext } from "../../components/context";
import * as Linking from "expo-linking";

const PdfReader = ({ url: uri }) => (
    <WebView
        javaScriptEnabled={true}
        style={{ flex: 1 }}
        source={{ uri }}
        startInLoadingState={true}
    />
);

export default function ResumeScreen({ navigation, route }) {
    const { getAPIServiceURL } = React.useContext(AuthContext);
    const APIServiceURL = getAPIServiceURL();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    style={{ marginRight: 10 }}
                    onPress={async () => {
                        // const downloadResumable =
                        //     FileSystem.createDownloadResumable(
                        //         `${APIServiceURL}/getResume?target=${route.params.resume}_resume.pdf`,
                        //         `${FileSystem.documentDirectory}${route.params.resume}_resume.pdf`
                        //     );
                        // try {
                        //     const download =
                        //         await downloadResumable.downloadAsync();
                        //     console.log(download);
                        // } catch (e) {
                        //     console.error(e);
                        // }
                        Linking.openURL(
                            `${APIServiceURL}/getResume/${route.params.resume}_resume.pdf`
                        );
                    }}
                >
                    <AntIcon name="download" size={25} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    if (Platform.OS === "android") {
        //use google docs viewer
        return (
            <View style={styles.container}>
                <PdfReader
                    url={`http://docs.google.com/gview?embedded=true&url=${APIServiceURL}/getResume/${route.params.resume}_resume.pdf`}
                />
            </View>
        );
    } else {
        //use ios viewer
        return (
            <View style={styles.container}>
                <PdfReader
                    url={`${APIServiceURL}/getResume/${route.params.resume}_resume.pdf`}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
});
