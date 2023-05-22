import React, { useState } from "react";
import TUserInfo from "../components/TUserInfo";
import { TH2, TP } from "../../common/atoms/THeadings";
import "@tonomy/tonomy-id-sdk/build/api/tonomy.css";
import { TButton } from "../../common/atoms/TButton";
import TImage from "../../common/atoms/TImage";
import connectionImage from "../assets/nft1.png";
import HighlightedPageView from "../components/TPageHighlighted";
import Ticket from "../assets/emojis/ticket.png";
import Handshake from "../assets/emojis/handshake.png";
import Money from "../assets/emojis/money.png";
import Vote from "../assets/emojis/vote.png";
import Cruise from "../assets/emojis/cruise.png";
import {
  ContainerStyle,
  PageIntroStyle,
  BoxContainer,
} from "../components/styles";
import "./BlockchainTx.css";

export default function BlockchainTx() {
  const [buy, setBuy] = useState(false);

  return (
    <ContainerStyle>
      <PageIntroStyle>
        <TUserInfo></TUserInfo>
        <TP className="text-header marginTop">
          Demo feature of how to use Tonomy ID to
        </TP>
        <TH2> Sign Blockchain Transactions</TH2>
        <TP className="text-header">
          Our demo website provides an opportunity to test signing a blockchain
          transaction process using Tonomy ID. Tonomy ID utilizes a standard
          protocol to safeguard your digital asset from any unauthorized access
          or tampering.{" "}
        </TP>
        <TP>
          In this scenario, imagine that you want to sign a blockchain
          transaction to verify your ownership and authorization of a digital
          asset.
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

        {!buy ? (
          <BoxContainer className="boxStyle1">
            <TH2>#85456</TH2>
            <div className="nftImageColumn">
              <div className="imgConatiner">
                <TImage
                  src={connectionImage}
                  alt="Connecting Phone-PC"
                  className="nftImage"
                />
                <div className="paddingTop">
                  <TP>Sale ID: #197387654094</TP>
                  <TP>Owned by: 948361751KIHF </TP>
                  <TP>Created by: ‘federation’</TP>
                  <TP>Blockchain: Tonomy Demo Network</TP>
                  <div className="marginTop">
                    <h4>Price</h4>
                    <TP>17.12 SYS (€1,950.53 DEMO ONLY )</TP>
                  </div>
                  <TButton
                    className="tbuttonstyle"
                    onClick={() => setBuy(!buy)}
                  >
                    BUY
                  </TButton>
                </div>
              </div>
            </div>
          </BoxContainer>
        ) : (
          <>
            <BoxContainer className="successBox">
              <div style={{ position: "relative" }}>
                <TH2>SUCCESS!</TH2>
                <TP className="centerAlign">You just "bought" a NFT</TP>
                <div className="nftImageColumn">
                  <TImage
                    src={connectionImage}
                    alt="Connecting Phone-PC"
                    className="nftImage nftImageCenter"
                  />
                </div>
                <TButton className="tryAgainbtn" onClick={() => setBuy(!buy)}>
                  Try Again
                </TButton>
              </div>
              <div className="btnDiv">
                <TButton className="blockchainBtn" onClick={() => setBuy(!buy)}>
                  See it on the blockchain{" "}
                  <a className="blockchainLink"> here</a>
                </TButton>
              </div>
            </BoxContainer>
          </>
        )}
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
        githubLink="https://github.com/Tonomy-Foundation/Tonomy-App-Websites/blob/development/src/demo/pages/blockchainTx.tsx"
      />
    </ContainerStyle>
  );
}
