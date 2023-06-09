import React from "react";
import { TH2, TP } from "../../common/atoms/THeadings";
import "@tonomy/tonomy-id-sdk/build/api/tonomy.css";
import HighlightedPageView from "../components/TPageHighlighted";
import {
  ContainerStyle,
  PageIntroStyle,
  BoxContainer,
} from "../components/styles";
import TUserInfo from "../components/TUserInfo";
import "./UserHome.css";

export default function UserHome() {
  return (
    <ContainerStyle>
      <PageIntroStyle>
        <TUserInfo></TUserInfo>
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
          <button className="tonomy-login-button">
            SIGN W3C VERIFIABLE CREDENTIALS
          </button>
        </BoxContainer>
        <BoxContainer className="boxStyle">
          <TP>
            You can sign blockchain transactions using our secure system and
            your private key.
          </TP>
          <button className="tonomy-login-button">
            SIGN BLOCKCHAIN TRANSACTIONS
          </button>
        </BoxContainer>
        <BoxContainer className="boxStyle">
          <TP>
            Additionally, you can send messages to other users of Tonomy ID,
            allowing for easy communication and collaboration.
          </TP>
          <button className="tonomy-login-button">
            SEND PEER TO PEER MESSAGES
          </button>
        </BoxContainer>
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
