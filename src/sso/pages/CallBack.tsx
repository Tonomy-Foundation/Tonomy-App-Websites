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
      UserApps.getLoginRequestResponseFromUrl();

    await UserApps.verifyRequests(requests);

    const externalLoginRequest = requests.find(
      (request) => request.getPayload().origin !== window.location.origin
    );

    if (!externalLoginRequest) {
      throw new Error("Login request for external site was not found");
      //TODO: handle this here
    }

    const redirectJwtPayload = externalLoginRequest.getPayload();
    let url = redirectJwtPayload.origin + redirectJwtPayload.callbackPath;

    url += `?requests=` + JSON.stringify([externalLoginRequest.toString()]);
    url += `&accountName=${accountName}`;
    url += `&?username=${username}`;

    location.replace(url);
  }

  return (
    <div className="center">
      <TProgressCircle />
    </div>
  );
}
