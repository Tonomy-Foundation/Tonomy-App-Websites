import React, { useEffect } from "react";
import TProgressCircle from "../../common/atoms/TProgressCircle";
import {
  api,
  terminateLoginRequest,
  SdkError,
  SdkErrors,
  objToBase64Url,
  getLoginRequestResponseFromUrl,
  RequestsManager,
  ResponsesManager,
  LoginRequestResponseMessagePayload,
} from "@tonomy/tonomy-id-sdk";

export default function CallBackPage() {
  useEffect(() => {
    verifyLoginCallback();
  }, []);

  async function verifyLoginCallback() {
    try {
      await api.ExternalUser.verifyLoginRequest();

      const { success, error, response } = getLoginRequestResponseFromUrl();

      if (success) {
        if (!response) {
          throw new Error("Invalid response");
        }

        const managedResponses = new ResponsesManager(response);
        const managedRequests = new RequestsManager(
          managedResponses.getRequests()
        );

        await managedResponses.verify();
        await managedResponses.fetchMeta();

        const loginRequestPayload = managedRequests
          .getLoginRequestWithDifferentOriginOrThrow()
          .getPayload();
        let url = loginRequestPayload.origin + loginRequestPayload.callbackPath;

        const externalResponse = managedResponses
          .getResponsesWithDifferentOriginOrThrow()
          .map((response) => response.getRequestAndResponse());

        const responsePayload: LoginRequestResponseMessagePayload = {
          success: true,
          response: externalResponse,
        };

        url += "?payload=" + objToBase64Url(responsePayload);
        window.location.href = url;
      } else {
        if (!error) throw new Error("Error not defined");

        const managedRequests = new RequestsManager(error.requests);
        const externalLoginRequest =
          managedRequests.getLoginRequestWithDifferentOriginOrThrow();

        const managedExternalRequests = new RequestsManager(
          managedRequests.getRequestsDifferentOriginOrThrow()
        );

        if (!error) throw new Error("Error not defined");
        const callbackUrl = await terminateLoginRequest(
          new ResponsesManager(managedExternalRequests),
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
          const { error } = getLoginRequestResponseFromUrl();

          if (!error) throw new Error("Error not defined");
          const managedRequests = new RequestsManager(error.requests);

          const externalLoginRequest =
            managedRequests.getLoginRequestWithDifferentOriginOrThrow();

          const callbackUrl = await terminateLoginRequest(
            new ResponsesManager(
              new RequestsManager(
                managedRequests.getRequestsDifferentOriginOrThrow()
              )
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
