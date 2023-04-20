import React, { useEffect } from "react";
import TProgressCircle from "../components/TProgressCircle";
import { api, UserApps, SdkError, SdkErrors } from "@tonomy/tonomy-id-sdk";
import { useNavigate } from "react-router-dom";

export default function CallBackPage() {
  const navigation = useNavigate();

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

      navigation("/loading" + location.search);
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
