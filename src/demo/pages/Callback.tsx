import React, { useEffect } from "react";
import { api, SdkError, SdkErrors } from "@tonomy/tonomy-id-sdk";
import "./callback.css";
import { useNavigate } from "react-router-dom";
import useErrorStore from "../../common/stores/errorStore";
import { useUserStore } from "../../sso/stores/user.store";
import TProgressCircle from "../../common/atoms/TProgressCircle";

export default function Callback() {
  const navigation = useNavigate();
  const errorStore = useErrorStore();
  const userStore = useUserStore();

  useEffect(() => {
    verifyLogin();
  }, []);

  async function verifyLogin() {
    try {
      const user = await api.ExternalUser.verifyLoginRequest();

      userStore.setUser(user);
      navigation("/user-home");
    } catch (e) {
      if (
        e instanceof SdkError &&
        (e.code === SdkErrors.UserCancelled || SdkErrors.UserLogout)
      ) {
        errorStore.setError({
          error: e,
          title: e.message,
          expected: true,
          onClose: async () => navigation("/")
        });
      } else {
        errorStore.setError({
          error: e,
          expected: false,
        });
      }
    }
  }

  const styles = {
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    }
  }

  return (
    <>
      <div style={styles.center}>
        <h1>Finalizing login</h1>
        <TProgressCircle />
      </div>
    </>
  );
}
