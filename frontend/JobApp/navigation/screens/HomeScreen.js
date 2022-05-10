import React, { useEffect, useState, useLayoutEffect } from "react";
import FlatList from "../util/FlatList";
import Ionicons from "react-native-vector-icons/Ionicons";
import FadeIn from "../../components/FadeIn";

export default function HomeScreen({ navigation }) {
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => <PostJobIconButton navigation={navigation} />,
            headerLeft: () => {
                return (
                    <Ionicons
                        name="ios-menu"
                        size={30}
                        onPress={() => {
                            navigation.openDrawer();
                        }}
                    />
                );
            },
        });
    });
    return <FlatList navigation={navigation} />;
}

const PostJobIconButton = ({ navigation }) => {
    return (
        <Ionicons
            name="add"
            size={35}
            onPress={() => {
                navigation.navigate("PostJob");
            }}
        />
    );
};
