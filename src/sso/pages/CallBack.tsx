import React, { useEffect } from 'react';
import TProgressCircle from '../components/TProgressCircle';
import { UserApps } from '@tonomy/tonomy-id-sdk';
import JsKeyManager from '../keymanager';

export default function CallBackPage() {
    useEffect(() => {
        verifyRequests();
    }, []);

    async function verifyRequests() {
        console.log('test');
        const { result, accountName, username } = await UserApps.onAppRedirectVerifyRequests();

        console.log(result, accountName);
        const redirectJwt = result.find((jwtVerified) => jwtVerified.getPayload().origin !== location.origin);
        const ssoJwt = result.find((jwtVerified) => jwtVerified.getPayload().origin === location.origin);

        if (!redirectJwt) {
            console.log('test');
            throw new Error("JWT isn't correct");
            //TODO: handle this here
        }

        if (ssoJwt) {
            try {
                const verifiedLoginSso = await UserApps.verifyKeyExistsForApp(accountName, new JsKeyManager());

                if (verifiedLoginSso) localStorage.setItem('loggedIn', 'true');
            } catch (e) {
                // TODO only catch the 404 error and show nothing
                console.log(e);
            }
        }

        const redirectJwtPayload = redirectJwt.getPayload();
        const url =
            redirectJwtPayload.origin +
            redirectJwtPayload.callbackPath +
            `?username=${username}&accountName=${accountName}&requests=` +
            JSON.stringify([redirectJwt.jwt]);

        location.replace(url);
    }

    return (
        <div className="center">
            <TProgressCircle />
        </div>
    );
}
