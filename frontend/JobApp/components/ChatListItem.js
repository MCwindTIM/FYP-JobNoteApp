import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import AvatarImage from "./Avatar.js";

import AntDesign from "react-native-vector-icons/AntDesign";

//id = _id = ChatRoomID
export default function ChatListItem({ id, chatRoomData, enterChat }) {
    let calcMessageTime = parseInt(
        (Date.now() - chatRoomData.lastMessageTime) / 1000
    );
    let day = parseInt(calcMessageTime / 86400);

    let h = parseInt((calcMessageTime % 86400) / 3600, 10);
    let m = parseInt(((calcMessageTime % 86400) % 3600) / 60, 10);
    let s = parseInt(((calcMessageTime % 86400) % 3600) % 60, 10);

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
        <ListItem
            key={id}
            bottomDivider
            onPress={() => {
                enterChat(chatRoomData);
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                }}
            >
                <AvatarImage size={40} uri={chatRoomData.targetUser.avatar} />
                <ListItem.Content style={{ paddingLeft: 10 }}>
                    <ListItem.Title style={{ fontWeight: "800" }}>
                        {chatRoomData.targetUser.username}
                    </ListItem.Title>
                    <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
                        {decodeURIComponent(chatRoomData.lastMessageContent)}
                    </ListItem.Subtitle>
                </ListItem.Content>
                <View
                    style={{
                        flexDirection: "column",
                        alignItems: "flex-end",
                    }}
                >
                    <Text
                        style={{
                            fontSize: 12,
                            color: "#aaa",
                        }}
                    >
                        {chatRoomData.lastMessageTime === 0 ? "" : timeString}
                    </Text>
                    <AntDesign
                        style={{
                            paddingTop: 10,
                        }}
                        name="checkcircle"
                        size={15}
                    />
                </View>
            </View>
        </ListItem>
    );
}

const styles = StyleSheet.create({});
