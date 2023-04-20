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
