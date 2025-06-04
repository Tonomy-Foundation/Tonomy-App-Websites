import React, { useEffect } from "react";
import {
  ExternalUser,
  rejectLoginRequest,
  isErrorCode,
  getErrorCode,
  SdkErrors,
  DualWalletRequests,
  DualWalletResponse,
} from "@tonomy/tonomy-id-sdk";
import TSpinner from "../atoms/TSpinner";
import Debug from "debug";

const debug = Debug("tonomy-app-websites:accounts:pages:CallBackPage");

export default function CallBackPage() {
  useEffect(() => {
    verifyLoginCallback();
  }, []);

  async function verifyLoginCallback() {
    try {
      debug("verifyLoginCallback() called");
      await ExternalUser.verifyLoginResponse();

      const responses = DualWalletResponse.fromUrl();

      let callbackUrl: string;
      if (responses.isSuccess()) {
        if (!responses.external) throw new Error("External response not found");
        await responses.verify();

        // Create a response only with the external response
        const externalResponse = DualWalletResponse.fromResponses(
          responses.external,
        );

        callbackUrl = externalResponse.getRedirectUrl();
      } else {
        if (!responses.error) throw new Error("Error not defined");
        if (!responses.requests) throw new Error("Requests not defined");

        // Create a response only with the external response
        const externalRequest = new DualWalletRequests(
          responses.requests.external,
        );
        callbackUrl = await rejectLoginRequest(
          externalRequest,
          "redirect",
          responses.error,
        );
      }
      window.location.href = callbackUrl;
    } catch (e) {
      if (
        isErrorCode(e, [SdkErrors.KeyNotFound, SdkErrors.AccountDoesntExist])
      ) {
        try {
          const responses = DualWalletResponse.fromUrl();
          if (!responses.error) throw new Error("Error not defined");
          if (!responses.requests) throw new Error("Requests not defined");

          // Create a response only with the external response
          const externalRequest = new DualWalletRequests(
            responses.requests.external,
          );
          const callbackUrl = await rejectLoginRequest(
            externalRequest,
            "redirect",
            {
              code: getErrorCode(e),
              reason: isErrorCode(e, SdkErrors.UserLogout)
                ? "User logged out"
                : "User cancelled login",
            },
          );
          window.location.href = callbackUrl;
        } catch (e) {
          console.error(
            "error in verifyLoginCallback() while handling KeyNotFound or AccountDoesntExist",
            e,
          );
        }
      } else {
        console.error("error in verifyLoginCallback()", e);
      }
    }
  }

  return (
    <div className="login-callback">
      <TSpinner />
    </div>
  );
}
