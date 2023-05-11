import React, { useEffect } from "react";
import TProgressCircle from "../../common/atoms/TProgressCircle";
import {
  api,
  UserApps,
  SdkError,
  SdkErrors,
  objToBase64Url,
} from "@tonomy/tonomy-id-sdk";
import useErrorStore from "../../common/stores/errorStore";

export default function CallBackPage() {
  const errorStore = useErrorStore();

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
        const externalLoginRequest = requests.find(
          (r) => r.getPayload().origin !== window.location.origin
        );

        if (!externalLoginRequest)
          throw new Error("No external login request found");

        if (!error) throw new Error("Error not defined");
        const callbackUrl = await UserApps.terminateLoginRequest(
          [externalLoginRequest],
          "url",
          error,
          {
            callbackOrigin: externalLoginRequest.getPayload().origin,
            callbackPath: externalLoginRequest.getPayload().callbackPath,
          }
        );

        window.location.href = callbackUrl;
      }
    } catch (e) {
      if (
        e instanceof SdkError &&
        (e.code === SdkErrors.UserLogout || e.code === SdkErrors.UserCancelled)
      ) {
        try {
          const { requests } = await UserApps.getLoginRequestFromUrl();
          const externalLoginRequest = requests.find(
            (r) => r.getPayload().origin !== window.location.origin
          );

          if (!externalLoginRequest)
            throw new Error("No external login request found");

          const callbackUrl = await UserApps.terminateLoginRequest(
            [externalLoginRequest],
            "url",
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

          window.location.href = callbackUrl;
        } catch (e) {
          errorStore.setError({
            error: e,
            expected: false,
          });
        }
      } else {
        errorStore.setError({
          error: e,
          expected: false,
        });
      }
    }
  }

  return (
    <div className="center">
      <TProgressCircle />
    </div>
  );
}
