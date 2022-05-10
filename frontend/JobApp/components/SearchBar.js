import React, { useState } from "react";
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Platform,
} from "react-native";
import { TextInput as Input } from "react-native-paper";
import { theme } from "../Core/Theme";

export default function SearchBar({ description, ...props }) {
    const [searchText, setSearchText] = useState("");

    return (
        <Input
            style={styles.textInput}
            selectionColor={theme.colors.primary}
            underlineColor="transparent"
            mode="outlined"
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
            {...props}
        />
    );
}

const styles = StyleSheet.create({
    textInput: {
        height: 40,
        width: Platform !== "ios" ? "90%" : "100%",
        marginLeft: "1%",
        marginRight: "1%",
        backgroundColor: "#fff",
    },
});
