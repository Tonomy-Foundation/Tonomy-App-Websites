import { ES256KSigner, createJWK, toDid, LoginWithTonomyMessages, VerifiableCredential, api, objToBase64Url, generateRandomKeyPair, LoginRequest, randomString, LoginRequestPayload } from "@tonomy/tonomy-id-sdk";
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
            } else {
                console.error('error', e)
            }
        }
    }

    async function main2() {
        try {
            for (let i = 0; i < 100; i++) {
                console.log('i', i)
                const { loginRequest } = (await api.ExternalUser.loginWithTonomy({ redirect: false, callbackPath: "/test-end" })) as LoginWithTonomyMessages

                await loginRequest.verify();
            }
        } catch (e) {
            if (e?.message?.startsWith("invalid_signature: no matching public key found")) {
                console.log('Bug caught in start', e);
            } else {
                console.error('error', e)
            }
        }
    }

    async function main3() {
        try {
            for (let i = 0; i < 100; i++) {
                console.log('i', i)
                const { privateKey, publicKey } = generateRandomKeyPair();

                const payload: LoginRequestPayload = {
                    randomString: randomString(32),
                    origin: window.location.origin,
                    publicKey: publicKey,
                    callbackPath: "/test-end",
                };

                const signer = ES256KSigner(privateKey.data.array, true);
                const jwk = await createJWK(publicKey);

                const issuer = {
                    did: toDid(jwk),
                    signer: signer as any,
                    alg: 'ES256K-R',
                };
                const loginRequest = await LoginRequest.signRequest(payload, issuer);

                await loginRequest.verify();
            }
        } catch (e) {
            if (e?.message?.startsWith("invalid_signature: no matching public key found")) {
                console.log('Bug caught in start', e);
            } else {
                console.error('error', e)
            }
        }
    }

    async function main4() {
        try {
            for (let i = 0; i < 100; i++) {
                console.log('i', i)
                const { privateKey, publicKey } = generateRandomKeyPair();

                const signer = ES256KSigner(privateKey.data.array, true);
                const jwk = await createJWK(publicKey);

                const issuer = {
                    did: toDid(jwk),
                    signer: signer as any,
                    alg: 'ES256K-R',
                };
                const loginRequest = await VerifiableCredential.sign("id", ["VerifiableCredential"], { foo: "bar" }, issuer);

                await loginRequest.verify();
            }
        } catch (e) {
            if (e?.message?.startsWith("invalid_signature: no matching public key found")) {
                console.log('Bug caught in start', e);
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

        main4();
    });

    return <h1> tonomy website</h1>;
}
