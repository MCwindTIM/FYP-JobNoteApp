import * as React from "react";
// import BottomTabNavigator from "./navigation/TabNavigator";
import { DrawerNavigator } from "./navigation/DrawerNavigator";
import { NavigationContainer } from "@react-navigation/native";
import RootStackNavigator from "./navigation/RootStackNavigator";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "./components/context";

export default function App() {
    const [isLoading, setIsLoading] = React.useState(true);
    const [userToken, setUserToken] = React.useState();
    const [LatestuserToken, setLatestuserToken] = React.useState();
    const [userData, setUserData] = React.useState({});
    const [jobRedirect, setJobRedirect] = React.useState({
        Forward: false,
        Job: {},
    });
    //cloudflare provide SSL/TLS & CDN on domain "mcwindfileserver.tk"
    //APIServiceURL on production should be "https://mcwindfileserver.tk"
    //no rate limit on development
    //Development API URL => "http://223.16.12.55"

    const [APIServiceURL, setAPIServiceURL] = React.useState(
        "http://223.16.12.55"
    );

    const authContext = React.useMemo(() => ({
        setJob: (Forward, Job) => {
            setJobRedirect({ Forward: Forward, Job: Job });
        },
        getJobRedirect: () => {
            return jobRedirect;
        },
        getAPIServiceURL: () => {
            return APIServiceURL;
        },
        getMSGAPI_KEY: () => {
            return MSGAPI_KEY;
        },
        signIn: (UserToken, UserData) => {
            setUserToken(UserToken);
            setUserData(UserData);
            window.CustomVar_avatar = UserData.avatar ? UserData.avatar : null;
            setUserTokenAsyncStorage(UserToken);
            setIsLoading(false);
        },
        signOut: (clear) => {
            if (clear === false || !clear) {
                setUserToken(null);
                setUserData({});
                setIsLoading(true);
                setTimeout(() => {
                    setIsLoading(false);
                }, 500);
            }
            if (clear === true) {
                AsyncStorage.removeItem("@JobApp:LatestUserToken", () => {
                    setLatestuserToken(null);
                    setUserToken(null);
                    setUserData({});
                    setIsLoading(true);
                    setTimeout(() => {
                        setIsLoading(false);
                    }, 500);
                });
            }
        },
        signUp: (UserToken, UserData) => {
            setUserToken(UserToken);
            setUserData(UserData);
            window.CustomVar_avatar = UserData.avatar ? UserData.avatar : null;
            setUserTokenAsyncStorage(UserToken);
            setIsLoading(false);
        },
        getUserToken: () => {
            return userToken;
        },
        getUserData: () => {
            return userData;
        },
        setLUT: (LUT) => {
            setLatestuserToken(LUT);
        },
        getLUT: () => {
            return LatestuserToken;
        },
        updateAvatar: (base64) => {
            //update userdata's avatar field and
            setUserData({ ...userData, avatar: base64 });
            window.CustomVar_avatar = base64;
        },
    }));

    const setUserTokenAsyncStorage = async (value) => {
        await AsyncStorage.setItem("@JobApp:LatestUserToken", value);
        setLatestuserToken(value);
    };

    useEffect(() => {
        //set global chatroomID once on startup
        window.CustomVar_forwardChatRoomID = null;
    });

    useEffect(() => {
        //check asyncstorage for userToken
        AsyncStorage.getItem("@JobApp:LatestUserToken").then((value) => {
            if (value !== null) {
                setLatestuserToken(value);
            } else {
                setLatestuserToken(null);
            }
        });
        let createLoadingInt = setTimeout(() => {
            setIsLoading(false);
        }, 1500);

        return () => {
            clearTimeout(createLoadingInt);
        };
    }, [userData]);

    if (isLoading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }
    return (
        <AuthContext.Provider value={authContext}>
            <NavigationContainer>
                {userToken === undefined || userToken === null ? (
                    <RootStackNavigator />
                ) : (
                    <DrawerNavigator />
                )}
            </NavigationContainer>
        </AuthContext.Provider>
    );
}

