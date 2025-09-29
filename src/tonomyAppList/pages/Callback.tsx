import React, { useEffect, useState, useContext } from "react";
import {
  AppsExternalUser,
  ExternalUser,
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

export default function Callback() {
  const [errorTitle, setErrorTitle] = useState("");
  const [errorVisible, setErrorVisible] = useState(false);
  const navigation = useNavigate();
  const errorStore = useErrorStore();
  const { signin } = useContext(AuthContext);
  const url = new URL(window.location.href);
  const page = url.searchParams.get("page") || undefined;
  console.log("page", page);
  useEffect(() => {
    verifyLogin();
  }, []);

  async function verifyLogin() {
    try {
      const user = await ExternalUser.verifyLoginResponse();
      console.log("user", user);
      if (user) {
        signin(user.user, page);
      }
    } catch (e) {
      if (isErrorCode(e, SdkErrors.UserCancelled)) {
        setErrorTitle("User cancelled login");
        setErrorVisible(true);
      } else if (isErrorCode(e, SdkErrors.UserLogout)) {
        setErrorTitle("User logged out");
        setErrorVisible(true);
      } else if (isErrorCode(e, SdkErrors.UserRefreshed)) {
        navigation("/");
      } else {
        errorStore.setError({ error: e });
      }
    }
  }

  return (
    <>
      <TModal
        onPress={async () => {
          navigation("/");
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
