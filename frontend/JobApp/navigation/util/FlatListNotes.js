import React, { useEffect, useState } from "react";
import {
    TouchableNativeFeedback,
    SafeAreaView,
    FlatList,
    StyleSheet,
    Text,
    View,
    RefreshControl,
} from "react-native";

import { AuthContext } from "../../components/context";

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
});
const NotesFlatList = ({ navigation }) => {
    const [isLoading, setLoading] = React.useState(true);
    const [data, setData] = useState([]);
    const { getAPIServiceURL, getUserToken } = React.useContext(AuthContext);
    const APIServiceURL = getAPIServiceURL();

    const UserToken = getUserToken();

    useEffect(() => {
        const refreshListener = navigation.addListener("focus", (payload) => {
            fetch(`${APIServiceURL}/getAppNote`, {
                headers: { usertoken: UserToken },
            })
                .then((response) => response.json())
                .then((json) => {
                    setData(json);
                })
                .catch((error) => console.error(error))
                .finally(() => {
                    setLoading(false);
                });
        });
        return refreshListener;
    }, [navigation]);

    //function to open JobDetails Screen (item is a parameter contain prop)
    const openScreen = (route) => {
        navigation.navigate("Note Details", route);
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
                            <View style={styles.item}>
                                <Text style={styles.title}>
                                    {decodeURIComponent(item.Note).replace(
                                        /(\r\n|\n|\r)/gm,
                                        ""
                                    )}
                                </Text>
                                <Text style={styles.author}>
                                    {item.Job
                                        ? `💼${decodeURIComponent(
                                              item.Job.Title
                                          )} 🕒${
                                              new Date(item.createAt)
                                                  .toISOString()
                                                  .split("T")[0]
                                          } ${new Date(item.createAt)
                                              .toISOString()
                                              .split("T")[1]
                                              .substring(0, 8)}`
                                        : `🕒${
                                              new Date(item.createAt)
                                                  .toISOString()
                                                  .split("T")[0]
                                          } ${new Date(item.createAt)
                                              .toISOString()
                                              .split("T")[1]
                                              .substring(0, 8)}`}
                                </Text>
                            </View>
                        </TouchableNativeFeedback>
                    );
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                        onRefresh={() => {
                            setLoading(true);
                            fetch(`${APIServiceURL}/getAppNote`, {
                                headers: { usertoken: UserToken },
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

export default NotesFlatList;
