import React, { useEffect } from "react";
import TProgressCircle from "../components/TProgressCircle";
import {
  api,
  UserApps,
  SdkError,
  SdkErrors,
  objToBase64Url,
} from "@tonomy/tonomy-id-sdk";

export default function CallBackPage() {
  useEffect(() => {
    verifyRequests();
  }, []);

  async function verifyRequests() {
    try {
      await api.ExternalUser.verifyLoginRequest();

      const { success, error, requests, accountName, username } =
        UserApps.getLoginRequestResponseFromUrl();

      if (success) {
        if (!requests || !accountName || !username) {
          throw new Error("Invalid response");
        }

        await UserApps.verifyRequests(requests);

        const externalLoginRequest = requests.find(
          (request) => request.getPayload().origin !== window.location.origin
        );

        if (!externalLoginRequest) {
          throw new Error("Login request for external site was not found");
          //TODO: handle this here
        }

        const loginRequestPayload = externalLoginRequest.getPayload();

        let url = loginRequestPayload.origin + loginRequestPayload.callbackPath;

        url +=
          "?payload=" +
          objToBase64Url({
            success: true,
            accountName,
            username,
            requests: [externalLoginRequest],
          });
        window.location.href = url;
      } else {
        // TODO handle error case which came from Tonomy ID
      }
    } catch (e) {
      if (
        e instanceof SdkError &&
        (e.code === SdkErrors.UserLogout || e.code === SdkErrors.UserCancelled)
      ) {
        const { requests } = UserApps.getLoginRequestFromUrl();

        const externalLoginRequest = requests.find(
          (request) => request.getPayload().origin !== window.location.origin
        );

        if (!externalLoginRequest) {
          throw new Error("Login request for external site was not found");
          //TODO: handle this here
        }

        const loginRequestPayload = externalLoginRequest.getPayload();

        let url = loginRequestPayload.origin + loginRequestPayload.callbackPath;

        const base64UrlPayload = objToBase64Url({
          success: false,
          error: {
            code: e.code,
            reason: e.message,
          },
        });

        url += "?payload=" + base64UrlPayload;
        window.location.href = url;
      } else {
        console.error(e);
        alert("Error occured");
      }
    }
  }

  return (
    <div className="center">
      <TProgressCircle />
    </div>
  );
}
