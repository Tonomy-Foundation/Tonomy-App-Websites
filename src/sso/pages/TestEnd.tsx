import { PublicKey } from "@greymass/eosio";
import { JsKeyManager, createJWK, toDid, KeyManagerLevel, STORAGE_NAMESPACE, UserApps, api, LoginRequest } from "@tonomy/tonomy-id-sdk";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function TestEnd() {
    console.log('TestEnd')
    const navigation = useNavigate();

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
                // console.log('Bug caught', e);

                const keyPair = await localStorage.getItem(STORAGE_NAMESPACE + "key." + KeyManagerLevel.BROWSER_LOCAL_STORAGE)
                const { publicKey, privateKey } = JSON.parse(keyPair as string);

                console.log('keyPair', publicKey, privateKey)

                const jwk = await createJWK(PublicKey.from(publicKey));
                const parsedIssuer = toDid(jwk);

                const issuer = loginRequest.getIssuer()

                console.log('issuer', issuer === parsedIssuer)
            }
        }
    }

    useEffect(() => {
        main();
    });

    return <h1> tonomy website</h1>;
}
