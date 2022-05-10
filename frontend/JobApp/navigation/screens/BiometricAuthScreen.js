import * as LocalAuthentication from "expo-local-authentication";
import * as React from "react";
import { View, Text, Button } from "react-native";

var EResult;
(function (EResult) {
    EResult["CANCELLED"] = "CANCELLED";
    EResult["DISABLED"] = "DISABLED";
    EResult["ERROR"] = "ERROR";
    EResult["SUCCESS"] = "SUCCESS";
})(EResult || (EResult = {}));

export default function BiometricAuthScreen({ navigation }) {
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

    return (
        <View>
            {facialRecognitionAvailable ||
            fingerprintAvailable ||
            irisAvailable ? (
                <Button
                    onPress={authenticate}
                    title="Biometric Authentication"
                ></Button>
            ) : (
                <Text>No biometric authentication methods available</Text>
            )}
            {resultMessage ? <Text>{resultMessage}</Text> : null}
        </View>
    );
}
