import * as React from "react";
import { Avatar } from "react-native-paper";
import { Image } from "react-native";

export default function AvatarImage({ uri, size, ...props }) {
    return (
        <Image
            style={{
                height: size ? size : 100,
                width: size ? size : 100,
                borderRadius: 100 / 2,
            }}
            source={
                uri
                    ? { uri: `data:image/png;base64,${uri}` }
                    : require("../assets/avatar.png")
            }
            {...props}
        />
    );
}
