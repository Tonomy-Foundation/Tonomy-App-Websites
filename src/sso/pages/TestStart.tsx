import { LoginWithTonomyMessages, api, objToBase64Url } from "@tonomy/tonomy-id-sdk";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function TestStart() {
    console.log('TestStart')

    let rendered = false;
    const navigation = useNavigate();

    async function main() {
        try {
            const { loginRequest } = (await api.ExternalUser.loginWithTonomy({ redirect: false, callbackPath: "/test-end" })) as LoginWithTonomyMessages

            await localStorage.setItem('loginRequest', JSON.stringify(loginRequest))
            const base64UrlPayload = objToBase64Url({ requests: [loginRequest] })

            const verifiedLoginRequest = await loginRequest.verify();

            if (verifiedLoginRequest) {
                navigation("/test-end?payload=" + base64UrlPayload);
            } else {
                console.error('loginRequest not verified')
            }
        } catch (e) {
            if (e?.message?.startsWith("invalid_signature: no matching public key found")) {
                console.log('Bug caught in start', e);
                return;
            } else {
                console.error('error', e)
            }
        }
    }

    useEffect(() => {
        if (!rendered) {
            rendered = true;
        } else {
            return;
        }

        main();
    });

    return <h1> tonomy website</h1>;
}
