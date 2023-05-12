import { PublicKey } from "@greymass/eosio";
import { createJWK, toDid, KeyManagerLevel, STORAGE_NAMESPACE, UserApps, api, LoginRequest } from "@tonomy/tonomy-id-sdk";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function TestEnd() {
    console.log('TestEnd')
    const navigation = useNavigate();
    let rendered = false;

    async function main() {
        const { requests } = UserApps.getLoginRequestFromUrl();
        const referrer = { origin: "http://10.31.12.154:3000" }
        const loginRequest = requests.find((r) => r.getPayload().origin === referrer.origin) as LoginRequest;

        try {
            const verifiedLoginRequest = await loginRequest.verify();

            if (verifiedLoginRequest) {
                navigation("/test-start");
            }
        } catch (e: any) {
            if (e?.message?.startsWith("invalid_signature: no matching public key found")) {
                console.log('Bug caught in end', e);

                const keyPair = await localStorage.getItem(STORAGE_NAMESPACE + "key." + KeyManagerLevel.BROWSER_LOCAL_STORAGE)
                const { publicKey, privateKey } = JSON.parse(keyPair as string);

                // @ts-expect-error some issue here
                const jwk = createJWK(PublicKey.from(publicKey));
                const issuerFromStorage = toDid(jwk);

                const issuerFromUrl = loginRequest.getIssuer()

                console.log('issuer are the same', issuerFromUrl === issuerFromStorage)
                // true

                const loginRequestFromStorage = await localStorage.getItem('loginRequest')
                const loginRequestFromUrl = JSON.stringify(loginRequest)

                console.log('loginRequest are the same', loginRequestFromUrl === loginRequestFromStorage)
                // true
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
