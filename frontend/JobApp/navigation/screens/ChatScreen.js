import * as React from "react";
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import ChatListItem from "../../components/ChatListItem.js";
import AvatarImage from "../../components/Avatar.js";
import { useFocusEffect } from "@react-navigation/native";

import { AuthContext } from "../../components/context";
//TODO: Ascending order
import io from "socket.io-client";

export default function ChatScreen({ navigation, route }) {
    const { getUserData, getAPIServiceURL } = React.useContext(AuthContext);
    const [chats, setChats] = React.useState([]);

    const [hasConnection, setConnection] = React.useState(false);
    const [lastUpdateTime, setLastUpdateTime] = React.useState(null);
    const ioEndPoint = `${getAPIServiceURL()}/`;
    const socket = io(ioEndPoint, {
        transports: ["websocket"],
        auth: {
            _id: getUserData()._id,
        },
    });
    useFocusEffect(
        React.useCallback(() => {
            navigation.setOptions({
                headerTitle: "Chats",
                headerTitleAlign: "left",
                headerLeft: () => (
                    <View style={{ marginLeft: 20 }}>
                        <TouchableOpacity activeOpacity={0.5}>
                            <AvatarImage
                                size={40}
                                uri={window.CustomVar_avatar}
                            ></AvatarImage>
                        </TouchableOpacity>
                    </View>
                ),
            });
            socket.connect();
            socket.io.on("open", () => setConnection(true));
            socket.io.on("close", () => setConnection(false));
            socket.on("time-msg", (data) => {
                // debug
                // console.log(new Date(data.time).toString());
                // setLastUpdateTime(data.time);
            });
            socket.emit("getChatRoomData");
            socket.on("chatRoomData", async (data) => {
                if (data.success) {
                    setChats(data.data);
                    if (window.CustomVar_forwardChatRoomID !== null) {
                        let temp = window.CustomVar_forwardChatRoomID;
                        window.CustomVar_forwardChatRoomID = null;
                        enterChat(data.data.find((cr) => cr._id == temp));
                    }
                }
            });
            return () => {
                //on unFocus
                socket.disconnect();
                socket.removeAllListeners();
            };
        }, [navigation])
    );

    const enterChat = (chatRoomData, foward) => {
        navigation.navigate("Conversation", {
            chatRoomData: chatRoomData,
        });
    };

    React.useEffect(() => {
        const KeepAlive = setInterval(() => {
            socket.emit("getChatRoomData");
        }, 1000);
    }, [navigation]);

    return (
        <SafeAreaView style={{ backgroundColor: "#fff" }}>
            <ScrollView style={styles.container}>
                {chats.map((item) => (
                    <ChatListItem
                        id={item._id}
                        chatRoomData={item}
                        key={item._id}
                        enterChat={enterChat}
                    ></ChatListItem>
                ))}
                {/* <ChatListItem /> */}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
    },
});
