import React, { useEffect, useState, useContext } from "react";
import {
  AppsExternalUser,
  isErrorCode,
  SdkErrors,
} from "@tonomy/tonomy-id-sdk";
import "./Callback.css";
import { useNavigate } from "react-router-dom";
import useErrorStore from "../../common/stores/errorStore";
import TProgressCircle from "../../common/atoms/TProgressCircle";
import { TH2 } from "../../common/atoms/THeadings";
import TModal from "../../common/molecules/TModal";
import { AuthContext } from "../providers/AuthProvider";
import Debug from "debug";

const debug = Debug("tonomy-app-websites:apps:Callback");

export default function Callback() {
  const [errorTitle, setErrorTitle] = useState("");
  const [errorVisible, setErrorVisible] = useState(false);
  const navigate = useNavigate();
  const errorStore = useErrorStore();
  const { signin } = useContext(AuthContext);
  const url = new URL(window.location.href);

  useEffect(() => {
    verifyLogin();
  }, []);

  async function verifyLogin() {
    const page = url.searchParams.get("page");
    try {
      const { user } = await AppsExternalUser.verifyLoginResponse();
      debug("verifyLogin()", page);
      if (user) {
        signin(new AppsExternalUser(user), page ?? "/");
      }
    } catch (e) {
      if (isErrorCode(e, SdkErrors.UserCancelled)) {
        setErrorTitle("User cancelled login");
        setErrorVisible(true);
      } else if (isErrorCode(e, SdkErrors.UserLogout)) {
        setErrorTitle("User logged out");
        setErrorVisible(true);
      } else if (isErrorCode(e, SdkErrors.UserRefreshed)) {
        if (page) {
          if (page.startsWith("/bankless")) navigate("/bankless");
          else if (page.startsWith("/build")) navigate("/build");
        } else navigate("/");
      } else {
        errorStore.setError({ error: e });
      }
    }
  }

  return (
    <>
      <TModal
        onPress={async () => {
          navigate("/");
          setErrorVisible(false);
        }}
        icon="block"
        iconColor="warning"
        title={errorTitle}
        buttonLabel="Try again"
        open={errorVisible}
      >
        <></>
      </TModal>
      <div
        style={{
          display: "flex",
          height: "100%",
        }}
      >
        <div
          style={{
            margin: "auto",
            textAlign: "center",
          }}
        >
          <div>
            <TH2>Logging in...</TH2>
          </div>
          <div>
            <TProgressCircle />
          </div>
        </div>
      </div>
    </>
  );
}
