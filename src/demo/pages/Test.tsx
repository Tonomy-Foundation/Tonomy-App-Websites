import { Bytes, KeyType, PrivateKey, PublicKey } from "@greymass/eosio";
import {
    ES256KSigner,
    LoginRequest,
    createJWK,
    getResolver,
    toDid,
    LoginRequestPayload,
    generateRandomKeyPair,
    randomString,
    bnToBase64Url,
    randomBytes,
} from "@tonomy/tonomy-id-sdk";
import React, { useEffect } from "react";
import { Resolver } from '@tonomy/did-resolver';
import elliptic from 'elliptic'
import { base64ToBytes, bytesToHex } from "./did-jwt.util";
import { bigintToBytes, bytesToBase64 } from './did-jwt.new.util';
import * as u8a from 'uint8arrays';

const secp256k1 = new elliptic.ec('secp256k1')

function hexToBase64(hexstring: string) {
    return window.btoa(
        (hexstring as any)
            .match(/\w{2}/g)
            .map(function (a: string) {
                return String.fromCharCode(parseInt(a, 16));
            })
            .join('')
    );
}

export default function Test() {
    console.log("Test");

    async function main1() {

        /*
        1. create random PublicKey
        2. create JWK from PublicKey
        3. create DID from JWK
        4. resolve JWK from DID
        5. get PublicKey from JWK
        6. !##!*%^ compare PublicKey with original PublicKey ERROR
        */

        try {
            for (let i = 0; i < 100; i++) {
                const { privateKey, publicKey } = generateRandomKeyPair();

                console.log("i", i, privateKey.toString(), publicKey.toString());

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
                    alg: "ES256K-R",
                };
                const loginRequest = await LoginRequest.signRequest(payload, issuer);

                await loginRequest.verify();
            }
        } catch (e) {
            if (
                e?.message?.startsWith(
                    "invalid_signature: no matching public key found"
                )
            ) {
                console.log("Bug caught in start", e);
            } else {
                console.error("error", e);
            }
        }
    }

    async function main2() {
        try {
            // A key that was found to cause the issue
            const privateKey = PrivateKey.from("PVT_K1_2VFa49dhuRgtWAAuzV8DmbNgGXytG1Nwy8o8vTonv9vatx3B5m");
            const publicKey = privateKey.toPublic();

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
                alg: "ES256K-R",
            };
            const loginRequest = await LoginRequest.signRequest(payload, issuer);

            await loginRequest.verify();
        } catch (e) {
            if (
                e?.message?.startsWith(
                    "invalid_signature: no matching public key found"
                )
            ) {
                console.log("Bug caught in start", e);
            } else {
                console.error("error", e);
            }
        }
    }

    async function main3() {
        try {
            for (let i = 0; i < 100; i++) {
                const { privateKey, publicKey } = generateRandomKeyPair();

                console.log("i", i, privateKey.toString(), publicKey.toString());

                // A key that was found to cause the issue
                // const privateKey = PrivateKey.from("PVT_K1_2VFa49dhuRgtWAAuzV8DmbNgGXytG1Nwy8o8vTonv9vatx3B5m");
                // const publicKey = privateKey.toPublic();

                const jwk = await createJWK(publicKey);

                console.log("jwk", jwk);
                const did = toDid(jwk)

                if ("GkDZnHQASmEQfwy1I/juCYdrPsG0CEf5uMktfm1kig==" !== "GkDZnHQASmEQfwy1I/juCYdrPsG0CEf5uMktfm1kig==") throw new Error("X mismatch")
                if ("M2mipTuM0nvaheDepZcTvlYj6A5UFSGtYv5KSX9sn1E=" !== "M2mipTuM0nvaheDepZcTvlYj6A5UFSGtYv5KSX9sn1E=") throw new Error("Y mismatch")

                const resolver = new Resolver({ ...getResolver() })
                const resolved = await resolver.resolve(did) as any;
                const resolvedJwk = resolved.didDocument.verificationMethod[0].publicKeyJwk;
                const resolvedDid = resolved.didDocument.id;

                if (did !== resolvedDid) console.error("DID mismatch")
                if (JSON.stringify(jwk) !== JSON.stringify(resolvedJwk)) console.error("JWK mismatch")
                // It must be happening during or before the createJWK, because the resolved JWK is correct and the same

                {
                    // b = before resolve
                    // a = after resolve
                    const b_pubEcFromPriv = secp256k1.keyFromPrivate(privateKey.data.array).getPublic()
                    const b_xFromPriv = b_pubEcFromPriv.getX().toString('hex')
                    const b_yFromPriv = b_pubEcFromPriv.getY().toString('hex')

                    const b_pubEc = secp256k1.keyFromPublic(publicKey.data.array).getPublic()
                    const b_x = b_pubEc.getX().toString('hex')
                    const b_y = b_pubEc.getY().toString('hex')

                    if (b_xFromPriv !== b_x) console.error("X mismatch from key", `\n${b_xFromPriv}\n${b_x}`)
                    if (b_yFromPriv !== b_y) console.error("Y mismatch from key", `\n${b_yFromPriv}\n${b_y}`)

                    const b_pubEcFromJwk = secp256k1
                        .keyFromPublic({
                            x: bytesToHex(base64ToBytes(jwk.x)),
                            y: bytesToHex(base64ToBytes(jwk.y)),
                        }).getPublic();
                    const b_xFromJwk = b_pubEcFromJwk.getX().toString('hex')
                    const b_yFromJwk = b_pubEcFromJwk.getY().toString('hex')

                    const a_pubEcFromJwk = secp256k1
                        .keyFromPublic({
                            x: bytesToHex(base64ToBytes(resolvedJwk.x)),
                            y: bytesToHex(base64ToBytes(resolvedJwk.y)),
                        }).getPublic();
                    const a_xFromJwk = b_pubEcFromJwk.getX().toString('hex')
                    const a_yFromJwk = b_pubEcFromJwk.getY().toString('hex')

                    if (b_xFromJwk !== a_xFromJwk) console.error("X mismatch from between JWKs")
                    if (b_yFromJwk !== a_yFromJwk) console.error("Y mismatch from between JWKs")

                    if (b_x !== b_xFromJwk) console.error("X mismatch from resolved JWK", `\n${b_x}\n${b_xFromJwk}`) // THROWS
                    if (b_y !== b_yFromJwk) console.error("Y mismatch from resolved JWK", `\n${b_y}\n${b_yFromJwk}`)
                }

                {
                    const payload: LoginRequestPayload = {
                        randomString: randomString(32),
                        origin: window.location.origin,
                        publicKey: publicKey,
                        callbackPath: "/test-end",
                    };

                    const signer = ES256KSigner(privateKey.data.array, true);

                    const issuer = {
                        did,
                        signer: signer as any,
                        alg: "ES256K-R",
                    };
                    const loginRequest = await LoginRequest.signRequest(payload, issuer);

                    await loginRequest.verify();
                }
            }
        } catch (e) {
            console.error("error", e);
        }
    }

    async function main4() {
        // It must be happening during or before the createJWK, because the resolved JWK is correct and the same

        try {
            for (let i = 0; i < 100; i++) {
                // const bytes = new Uint8Array(32);

                // window.crypto.getRandomValues(bytes);
                const bytes = randomBytes(32);
                const bytesBytes = new Bytes(bytes)
                const privateKey = new PrivateKey(KeyType.K1, bytesBytes);
                const publicKey = privateKey.toPublic();

                console.log('bytes', bytes.length, bytesBytes.array.length, privateKey.data.array.length, publicKey.data.array.length)
                // const { privateKey, publicKey } = generateRandomKeyPair();

                // A key that was found to cause the issue
                // const privateKey = PrivateKey.from("PVT_K1_2VFa49dhuRgtWAAuzV8DmbNgGXytG1Nwy8o8vTonv9vatx3B5m");
                // const publicKey = privateKey.toPublic();

                const privEc = secp256k1.keyFromPrivate(bytes);
                const pubEc = privEc.getPublic();
                // const pubEc = secp256k1.keyFromPublic(publicKey.data.array).getPublic();

                // const x = bnToBase64Url(pubEc.getPublic().getX())
                let x: string;

                {
                    const bnString = pubEc.getX().toString();
                    const bi = BigInt(bnString);

                    // const biBytes = bigintToBytes(bi);
                    let biBytes: Uint8Array;

                    {
                        const biHex = bi.toString(16)

                        biBytes = u8a.fromString(biHex, 'base16');
                    }

                    x = bytesToBase64(biBytes);
                }

            }
        } catch (e) {
            console.error("error", e);
        }
    }

    async function main5() {
        // It's not part of randomBytes, because it's not a problem with randomBytes
        // It's not a problem with PublicKey and PrivateKey from @greymass/eosio, tried without it

        const goodBytes = new Uint8Array([133, 165, 183, 223, 122, 11, 213, 75, 174, 228, 86, 169, 229, 18, 26, 58, 200, 226, 179, 106, 56, 87, 56, 234, 240, 38, 95, 96, 216, 47, 223, 154])
        const badBytes = new Uint8Array([108, 102, 206, 177, 133, 88, 175, 207, 56, 245, 221, 179, 95, 217, 167, 75, 180, 73, 18, 41, 49, 156, 226, 92, 132, 239, 143, 16, 249, 0, 135, 59])

        const bytesArray = [goodBytes, badBytes]

        try {
            for (const bytes of bytesArray) {

                console.log('bytes', bytes, bytes.toString())
                const privEc = secp256k1.keyFromPrivate(bytes);
                const pubEc = privEc.getPublic();
                const xBn = pubEc.getX()
                // const x = bnToBase64Url(pubEc.getPublic().getX())
                let x: string;


                {
                    const biHex = (xBn as any).toString('hex')

                    // hex output is the same
                    console.log('biHex', biHex, biHex.length)
                    // length = 64 when correct, 63 when incorrect
                    // this causes failure in /node_modules/multiformats/esm/src/bases/base.js decode()
                    x = hexToBase64(biHex);
                    console.log('x2', x)
                }

                {
                    // New did-jwt way with BigInt
                    const bnString = xBn.toString();

                    console.log("BN", bnString)
                    const bi = BigInt(bnString);

                    // const biBytes = bigintToBytes(bi);
                    let biBytes: Uint8Array;

                    {
                        // verified this is correct with https://www.rapidtables.com/convert/number/decimal-to-hex.html
                        const biHex = bi.toString(16)
                        // length = 64 when correct, 63 when incorrect
                        // this causes failure in /node_modules/multiformats/esm/src/bases/base.js decode()

                        // const biHex2 = biHex.padStart(64, '0')

                        console.log('biHex', biHex, biHex.length)

                        biBytes = u8a.fromString(biHex, 'base16');
                    }

                    x = bytesToBase64(biBytes);
                    console.log('x', x)
                }




            }
        } catch (e) {
            console.error("error", e);
        }
    }

    let rendered = false;

    useEffect(() => {
        if (!rendered) {
            rendered = true;
            main1();
        }
    });

    return <h1>Test</h1>;
}
