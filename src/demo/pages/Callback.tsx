import React, { useEffect } from "react";
import { api, SdkError, SdkErrors } from "@tonomy/tonomy-id-sdk";
import "./callback.css";
import { useNavigate } from "react-router-dom";

export default function Callback() {
  const navigation = useNavigate();

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
        console.error(e);
        alert(e);
      }
    }
  }

  return <h1>Loading...</h1>;
}
