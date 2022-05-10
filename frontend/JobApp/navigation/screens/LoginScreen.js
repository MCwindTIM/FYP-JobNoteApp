import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, View, Platform } from "react-native";
import { Text } from "react-native-paper";
import Background from "../../components/Background";
import Logo from "../../components/Logo";
import Header from "../../components/Header";
import Button from "../../components/Button";
import TextInput from "../../components/TextInput";
import BackButton from "../../components/BackButton";
import { theme } from "../../Core/Theme";
import { emailValidator } from "../util/emailValidator";
import { passwordValidator } from "../util/passwordValidator";

//import Biometric Authentication
import * as LocalAuthentication from "expo-local-authentication";

import { AuthContext } from "../../components/context";

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState({ value: "", error: "" });
    const [password, setPassword] = useState({ value: "", error: "" });

    const { signIn, getAPIServiceURL, getLUT } = React.useContext(AuthContext);
    const APIServiceURL = getAPIServiceURL();

    //check android api level
    const OsVer = Platform.Version;

    let [LatestUserToken, setLatestUserToken] = useState(getLUT());
    // console.log(OsVer);
    //API level 28+ (Uses Android native BiometricPrompt)
    //<uses-permission android:name="android.permission.USE_BIOMETRIC" />
    //API level 23-28 (Uses Android native FingerprintCompat)
    //<uses-permission android:name="android.permission.USE_FINGERPRINT" />

    //BiometricAuthentication
    var EResult;
    (function (EResult) {
        EResult["CANCELLED"] = "CANCELLED";
        EResult["DISABLED"] = "DISABLED";
        EResult["ERROR"] = "ERROR";
        EResult["SUCCESS"] = "SUCCESS";
    })(EResult || (EResult = {}));

    const [facialRecognitionAvailable, setFacialRecognitionAvailable] =
        React.useState(false);
    const [fingerprintAvailable, setFingerprintAvailable] =
        React.useState(false);
    const [irisAvailable, setIrisAvailable] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [result, setResult] = React.useState();
    const checkSupportedAuthentication = async () => {
        const types =
            await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (types && types.length) {
            setFacialRecognitionAvailable(
                types.includes(
                    LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
                )
            );
            setFingerprintAvailable(
                types.includes(
                    LocalAuthentication.AuthenticationType.FINGERPRINT
                )
            );
            setIrisAvailable(
                types.includes(LocalAuthentication.AuthenticationType.IRIS)
            );
        }
    };

    const authenticate = async () => {
        if (loading) {
            return;
        }

        setLoading(true);

        try {
            const results = await LocalAuthentication.authenticateAsync();

            if (results.success) {
                setResult(EResult.SUCCESS);
                const UserData = await getUserData(LatestUserToken);
                return signIn(LatestUserToken, UserData);
            } else if (results.error === "unknown") {
                setResult(EResult.DISABLED);
            } else if (
                results.error === "user_cancel" ||
                results.error === "system_cancel" ||
                results.error === "app_cancel"
            ) {
                setResult(EResult.CANCELLED);
            }
        } catch (error) {
            setResult(EResult.ERROR);
        }
        setLoading(false);
    };

    React.useEffect(() => {
        checkSupportedAuthentication();
        console.log(LatestUserToken);
    }, []);

    let resultMessage;
    switch (result) {
        case EResult.CANCELLED:
            resultMessage = "Authentication process has been cancelled";
            break;
        case EResult.DISABLED:
            resultMessage = "Biometric authentication has been disabled";
            break;
        case EResult.ERROR:
            resultMessage = "There was an error in authentication";
            break;
        case EResult.SUCCESS:
            resultMessage = "Successfully authenticated";
            break;
        default:
            resultMessage = "";
            break;
    }

    // let description;
    // if (facialRecognitionAvailable && fingerprintAvailable && irisAvailable) {
    //     description = "Authenticate with Face ID, touch ID or iris ID";
    // } else if (facialRecognitionAvailable && fingerprintAvailable) {
    //     description = "Authenticate with Face ID or touch ID";
    // } else if (facialRecognitionAvailable && irisAvailable) {
    //     description = "Authenticate with Face ID or iris ID";
    // } else if (fingerprintAvailable && irisAvailable) {
    //     description = "Authenticate with touch ID or iris ID";
    // } else if (facialRecognitionAvailable) {
    //     description = "Authenticate with Face ID";
    // } else if (fingerprintAvailable) {
    //     description = "Authenticate with touch ID ";
    // } else if (irisAvailable) {
    //     description = "Authenticate with iris ID";
    // } else {
    //     description = "No biometric authentication methods available";
    // }

    const onLoginPressed = () => {
        const emailError = emailValidator(email.value);
        const passwordError = passwordValidator(password.value);
        if (emailError || passwordError) {
            setEmail({ ...email, error: emailError });
            setPassword({ ...password, error: passwordError });
            return;
        }
        //fetch user token
        fetch(`${APIServiceURL}/login`, {
            headers: {
                email: email.value,
                password: encodeURIComponent(password.value),
            },
        }).then((response) => {
            if (response.status === 200) {
                response.json().then(async (json) => {
                    if (json.success) {
                        const UserData = await getUserData(json.UserToken);
                        signIn(json.UserToken, UserData);
                    } else {
                        setPassword({ ...password, error: json.message });
                    }
                });
            } else {
                setPassword({
                    ...password,
                    error: "Server currently not available",
                });
            }
        });
    };

    const getUserData = async (UserToken) => {
        return new Promise((resolve, reject) => {
            fetch(`${APIServiceURL}/getUser`, {
                headers: {
                    usertoken: UserToken,
                },
            }).then((response) => {
                if (response.status === 200) {
                    response.json().then((json) => {
                        if (json.success) {
                            resolve(json.data);
                        } else {
                            reject(json.success);
                        }
                    });
                } else {
                    reject(false);
                }
            });
        });
    };

    return (
        <Background>
            {/* <BackButton goBack={navigation.goBack} /> */}
            <Logo />
            <Header>Welcome!</Header>
            <TextInput
                label="Email"
                returnKeyType="next"
                value={email.value}
                onChangeText={(text) => setEmail({ value: text, error: "" })}
                error={!!email.error}
                errorText={email.error}
                autoCapitalize="none"
                autoCompleteType="email"
                textContentType="emailAddress"
                keyboardType="email-address"
            />
            <TextInput
                label="Password"
                returnKeyType="done"
                value={password.value}
                onChangeText={(text) => setPassword({ value: text, error: "" })}
                error={!!password.error}
                errorText={password.error}
                secureTextEntry
            />
            {/* <View style={styles.forgotPassword}>
                <TouchableOpacity
                    onPress={() => navigation.navigate("ResetPasswordScreen")}
                >
                    <Text style={styles.forgot}>Forgot your password?</Text>
                </TouchableOpacity>
            </View> */}
            <Button mode="contained" onPress={onLoginPressed}>
                Login
            </Button>
            {/* start Biometric Authentication */}
            <View>
                {(facialRecognitionAvailable && LatestUserToken !== null) ||
                (fingerprintAvailable && LatestUserToken !== null) ||
                (irisAvailable && LatestUserToken !== null) ? (
                    <Button mode="contained" onPress={authenticate}>
                        Biometric Authentication
                    </Button>
                ) : null}
                {/* {resultMessage ? <Text>{resultMessage}</Text> : null}//debug usage */}
            </View>
            {/* end Biometric Authentication */}
            <View style={styles.row}>
                <Text>Don’t have an account? </Text>
                <TouchableOpacity
                    onPress={() => navigation.replace("Register")}
                >
                    <Text style={styles.link}>Sign up</Text>
                </TouchableOpacity>
            </View>
        </Background>
    );
}

const styles = StyleSheet.create({
    forgotPassword: {
        width: "100%",
        alignItems: "flex-end",
        marginBottom: 24,
    },
    row: {
        flexDirection: "row",
        marginTop: 4,
    },
    forgot: {
        fontSize: 13,
        color: theme.colors.secondary,
    },
    link: {
        fontWeight: "bold",
        color: theme.colors.primary,
    },
});
