import React, { useState } from "react";
import TUserInfo from "../components/TUserInfo";
import { TH2, TP } from "../../common/atoms/THeadings";
import "@tonomy/tonomy-id-sdk/build/api/tonomy.css";
import { TButton } from "../../common/atoms/TButton";
import TImage from "../../common/atoms/TImage";
import connectionImage from "../assets/nft1.png";
import HighlightedPageView from "../components/TPageHighlighted";

export default function BlockchainTx() {
  const [buy, setBuy] = useState(false);

  return (
    <div className="container">
      <div className="pageIntro">
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
    </div>
  );
}
