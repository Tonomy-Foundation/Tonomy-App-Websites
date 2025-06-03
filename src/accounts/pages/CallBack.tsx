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

export default function CallBackPage() {
  useEffect(() => {
    verifyLoginCallback();
  }, []);

  async function verifyLoginCallback() {
    try {
      await ExternalUser.verifyLoginResponse();

      const responses = DualWalletResponse.fromUrl();

      let callbackUrl: string;
      if (responses.isSuccess()) {
        if (!responses.external) throw new Error("External response not found");
        await responses.verify();

        const externalResponse = DualWalletResponse.fromResponses(
          responses.external,
        );

        callbackUrl = externalResponse.getRedirectUrl();
      } else {
        if (!responses.error) throw new Error("Error not defined");
        if (!responses.requests) throw new Error("Requests not defined");

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
