import * as React from "react";
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Platform,
    KeyboardAvoidingView,
    TextInput,
    Keyboard,
    TouchableWithoutFeedback,
    WebView,
} from "react-native";
import AvatarImage from "../../components/Avatar.js";
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AuthContext } from "../../components/context";
//TODO: ascending order
import io from "socket.io-client";
import Autolink from "react-native-autolink";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { LinkPreview } from "@flyerhq/react-native-link-preview";

export default function ConversationScreen({ navigation, route }) {
    const { getAPIServiceURL, getUserData } = React.useContext(AuthContext);
    const chatRoomData = route.params.chatRoomData;
    const [messages, setMessages] = React.useState([]);
    const [hasConnection, setConnection] = React.useState(false);
    const [lastUpdateTime, setLastUpdateTime] = React.useState("");
    const ioEndPoint = `${getAPIServiceURL()}/`;
    const [pressed, setPressed] = React.useState(false);
    const [input, setInput] = React.useState("");

    const scrollViewRef = React.useRef();
    const socket = io(ioEndPoint, {
        transports: ["websocket"],
        auth: {
            _id: getUserData()._id,
            chatRoomID: chatRoomData?._id,
        },
    });
    const goBackChatPage = () => {
        if (pressed) {
            return;
        }
        setPressed(true);
        navigation.navigate("Chat ");
    };
    React.useLayoutEffect(() => {
        fetch(`${getAPIServiceURL()}/checkResume`, {
            headers: {
                target_id: chatRoomData.targetUser._id,
            },
        }).then((response) => {
            if (response.status === 200) {
                response.json().then((json) => {
                    if (json.success) {
                        navigation.setOptions({
                            headerRight: () => (
                                <TouchableOpacity
                                    style={{ marginRight: 10 }}
                                    onPress={() => {
                                        navigation.navigate("Resume", {
                                            resume: chatRoomData.targetUser._id,
                                        });
                                    }}
                                >
                                    <FontAwesome5 name="file-pdf" size={30} />
                                </TouchableOpacity>
                            ),
                        });
                    }
                });
            }
        });
        navigation.setOptions({
            headerTitle: chatRoomData.targetUser.username,
            headerBackTitleVisible: false,
            headerTitleAlign: "left",
            headerLeft: () => (
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingLeft: 5,
                    }}
                >
                    <Ionicons
                        name="arrow-back"
                        size={30}
                        onPress={() => {
                            goBackChatPage();
                        }}
                    />
                    <View style={{}}>
                        <AvatarImage
                            size={40}
                            uri={chatRoomData.targetUser.avatar}
                        ></AvatarImage>
                    </View>
                </View>
            ),
        });
        //fetch server to check target user had uploaded their resume
    }, [navigation]);

    React.useLayoutEffect(() => {
        //connect to io server
        socket.on("newMessage", (data) => {
            setMessages((messages) => [
                ...messages,
                {
                    id: data.data._id,
                    content: decodeURIComponent(data.data.content),
                    Author: data.data.Author,
                    createdAt: data.data.createAt,
                },
            ]);
        });
        socket.io.on("open", () => setConnection(true));
        socket.io.on("close", () => setConnection(false));
        socket.on("time-msg", (data) => {
            // debug
            // setLastUpdateTime(data.time);
        });
        socket.emit("getAllChatData", chatRoomData._id);
        socket.on("allChatData", (data) => {
            if (data.success) {
                setMessages(
                    data.data
                        .map((message) => ({
                            id: message._id,
                            content: decodeURIComponent(message.content),
                            Author: message.Author,
                            createdAt: message.createAt,
                        }))
                        .sort((a, b) => a.createdAt - b.createdAt)
                );
            }
        });

        return () => {
            //on unmount
            socket.disconnect();
            socket.removeAllListeners();
        };
    }, [route]);

    const sendMessage = () => {
        if (!input.trim()) return;
        Keyboard.dismiss();
        setInput("");

        socket.emit("sendMessage", {
            message: encodeURIComponent(input.trim()),
            chatRoomID: chatRoomData._id,
        });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
            {Platform.OS === "ios" ? <StatusBar style="light" /> : null}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
                keyboardVerticalOffset={135}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <>
                        <ScrollView
                            ref={scrollViewRef}
                            style={{ backgroundColor: "white" }}
                            contentContainerStyle={{ paddingTop: 15 }}
                            onContentSizeChange={() =>
                                scrollViewRef.current.scrollToEnd({
                                    animated: true,
                                })
                            }
                        >
                            {messages.map((message) =>
                                message.Author === getUserData()._id ? (
                                    <View
                                        key={message.id}
                                        style={styles.receiver}
                                    >
                                        <AvatarImage
                                            position="absolute"
                                            bottom={-15}
                                            right={-5}
                                            size={30}
                                            uri={window.CustomVar_avatar}
                                        />
                                        <Autolink
                                            style={styles.receiverText}
                                            text={decodeURIComponent(
                                                message.content
                                            )}
                                            component={View}
                                            renderLink={(text, match) => (
                                                <LinkPreview
                                                    header={"**External Link**"}
                                                    metadataTextContainerStyle={{
                                                        color: "blue",
                                                    }}
                                                    containerStyle={
                                                        styles.previewContainer
                                                    }
                                                    enableAnimation={true}
                                                    text={match.getAnchorHref()}
                                                />
                                            )}
                                        />
                                    </View>
                                ) : (
                                    <View
                                        key={message.id}
                                        style={styles.sender}
                                    >
                                        <AvatarImage
                                            position="absolute"
                                            bottom={-15}
                                            left={-5}
                                            size={30}
                                            uri={chatRoomData.targetUser.avatar}
                                        />
                                        <Autolink
                                            style={styles.senderText}
                                            text={decodeURIComponent(
                                                message.content
                                            )}
                                            component={View}
                                            renderLink={(text, match) => (
                                                <LinkPreview
                                                    header={"**External Link**"}
                                                    metadataTextContainerStyle={{
                                                        color: "blue",
                                                    }}
                                                    containerStyle={
                                                        styles.previewContainer
                                                    }
                                                    enableAnimation={true}
                                                    text={match.getAnchorHref()}
                                                />
                                            )}
                                        />
                                    </View>
                                )
                            )}
                        </ScrollView>
                        <View style={styles.footer}>
                            <TextInput
                                value={input}
                                onChangeText={(text) => setInput(text)}
                                placeholder="Type Message"
                                style={styles.textInput}
                                onSubmitEditing={sendMessage}
                            />
                            <TouchableOpacity
                                onPress={sendMessage}
                                activeOpacity={0.5}
                            >
                                <Ionicons
                                    name="send"
                                    size={24}
                                    color="#2B68E6"
                                />
                            </TouchableOpacity>
                        </View>
                    </>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    receiver: {
        padding: 15,
        backgroundColor: "#ECECEC",
        alignSelf: "flex-end",
        borderRadius: 20,
        marginRight: 15,
        marginBottom: 20,
        maxWidth: "80%",
        position: "relative",
    },
    sender: {
        padding: 15,
        backgroundColor: "#ECECEC",
        alignSelf: "flex-start",
        borderRadius: 20,
        marginLeft: 15,
        marginBottom: 20,
        maxWidth: "80%",
        position: "relative",
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        padding: 15,
    },
    textInput: {
        bottom: 0,
        height: 40,
        flex: 1,
        marginRight: 15,
        borderColor: "transparent",
        backgroundColor: "#ECECEC",
        borderWidth: 1,
        padding: 10,
        color: "grey",
        borderRadius: 30,
    },
    contentContainer: {
        paddingHorizontal: 24,
    },
    previewContainer: {
        backgroundColor: "#f7f7f8",
        borderRadius: 20,
        marginTop: 16,
        overflow: "hidden",
    },
});
