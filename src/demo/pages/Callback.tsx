import React, { useEffect, useState } from "react";
import { api, SdkError, SdkErrors } from "@tonomy/tonomy-id-sdk";
import "./Callback.css";
import { useNavigate } from "react-router-dom";
import useErrorStore from "../../common/stores/errorStore";
import TProgressCircle from "../../common/atoms/TProgressCircle";
import { TH2 } from "../../common/atoms/THeadings";
import TModal from "../../common/molecules/TModal";

export default function Callback() {
  const [errorTitle, setErrorTitle] = useState("");
  const [errorVisible, setErrorVisible] = useState(false);
  const navigation = useNavigate();
  const errorStore = useErrorStore();

  useEffect(() => {
    verifyLogin();
  }, []);

  async function verifyLogin() {
    try {
      await api.ExternalUser.verifyLoginRequest();
      navigation("/user-home");
    } catch (e) {
      if (
        e instanceof SdkError &&
        (e.code === SdkErrors.UserCancelled || SdkErrors.UserLogout)
      ) {
        switch (e.code) {
          case SdkErrors.UserCancelled:
            setErrorTitle("User cancelled login");
            setErrorVisible(true);
            break;
          case SdkErrors.UserLogout:
            setErrorTitle("User logged out");
            setErrorVisible(true);
            break;
          case SdkErrors.UserRefreshed:
            navigation("/");
            break;
        }
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
