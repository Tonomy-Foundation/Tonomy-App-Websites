import React, { useEffect, useState } from "react";
import HttpsIcon from "@mui/icons-material/Https";

import {
  HeaderContainer,
  FeatureNameLabel,
  HowToUseLabel,
  HeaderTonomy,
  HeaderDescription,
  MainDescription,
  MainContainer,
  BalanceContainer,
  BalanceContainerTextLeft,
  BalanceContainerTextRight,
  FormContainer,
  FormHeaderContainer,
  FormHeaderContainerText,
  MakePayment,
  FormTextInput,
  FormSelectInput,
  SendPayment,
  CodeSnippetCombo,
  PageFooter,
  HeaderPictureContainer,
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
import Typography from "@mui/material/Typography";
import { Button, Link } from "@mui/material";

const eosioTokenContract = EosioTokenContract.Instance;

export default function BlockchainTx() {
  const user = useUserStore((state) => state.user);
  //const navigation = useNavigate();
  const errorStore = useErrorStore();
  const [transactionState, setTransactionState] = useState<
    "prepurchase" | "loading" | "purchased"
  >("prepurchase");
  const [trxUrl, setTrxUrl] = useState<string | undefined>(undefined);
  const [balance, setBalance] = useState<number | undefined>(undefined);

  async function onRender() {
    try {
      if (!user) {
        // navigation("/");
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
    <>
      <HeaderContainer>
        <HeaderPictureContainer></HeaderPictureContainer>
        <FeatureNameLabel>Feature Name: Sign Transaction</FeatureNameLabel>

        <HowToUseLabel>How to use :</HowToUseLabel>
        <HeaderTonomy>Tonomy ID</HeaderTonomy>
        {/* <HeaderTonomyID>Tonomy ID</HeaderTonomyID> */}
        <HeaderDescription>
          Tonomy ID utilizes a digital signatures and a distributed transaction
          protocol to safeguard your transactions and digital assets from
          unauthorized access or tampering.
        </HeaderDescription>

        <Link href="/Test">learn about the Antelope blockchain protocol </Link>
        <br />
        <br />
        <Button variant="outlined" size="large">
          Enter Demo
        </Button>
      </HeaderContainer>
      <MainDescription>
        Imagine, you find a perfect art piece. With a simple click, your
        promptly sends a secure transaction to the bank, where it is verified
        and recorded in your transaction history.
      </MainDescription>
      <MainContainer>
        <FormHeaderContainer>
          <BalanceContainer>
            <BalanceContainerTextLeft>Balance: </BalanceContainerTextLeft>
            <BalanceContainerTextRight>100 EUR</BalanceContainerTextRight>
          </BalanceContainer>
          <FormHeaderContainerText>Dashboard</FormHeaderContainerText>
          <FormHeaderContainerText>Exchange rate</FormHeaderContainerText>
          <FormHeaderContainerText>Transactions</FormHeaderContainerText>
        </FormHeaderContainer>
        <FormContainer>
          <MakePayment>Make a payment</MakePayment>
          <FormTextInput id="txtFrom" type="text"></FormTextInput>
          <FormTextInput id="txtAmount" type="text"></FormTextInput>
          <FormSelectInput id="cmbRecipient">
            <option>Code snippet</option>
            <option>Code snippet</option>
            <option>Code snippet</option>
            <option>Code snippet</option>
          </FormSelectInput>
          <FormTextInput id="txtDescription" type="text"></FormTextInput>

          <SendPayment>
            <HttpsIcon /> SEND PAYMENT
          </SendPayment>
        </FormContainer>
        <PageFooter>
          <p>View Documentation</p>
          <CodeSnippetCombo>
            <option>Code snippet</option>
          </CodeSnippetCombo>
        </PageFooter>
      </MainContainer>
    </>
  );
}
