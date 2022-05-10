import React, { useEffect, useState, useRef } from "react";
import {
    TouchableWithoutFeedback,
    TouchableNativeFeedback,
    SafeAreaView,
    FlatList,
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    RefreshControl,
    TouchableOpacity,
    Keyboard,
    Platform,
} from "react-native";

import SearchBar from "../../components/SearchBar";
import ClearInput from "../../components/ClearInput";

import { AuthContext } from "../../components/context";

import AvatarImage from "../../components/Avatar";

const styles = StyleSheet.create({
    parent: {
        marginLeft: 0,
        marginRight: 0,
        borderRadius: 0,
        borderWidth: 0,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    container: {
        flex: 1,
        paddingTop: 0,
        backgroundColor: "#fff",
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 66,
        flex: 1,
    },
    title: {
        fontSize: 20,
    },
    author: {
        fontSize: 15,
    },
    merge: {
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 5,
    },
});
const JobFlatList = ({ navigation }) => {
    const [isLoading, setLoading] = React.useState(true);
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState("");
    const mountedRef = useRef(true);
    const { getAPIServiceURL } = React.useContext(AuthContext);
    const APIServiceURL = getAPIServiceURL();

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            fetch(`${APIServiceURL}/getAllJobData`)
                .then((response) => response.json())
                .then((json) => {
                    if (!mountedRef.current) return null;
                    setData(json);
                })
                .catch((error) => console.error(error))
                .finally(() => {
                    if (!mountedRef.current) return null;
                    setLoading(false);
                });
        });
        return () => {
            mountedRef.current = false;
        };
    }, [navigation]);

    //function to open JobDetails Screen (item is a parameter contain prop)
    const openScreen = (route) => {
        navigation.navigate("JobDetails", route);
    };

    return (
        <View style={styles.container}>
            <View style={styles.parent}>
                <SearchBar
                    clearButtonMode="always"
                    label="Search"
                    returnKeyType="next"
                    value={searchText}
                    onChangeText={(text) => setSearchText(text)}
                />
                {Platform.OS !== "ios" ? (
                    <ClearInput
                        onPress={() => {
                            setSearchText("");
                            Keyboard.dismiss();
                        }}
                    />
                ) : null}
            </View>
            <FlatList
                data={data.data}
                keyExtractor={({ _id }, index) => _id}
                renderItem={({ item }) => {
                    //render the list
                    if (searchText === "") {
                        //time parse
                        let calcJobTime = parseInt(
                            (Date.now() - item.Timestamp) / 1000
                        );
                        let day = parseInt(calcJobTime / 86400);

                        let h = parseInt((calcJobTime % 86400) / 3600, 10);
                        let m = parseInt(
                            ((calcJobTime % 86400) % 3600) / 60,
                            10
                        );
                        let s = parseInt(
                            ((calcJobTime % 86400) % 3600) % 60,
                            10
                        );

                        let timeString = day
                            ? day === 1
                                ? `${day} day ago`
                                : `${day} days ago`
                            : h
                            ? h === 1
                                ? `${h} hour ago`
                                : `${h} hours ago`
                            : m
                            ? m === 1
                                ? `${m} minute ago`
                                : `${m} minutes ago`
                            : s
                            ? s === 1
                                ? `${s} second ago`
                                : `${s} seconds ago`
                            : `just now`;
                        return (
                            <TouchableNativeFeedback
                                onPress={() => openScreen(item)}
                            >
                                <View style={styles.merge}>
                                    <View>
                                        <AvatarImage
                                            size={40}
                                            uri={item.AuthorAvatar}
                                        ></AvatarImage>
                                    </View>
                                    <View style={styles.item}>
                                        <Text style={styles.title}>
                                            {decodeURIComponent(item.Title)}
                                        </Text>
                                        <Text style={styles.author}>
                                            {decodeURIComponent(item.Author)}
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: "column",
                                            alignItems: "flex-start",
                                            paddingRight: 5,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                color: "#aaa",
                                            }}
                                        >
                                            {timeString}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                        );
                    }
                    if (
                        item.Title.toUpperCase().includes(
                            encodeURIComponent(searchText.toUpperCase())
                        ) ||
                        item.Author.toUpperCase().includes(
                            encodeURIComponent(searchText.toUpperCase())
                        )
                    ) {
                        //time parse
                        let calcJobTime = parseInt(
                            (Date.now() - item.Timestamp) / 1000
                        );
                        let day = parseInt(calcJobTime / 86400);

                        let h = parseInt((calcJobTime % 86400) / 3600, 10);
                        let m = parseInt(
                            ((calcJobTime % 86400) % 3600) / 60,
                            10
                        );
                        let s = parseInt(
                            ((calcJobTime % 86400) % 3600) % 60,
                            10
                        );

                        let timeString = day
                            ? day === 1
                                ? `${day} day ago`
                                : `${day} days ago`
                            : h
                            ? h === 1
                                ? `${h} hour ago`
                                : `${h} hours ago`
                            : m
                            ? m === 1
                                ? `${m} minute ago`
                                : `${m} minutes ago`
                            : s
                            ? s === 1
                                ? `${s} second ago`
                                : `${s} seconds ago`
                            : `just now`;
                        return (
                            <TouchableNativeFeedback
                                onPress={() => openScreen(item)}
                            >
                                <View style={styles.merge}>
                                    <View>
                                        <AvatarImage
                                            size={40}
                                            uri={item.AuthorAvatar}
                                        ></AvatarImage>
                                    </View>
                                    <View style={styles.item}>
                                        <Text style={styles.title}>
                                            {decodeURIComponent(item.Title)}
                                        </Text>
                                        <Text style={styles.author}>
                                            {decodeURIComponent(item.Author)}
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: "column",
                                            alignItems: "flex-start",
                                            paddingRight: 5,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                color: "#aaa",
                                            }}
                                        >
                                            {timeString}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                        );
                    }
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                        onRefresh={() => {
                            setLoading(true);
                            fetch(`${APIServiceURL}/getAllJobData`)
                                .then((response) => response.json())
                                .then((json) => {
                                    if (!mountedRef.current) return null;
                                    setData(json);
                                })
                                .catch((error) => console.error(error))
                                .finally(() => {
                                    if (!mountedRef.current) return null;
                                    setLoading(false);
                                });
                        }}
                    />
                }
            />
        </View>
    );
};

export default JobFlatList;
