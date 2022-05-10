import React, { useEffect, useState, useLayoutEffect } from "react";
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
} from "react-native";
import { AuthContext } from "../../components/context";
import Ionicons from "react-native-vector-icons/Ionicons";

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
const FollowingFlatList = ({ navigation }) => {
    const { getUserData, getAPIServiceURL, getUserToken } =
        React.useContext(AuthContext);
    const [isLoading, setLoading] = React.useState(true);
    const [data, setData] = useState([]);
    const UserData = getUserData();
    const APIServiceURL = getAPIServiceURL();

    useLayoutEffect(() => {
        navigation.setOptions({
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

    useEffect(() => {
        const refresh = navigation.addListener("focus", () => {
            fetch(`${APIServiceURL}/getAllFollowingJobData`, {
                headers: {
                    user_id: UserData._id,
                },
            })
                .then((response) => response.json())
                .then((json) => setData(json))
                .catch((error) => console.error(error))
                .finally(() => setLoading(false));
        });
    }, [navigation]);

    //function to open JobDetails Screen (item is a parameter contain prop)
    const openScreen = (item) => {
        navigation.navigate("JobDetailsFromFollowing", item);
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={data.data}
                keyExtractor={({ _id }, index) => _id}
                renderItem={({ item }) => {
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
                            </View>
                        </TouchableNativeFeedback>
                    );
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                        onRefresh={() => {
                            setLoading(true);
                            fetch(`${APIServiceURL}/getAllFollowingJobData`, {
                                headers: {
                                    user_id: UserData._id,
                                },
                            })
                                .then((response) => response.json())
                                .then((json) => setData(json))
                                .catch((error) => console.error(error))
                                .finally(() => setLoading(false));
                        }}
                    />
                }
            />
        </View>
    );
};

export default FollowingFlatList;
