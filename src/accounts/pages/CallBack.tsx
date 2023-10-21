import React, { useEffect } from "react";
import TProgressCircle from "../../common/atoms/TProgressCircle";
import {
  api,
  UserApps,
  SdkError,
  SdkErrors,
  objToBase64Url,
  getLoginRequestResponseFromUrl,
  verifyRequests,
  getLoginRequestFromUrl,
  DataSharingRequest,
  LoginRequest,
} from "@tonomy/tonomy-id-sdk";

export default function CallBackPage() {
  useEffect(() => {
    verifyLoginCallback();
  }, []);

  async function verifyLoginCallback() {
    try {
      await api.ExternalUser.verifyLoginRequest();

      const { success, error, requests, response } =
        getLoginRequestResponseFromUrl();

      if (success) {
        if (!requests || !response) {
          throw new Error("Invalid response");
        }

        await verifyRequests(requests);

        const externalLoginRequest = requests.find(
          (request) => request.getPayload().origin !== window.location.origin
        );

        if (!externalLoginRequest) {
          throw new Error("Login request for external site was not found");
          //TODO: handle this here
        }

        if (!response?.data?.username) throw new Error("No username found");

        const { accountName } = response;
        const username = response.data.username;

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
        const externalLoginRequest = requests.find(
          (r) =>
            r.getType() === LoginRequest.getType() &&
            r.getPayload().origin !== window.location.origin
        );

        if (!externalLoginRequest)
          throw new Error("No external login request found");

        if (!error) throw new Error("Error not defined");
        const callbackUrl = await UserApps.terminateLoginRequest(
          requests.filter(
            (r) =>
              r.getType() === DataSharingRequest.getType() ||
              r.getPayload().origin !== window.location.origin
          ),
          "mobile",
          error,
          {
            callbackOrigin: externalLoginRequest.getPayload().origin,
            callbackPath: externalLoginRequest.getPayload().callbackPath,
          }
        );

        window.location.href = callbackUrl as string;
      }
    } catch (e) {
      if (
        e instanceof SdkError &&
        (e.code === SdkErrors.UserLogout || e.code === SdkErrors.UserCancelled)
      ) {
        try {
          const { requests } = await getLoginRequestFromUrl();
          const externalLoginRequest = requests.find(
            (r) =>
              r.getType() === LoginRequest.getType() &&
              r.getPayload().origin !== window.location.origin
          );

          if (!externalLoginRequest)
            throw new Error("No external login request found");

          const callbackUrl = await UserApps.terminateLoginRequest(
            requests.filter(
              (r) =>
                r.getType() === DataSharingRequest.getType() ||
                r.getPayload().origin !== window.location.origin
            ),
            "mobile",
            {
              code: e.code,
              reason:
                e.code === SdkErrors.UserLogout
                  ? "User logged out"
                  : "User cancelled login",
            },
            {
              callbackOrigin: externalLoginRequest.getPayload().origin,
              callbackPath: externalLoginRequest.getPayload().callbackPath,
            }
          );

          window.location.href = callbackUrl as string;
        } catch (e) {
          console.error(e);
        }
      } else {
        console.error(e);
      }
    }
  }

  return (
    <div className="center">
      <TProgressCircle />
    </div>
  );
}
