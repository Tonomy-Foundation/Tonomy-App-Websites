import React, { useEffect, useState } from "react";
import { TH2, TP } from "../../common/atoms/THeadings";
import HighlightedPageView from "../components/TPageHighlighted";
import {
  ContainerStyle,
  PageIntroStyle,
  BoxContainer,
} from "../components/styles";
import "./UserHome.css";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../common/stores/user.store";
import { api } from "@tonomy/tonomy-id-sdk";
import useErrorStore from "../../common/stores/errorStore";
import settings from "../../common/settings";

export default function UserHome() {
  const navigation = useNavigate();
  const userStore = useUserStore();
  const errorStore = useErrorStore();
  const [username, setUsername] = useState<string>("");
  const [blockExplorerUrl, setBlockExplorerUrl] = useState<string>("");

  async function onRender() {
    try {
      if (!userStore.user) {
        const user = await api.ExternalUser.getUser();

        userStore.setUser(user);

        const username = await user.getUsername();

        if (!username) throw new Error("No username found");
        setUsername(username.getBaseUsername());

        const accountName = await user?.getAccountName();

        if (!accountName) throw new Error("No account name found");
        let url = "https://local.bloks.io/account/" + accountName + "?nodeUrl=";

        url += settings.isProduction()
          ? settings.config.blockchainUrl
          : "http://localhost:8888";
        setBlockExplorerUrl(url);
      }
    } catch (e) {
      errorStore.setError({ error: e, expected: false });
    }
  }

  useEffect(() => {
    onRender();
  }, []);

  return (
    <ContainerStyle>
      <PageIntroStyle>
        <div className="head-subtitle">
          <TP>You are now logged in with Tonomy ID, as {username}</TP>
          <TP>
            View your account on the blockchain{" "}
            <a target={"_blank"} href={blockExplorerUrl} rel="noreferrer">
              here
            </a>
          </TP>
        </div>
        <TH2> Home</TH2>
        <TP className="text-header">
          Our demo site showcases the benefits of Tonomy ID for both users and
          administrators. <br />
          As a user, you now have access to a variety of features.
        </TP>
        <BoxContainer className="boxStyle">
          <TP>
            You can create a verifiable data by using our built-in tools to
            create and manage your own digital certificates
          </TP>
          <button
            className="tonomy-login-button"
            onClick={() => navigation("/w3c-vcs")}
          >
            SIGN W3C VERIFIABLE CREDENTIALS
          </button>
        </BoxContainer>
        <BoxContainer className="boxStyle">
          <TP>
            You can sign blockchain transactions using our secure system and
            your private key.
          </TP>
          <button
            className="tonomy-login-button"
            onClick={() => navigation("/blockchain-tx")}
          >
            SIGN BLOCKCHAIN TRANSACTIONS
          </button>
        </BoxContainer>
        {/* <BoxContainer className="boxStyle">
          <TP>
            Additionally, you can send messages to other users of Tonomy ID,
            allowing for easy communication and collaboration.
          </TP>
          <button
            className="tonomy-login-button"
            onClick={() => navigation("/messages")}
          >
            SEND PEER TO PEER MESSAGES
          </button>
        </BoxContainer> */}
      </PageIntroStyle>

      <HighlightedPageView
        highlighterText={`
            function onButtonPress() {
              userApps.onPressLogin(
              { callbackPath: "/callback" },
              new JsKeyManager()
              );
              ...
            }
            <button className="tonomy-login-button"
            onClick={onButtonPress}>
            Login with {Your Platform Name Here}
            </button>
          `}
        documentLink="https://docs.tonomy.foundation"
        githubLink="https://github.com/Tonomy-Foundation/Tonomy-App-Websites/blob/master/src/demo/pages/Home.tsx"
      />
    </ContainerStyle>
  );
}
