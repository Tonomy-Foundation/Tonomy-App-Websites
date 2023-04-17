import React, { useEffect } from "react";
import TProgressCircle from "../components/TProgressCircle";
import { api, UserApps, SdkError, SdkErrors } from "@tonomy/tonomy-id-sdk";

export default function CallBackPage() {
  useEffect(() => {
    verifyRequests();
  }, []);

  async function verifyRequests() {
    try {
      await api.ExternalUser.verifyLoginRequest();
    } catch (e) {
      if (e instanceof SdkError && e.code === SdkErrors.UserLogout) {
        alert("User logout the request");
      }

      if (e instanceof SdkError && e.code === SdkErrors.UserCancelled) {
        alert("User cancelled the request");
      }

      window.location.href = document.referrer;
    }

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
      `?status=${status}&username=${username}&accountName=${accountName}&requests=` +
      JSON.stringify([redirectJwt.jwt]);

    location.replace(url);
  }

  return (
    <div className="center">
      <TProgressCircle />
    </div>
  );
}
