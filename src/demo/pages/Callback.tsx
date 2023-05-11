import React, { useEffect } from "react";
import { api, SdkError, SdkErrors } from "@tonomy/tonomy-id-sdk";
import "./callback.css";
import { useNavigate } from "react-router-dom";
import useErrorStore from "../../common/stores/errorStore";

export default function Callback() {
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
        alert("User cancelled login");
        navigation("/");
      } else {
        errorStore.setError({
          error: e,
          expected: false,
        });
      }
    }
  }

  return <h1>Loading...</h1>;
}
