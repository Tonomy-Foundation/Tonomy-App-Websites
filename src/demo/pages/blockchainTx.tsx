import MainLayout from "../layout/main";
import TUserInfo from "../components/TUserInfo";
import "./blockchainTx.css";
import React, { useEffect, useState } from "react";
import { api, ExternalUser, SdkError, SdkErrors } from "@tonomy/tonomy-id-sdk";
import { TH2, TH3, TP } from "../../sso/components/THeadings";
import { Highlighter } from "rc-highlight";
import "@tonomy/tonomy-id-sdk/build/api/tonomy.css";
import { useNavigate } from "react-router-dom";
import { TButton } from "../../sso/components/Tbutton";
import TImage from "../../sso/components/TImage";
import connectionImage from "../assets/tonomy/nft1.png";
import { TContainedButton } from "../../sso/components/TContainedButton";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

export default function BlockchainTx() {
  const [buy, setBuy] = useState(false);

  return (
    <MainLayout
      content={
        <div className="container">
          <div className="intro">
            <TUserInfo></TUserInfo>
            <TP className="text-header marginTop">
              Demo feature of how to use Tonomy ID to
            </TP>
            <TH2> Sign Blockchain Transactions</TH2>
            <TP className="text-header">
              Our demo website provides an opportunity to test signing a
              blockchain transaction process using Tonomy ID. Tonomy ID utilizes
              a standard protocol to safeguard your digital asset from any
              unauthorized access or tampering.{" "}
            </TP>
            <TP>
              In this scenario, imagine that you want to sign a blockchain
              transaction to verify your ownership and authorization of a
              digital asset.
            </TP>
            <TP className="list">
              Other examples of how to use credentials with Tonomy ID include:
              <ul>
                <li>employment contracts</li>
                <li>shipping and logistics</li>
                <li>events payments and payment metadata</li>
                <li>votes event</li>
                <li>ticketsand much more!</li>
              </ul>
            </TP>
            <div className="example-container">
              {!buy ? (
                <>
                  <TH2>#85456</TH2>
                  <div className="nftImageColumn">
                    <TP>
                      <TImage
                        src={connectionImage}
                        alt="Connecting Phone-PC"
                        className="nftImage"
                      />
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
                    </TP>
                  </div>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
          <div className="docs">
            <TH2 className="title">Code Snippet</TH2>
            <div className="highlighter">
              <Highlighter>
                {`
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
              </Highlighter>
            </div>

            <a
              href="https://docs.tonomy.foundation"
              className="link"
              target="_blank"
              rel="noreferrer"
            >
              View Documentation
            </a>
            <a
              href="https://github.com/Tonomy-Foundation/Tonomy-App-Websites/blob/master/src/demo/pages/Home.tsx"
              className="link footer"
              target="_blank"
              rel="noreferrer"
            >
              View on GitHub
            </a>
          </div>
        </div>
      }
    ></MainLayout>
  );
}
