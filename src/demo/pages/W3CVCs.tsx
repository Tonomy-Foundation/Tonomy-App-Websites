import React, { useState } from "react";
import TUserInfo from "../components/TUserInfo";
import { TH2, TP } from "../../common/atoms/THeadings";
import { TButton } from "../../common/atoms/TButton";
import "@tonomy/tonomy-id-sdk/build/api/tonomy.css";
import {
  ContainerStyle,
  PageIntroStyle,
  BoxContainer,
} from "../components/styles";
import HighlightedPageView from "../components/TPageHighlighted";
import HorizontalLabelInput from "../components/HorizontalLabelInput";
import TImage from "../../common/atoms/TImage";
import Ticket from "../assets/emojis/ticket.png";
import Handshake from "../assets/emojis/handshake.png";
import Money from "../assets/emojis/money.png";
import Vote from "../assets/emojis/vote.png";
import Cruise from "../assets/emojis/cruise.png";
import "./W3CVCs.css";

export default function W3CVCs() {
  return (
    <ContainerStyle>
      <PageIntroStyle>
        <TUserInfo></TUserInfo>
        <TP className="text-header marginTop">
          Demo feature of how to use Tonomy ID to
        </TP>
        <TH2> Signing Verifiable Credentials</TH2>
        <TP className="text-header">
          By digitally signing the medical record, you can help protect it from
          unauthorized access and tampering, while also providing a traceable
          record of who has accessed the information. <br /> Whether you're a
          medical professional or someone who needs to sign and verify sensitive
          information, the W3C verifiable credential standard can help ensure
          trust and security in digital transactions.
        </TP>
        <TP>
          Below we will illustrate the process of signing verifiable credentials
          on our demo website.
        </TP>
        <TP className="list">
          Other examples of how to use credentials with Tonomy ID include:
          <ul>
            <li>
              <TImage src={Handshake} alt="ticket" className="listIcon" />
              employment contracts
            </li>
            <li>
              <TImage src={Cruise} alt="ticket" className="listIcon" />
              shipping and logistics
            </li>
            <li>
              <TImage src={Money} alt="ticket" className="listIcon" />
              events payments and payment metadata
            </li>
            <li>
              <TImage src={Vote} alt="ticket" className="listIcon" />
              votes event
            </li>
            <li>
              <TImage src={Ticket} alt="ticket" className="listIcon" />
              tickets and much more!
            </li>
          </ul>
        </TP>
        <BoxContainer className="clientBox">
          <TH2>Client details</TH2>
          <div className="formView marginTop">
            <HorizontalLabelInput label="Name:" value={"Johnathan Doe"} />
            <HorizontalLabelInput
              label="Phone number:"
              value={"+33 64 34 55 76 34"}
            />
            <HorizontalLabelInput label="Address:" value={"123 Baker Street"} />
            <HorizontalLabelInput label="Birth Date:" value={"03/03/1976"} />
            <HorizontalLabelInput label="Weight:" value={"103 kg"} />
            <HorizontalLabelInput label="Height:" value={"187 cm"} />
            <HorizontalLabelInput label="Allergies:" value={"none"} />
            <HorizontalLabelInput label="Medication:" value={"none"} />
            <HorizontalLabelInput
              label="Treatment plan:"
              value={"sufficient rest and increase intake of fluids"}
            />
            <div className="security-message">
              {" "}
              This data is fully private never stored on servers.{" "}
              <a className="linkColor">Learn more</a>
            </div>
            <TButton className="btnStyle1">Sign using your tonomy DID</TButton>
          </div>
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
