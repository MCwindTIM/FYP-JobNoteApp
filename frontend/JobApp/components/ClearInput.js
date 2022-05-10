import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { theme } from "../Core/Theme";

export default function ClearInput({ ...props }) {
    return (
        <TouchableOpacity style={styles.closeButtonParent} {...props}>
            <Image
                style={styles.closeButton}
                source={require("../src/assets/close.png")}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    closeButton: {
        height: 16,
        width: 16,
    },

    closeButtonParent: {
        justifyContent: "center",
        alignItems: "center",
        marginRight: "2%",
    },
});
