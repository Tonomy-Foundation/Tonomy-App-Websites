import React, { useEffect, useState } from "react";
import { TH2, TP } from "../../common/atoms/THeadings";
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
import { useUserStore } from "../../common/stores/user.store";
import { useNavigate } from "react-router-dom";
import useErrorStore from "../../common/stores/errorStore";
import {
  AccountType,
  TonomyUsername,
  getAccountNameFromUsername,
  EosioTokenContract,
} from "@tonomy/tonomy-id-sdk";
import settings from "../../common/settings";

const eosioTokenContract = EosioTokenContract.Instance;

export default function BlockchainTx() {
  const user = useUserStore((state) => state.user);
  const navigation = useNavigate();
  const errorStore = useErrorStore();
  const [transactionState, setTransactionState] = useState<
    "prepurchase" | "loading" | "purchased"
  >("prepurchase");
  const [trxUrl, setTrxUrl] = useState<string | undefined>(undefined);
  const [balance, setBalance] = useState<number | undefined>(undefined);

  async function onRender() {
    try {
      if (!user) {
        navigation("/");
        return;
      }

      const accountName = await user.getAccountName();
      const accountBalance = await eosioTokenContract.getBalance(accountName);

      setBalance(accountBalance);
      if (accountBalance > 10) return;
      await user.signTransaction("eosio.token", "selfissue", {
        to: accountName,
        quantity: "10 SYS",
        memo: "test",
      });
    } catch (e) {
      errorStore.setError({ error: e, expected: false });
    }
  }

  let rendered = false;

  useEffect(() => {
    // Prevent useEffect from running twice which causes a race condition of the
    // async selfissue() transaction
    if (!rendered) {
      rendered = true;
    } else {
      return;
    }

    onRender();
  }, []);

  async function onBuy() {
    try {
      setTransactionState("loading");

      if (!user) throw new Error("User not logged in");
      const from = await user.getAccountName();
      const toUsername = TonomyUsername.fromUsername(
        "cheesecakeophobia",
        AccountType.PERSON,
        settings.config.accountSuffix
      );
      const to = await getAccountNameFromUsername(toUsername);

      const trx = await user.signTransaction("eosio.token", "transfer", {
        from,
        to,
        quantity: "1 SYS",
        memo: "test",
      });

      let url =
        "https://local.bloks.io/transaction/" +
        trx.transaction_id +
        "?nodeUrl=";

      url += settings.isProduction()
        ? settings.config.blockchainUrl
        : "http://localhost:8888";

      setTrxUrl(url);
      setTransactionState("purchased");
    } catch (e) {
      errorStore.setError({ error: e, expected: false });
    }
  }

  return (
    <ContainerStyle>
      <PageIntroStyle>
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

        {transactionState !== "purchased" ? (
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
                    <h4 style={{ textAlign: "left" }}>Price</h4>
                    <TP>17.12 SYS (€1,950.53 DEMO ONLY )</TP>
                  </div>
                  <TButton
                    disabled={transactionState === "loading"}
                    className="tbuttonstyle"
                    onClick={() => onBuy()}
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
                <TButton
                  className="tryAgainbtn"
                  onClick={() => setTransactionState("prepurchase")}
                >
                  Try Again
                </TButton>
              </div>
              <div className="btnDiv">
                <TButton className="blockchainBtn">
                  See it on the blockchain{" "}
                  <a
                    className="blockchainLink"
                    target="_blank"
                    href={trxUrl}
                    rel="noreferrer"
                  >
                    here
                  </a>
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
      />
    </ContainerStyle>
  );
}
