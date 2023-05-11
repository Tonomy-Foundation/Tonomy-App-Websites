import { ES256KSigner, createJWK, toDid, LoginWithTonomyMessages, VerifiableCredential, resolve, api, objToBase64Url, generateRandomKeyPair, LoginRequest, randomString, LoginRequestPayload, toElliptic, bnToBase64Url } from "@tonomy/tonomy-id-sdk";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import elliptic from 'elliptic';
import { base64ToBytes } from '@tonomy/did-jwt';
import * as u8a from 'uint8arrays'

export function bytesToHex(b: Uint8Array): string {
    return u8a.toString(b, 'base16')
}

const secp256k1 = new elliptic.ec('secp256k1');


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

    function printDifferences(str1: string, str2: string): number {
        let changeCount = 0;
        let testLength = 0;

        if (str1.length > str2.length) {
            testLength = str1.length;
        }
        else testLength = str2.length;

        let printStr = "";

        for (let i = 0; i < testLength; i++) {
            if (str1[i] !== str2[i]) {
                changeCount++;
                printStr += str1[i];
            } else {
                printStr += "_"
            }
        }

        console.log("str1:               ", str1, str1.length);
        console.log("str2:               ", str2 + " ", str2.length);
        console.log("character different:", printStr);
        return changeCount;
    }

    async function main4() {
        try {
            for (let i = 0; i < 100; i++) {
                console.log('i', i)
                const { privateKey, publicKey } = generateRandomKeyPair();

                const ecKey = toElliptic(publicKey);
                const pubKey = ecKey.getPublic();

                const xBigNum = pubKey.getX();
                const xBase64Url = bnToBase64Url(xBigNum);
                const yBigNum = pubKey.getY();
                const yBase64Url = bnToBase64Url(yBigNum);

                const signer = ES256KSigner(privateKey.data.array, true);
                const jwk = await createJWK(publicKey);
                const issuer = {
                    did: toDid(jwk),
                    signer: signer as any,
                    alg: 'ES256K-R',
                };

                const loginRequest = await VerifiableCredential.sign("id", ["VerifiableCredential"], { foo: "bar" }, issuer);

                // Check if did is the same
                const didFromVc = loginRequest.getIssuer();

                if (didFromVc !== issuer.did) throw new Error('didFromVc !== issuer.did')

                // Check if the JWK is the same
                const didDocument = (await resolve(didFromVc)).didDocument;
                const jwkFromVc = didDocument.verificationMethod[0].publicKeyJwk;

                if (JSON.stringify(jwk) !== JSON.stringify(jwkFromVc)) throw new Error('jwk !== jwkFromVc')

                // Check if the public key is the same. This is called in extractPublicKeyBytes() in VerifierAlgorithm.ts in did-jwt
                const ecKeyFromVc = secp256k1.keyFromPublic({
                    x: bytesToHex(base64ToBytes(jwkFromVc.x)),
                    y: bytesToHex(base64ToBytes(jwkFromVc.y)),
                })

                if (ecKey.getPublic('hex') !== ecKeyFromVc.getPublic('hex')) {
                    console.error('ecKey !== ecKeyFromVc')
                    // this is sometimes failing!
                }

                const pubKeyFromVc = ecKeyFromVc.getPublic();

                if (pubKey.getX().toString('hex').length !== 64 || pubKeyFromVc.getX().toString('hex').length !== 64) console.error(pubKey.getX().toString('hex').length, pubKeyFromVc.getX().toString('hex').length, "X length !== 64");
                if (pubKey.getY().toString('hex').length !== 64 || pubKeyFromVc.getY().toString('hex').length !== 64) console.error(pubKey.getY().toString('hex').length, pubKeyFromVc.getY().toString('hex').length, "Y length !== 64");
                if (pubKey.getX().toString('hex') !== pubKeyFromVc.getX().toString('hex')) printDifferences(pubKey.getX().toString('hex'), pubKeyFromVc.getX().toString('hex'));
                if (pubKey.getY().toString('hex') !== pubKeyFromVc.getY().toString('hex')) printDifferences(pubKey.getY().toString('hex'), pubKeyFromVc.getY().toString('hex'));
                // sometimes it is X, and sometimes it is Y
                // the difference is always 1 character, the last hex character
                // createJWK X/Y hex value has 63 chars, while from the VC it has 62 chars
                // Neither value is correct.
                // X and Y have 64 characters when not failing!

                const xBase64FromVc = jwkFromVc.x;
                const yBase64FromVc = jwkFromVc.y;

                if (xBase64FromVc !== xBase64Url) throw new Error('xBase64FromVc !== xBase64Url');
                if (yBase64FromVc !== yBase64Url) throw new Error('yBase64FromVc !== yBase64Url');

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

    async function main5() {
        try {
            for (let i = 0; i < 100; i++) {
                console.log('i', i)
                const { privateKey, publicKey } = generateRandomKeyPair();

                const ecKey = toElliptic(publicKey);
                const pubKey = ecKey.getPublic();

                if (pubKey.getX().toString('hex').length !== 64) throw new Error('pubKey.getX().toString(\'hex\').length !== 64')
                if (pubKey.getY().toString('hex').length !== 64) throw new Error('pubKey.getY().toString(\'hex\').length !== 64')
            }
        } catch (e) {
            console.error('error', e)
        }
    }


    useEffect(() => {
        if (!rendered) {
            rendered = true;
        } else {
            return;
        }

        main5();
    });

    return <h1> tonomy website</h1>;
}
