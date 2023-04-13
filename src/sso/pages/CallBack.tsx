import React, { useEffect } from "react";
import TProgressCircle from "../components/TProgressCircle";
import { api, UserApps } from "@tonomy/tonomy-id-sdk";

export default function CallBackPage() {
  useEffect(() => {
    verifyRequests();
  }, []);

  async function verifyRequests() {
    await api.ExternalUser.verifyLoginRequest();

    const { requests, accountName, username } =
      UserApps.getLoginRequestParams();
    const result = await UserApps.verifyRequests(requests);

    const redirectJwt = result.find(
      (jwtVerified) =>
        jwtVerified.getPayload().origin !== window.location.origin
    );

    if (!redirectJwt) {
      throw new Error("Login request for external site was not found");
      //TODO: handle this here
    }

    const redirectJwtPayload = redirectJwt.getPayload();
    const url =
      redirectJwtPayload.origin +
      redirectJwtPayload.callbackPath +
      `?username=${username}&accountName=${accountName}&requests=` +
      JSON.stringify([redirectJwt.toString()]);

    location.replace(url);
  }

  return (
    <div className="center">
      <TProgressCircle />
    </div>
  );
}
