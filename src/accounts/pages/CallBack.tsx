import React, { useEffect } from "react";
import {
  ExternalUser,
  rejectLoginRequest,
  isErrorCode,
  getErrorCode,
  SdkErrors,
  LoginRequestResponseMessagePayload,
} from "@tonomy/tonomy-id-sdk";
import TSpinner from "../atoms/TSpinner";

export default function CallBackPage() {
  useEffect(() => {
    verifyLoginCallback();
  }, []);

  async function verifyLoginCallback() {
    try {
      await ExternalUser.verifyLoginRequest();

      const { success, error, response } = getLoginRequestResponseFromUrl();

      if (success) {
        if (!response) {
          throw new Error("Invalid response");
        }

        const managedResponses = new ResponsesManager(response);
        const managedRequests = new RequestsManager(
          managedResponses.getRequests(),
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

        const managedExternalRequests = new RequestsManager(
          managedRequests.getRequestsDifferentOriginOrThrow(),
        );

        if (!error) throw new Error("Error not defined");
        const callbackUrl = await rejectLoginRequest(
          new ResponsesManager(managedExternalRequests),
          "redirect",
          error,
        );

        window.location.href = callbackUrl as string;
      }
    } catch (e) {
      if (
        isErrorCode(e, [SdkErrors.KeyNotFound, SdkErrors.AccountDoesntExist])
      ) {
        try {
          const { error } = getLoginRequestResponseFromUrl();

          if (!error) throw new Error("Error not defined");
          const managedRequests = new RequestsManager(error.requests);

          const externalLoginRequest =
            managedRequests.getLoginRequestWithDifferentOriginOrThrow();

          const callbackUrl = await rejectLoginRequest(
            new ResponsesManager(
              new RequestsManager(
                managedRequests.getRequestsDifferentOriginOrThrow(),
              ),
            ),
            "redirect",
            {
              code: getErrorCode(e),
              reason: isErrorCode(e, SdkErrors.UserLogout)
                ? "User logged out"
                : "User cancelled login",
            },
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
    <div className="login-callback">
      <TSpinner />
    </div>
  );
}
