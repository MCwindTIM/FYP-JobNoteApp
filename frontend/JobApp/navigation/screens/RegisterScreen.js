import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
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
import { nameValidator } from "../util/nameValidator";
import { AuthContext } from "../../components/context";

export default function RegisterScreen({ navigation }) {
    const [name, setName] = useState({ value: "", error: "" });
    const [email, setEmail] = useState({ value: "", error: "" });
    const [password, setPassword] = useState({ value: "", error: "" });

    const { signUp, getAPIServiceURL } = React.useContext(AuthContext);
    const APIServiceURL = getAPIServiceURL();
    const onSignUpPressed = () => {
        const nameError = nameValidator(name.value);
        const emailError = emailValidator(email.value);
        const passwordError = passwordValidator(password.value);
        if (emailError || passwordError || nameError) {
            setName({ ...name, error: nameError });
            setEmail({ ...email, error: emailError });
            setPassword({ ...password, error: passwordError });
            return;
        }
        fetch(`${APIServiceURL}/register`, {
            headers: {
                username: encodeURIComponent(name.value),
                email: email.value,
                password: encodeURIComponent(password.value),
            },
        }).then((response) => {
            if (response.status === 200) {
                response.json().then(async (json) => {
                    if (json.success) {
                        const UserData = await getUserData(json.UserToken);
                        signUp(json.UserToken, UserData);
                    } else {
                        setEmail({ ...password, error: json.message });
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
            <Header>Create Account</Header>
            <TextInput
                label="Name"
                returnKeyType="next"
                value={name.value}
                onChangeText={(text) => setName({ value: text, error: "" })}
                error={!!name.error}
                errorText={name.error}
            />
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
            <Button
                mode="contained"
                onPress={onSignUpPressed}
                style={{ marginTop: 24 }}
            >
                Sign Up
            </Button>
            <View style={styles.row}>
                <Text>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.replace("Login")}>
                    <Text style={styles.link}>Login</Text>
                </TouchableOpacity>
            </View>
        </Background>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        marginTop: 4,
    },
    link: {
        fontWeight: "bold",
        color: theme.colors.primary,
    },
});
