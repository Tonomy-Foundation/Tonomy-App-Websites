import { LoginWithTonomyMessages, api, objToBase64Url } from "@tonomy/tonomy-id-sdk";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function TestStart() {
    console.log('TestStart')

    const navigation = useNavigate();

    async function main() {
        const { loginRequest } = (await api.ExternalUser.loginWithTonomy({ redirect: false, callbackPath: "/test-end" })) as LoginWithTonomyMessages

        const base64UrlPayload = objToBase64Url({ requests: [loginRequest] })

        navigation("/test-end?payload=" + base64UrlPayload);
    }

    useEffect(() => {
        main();
    });

    return <h1> tonomy website</h1>;
}
