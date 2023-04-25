import React, { useEffect } from "react";
import TProgressCircle from "../components/TProgressCircle";
import { api, UserApps, SdkError, SdkErrors } from "@tonomy/tonomy-id-sdk";
import { useNavigate } from "react-router-dom";
import { encodeBase64url } from "@tonomy/did-jwt/lib/util";

export default function CallBackPage() {
  const navigation = useNavigate();

  useEffect(() => {
    verifyRequests();
  }, []);

  async function verifyRequests() {
    let url = "";

    try {
      await api.ExternalUser.verifyLoginRequest();

      const { success, error, requests, accountName, username } =
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

      let url += redirectJwtPayload.origin + redirectJwtPayload.callbackPath;

      url +=
        "?payload=" +
        encodeBase64url(
          JSON.stringify({
            success: true,
            accountName,
            username,
            requests: [externalLoginRequest],
          })
        );
      window.location.href = url;
    } catch (e) {
      if (
        e instanceof SdkError &&
        (e.code === SdkErrors.UserLogout || e.code === SdkErrors.UserCancelled)
      ) {
        const base64UrlPayload = encodeBase64url(
          JSON.stringify({
            success: false,
            error: {
              code: e.code,
              reason: e.message,
            },
          })
        );

        url += base64UrlPayload;
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
