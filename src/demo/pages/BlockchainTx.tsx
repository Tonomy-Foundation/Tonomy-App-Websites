import React, { useEffect, useState, useContext } from "react";
import HttpsOutlinedIcon from "@mui/icons-material/HttpsOutlined";
import MobileScreen from "../assets/Group_567_1.png";
import {
  HeaderTonomy,
  MainContainer,
  FormContainer,
  FormHeaderContainer,
  TransactionButton,
  CircleContainer,
} from "../components/styles";
import userLogo from "../assets/user.png";
import "./BlockchainTx.css";
import { useUserStore } from "../../common/stores/user.store";
import useErrorStore from "../../common/stores/errorStore";
import {
  AccountType,
  TonomyUsername,
  getAccountNameFromUsername,
  EosioTokenContract,
} from "@tonomy/tonomy-id-sdk";
import settings from "../../common/settings";
import { Box } from "@mui/material";
import { TH1, TH2, TH4 } from "../../common/atoms/THeadings";
import VerticalLinearStepper from "../components/VerticalProgressStep";
import SignBanner from "../assets/sign-transaction.png";
import TextboxLayout from "../components/TextboxLayout";
import { TButton } from "../../common/atoms/TButton";
import CodeSnippetPreview from "../components/CodeSnippetPreview";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import SuccessSection from "../components/SuccessSection";

const snippetCode = `
// SignBlockchain.jsx
const trx = await user.signTransaction('eosio.token', 'transfer', {
  from: "me",
  to: "you",
  quantity: '1 SYS',
  memo: 'test memo',
})
`;
const eosioTokenContract = EosioTokenContract.Instance;

const steps = [
  {
    label: "Fetching sovereign signer and checking if the key is still valid",
  },
  {
    label: "Signing transaction",
  },
  {
    label: "Broadcasting to the Blockchain network",
  },
  {
    label: "Confirmed by receiving node",
  },
  {
    label: "Transaction consensus on all nodes in the network",
  },
];

export default function BlockchainTx() {
  const [activeStep, setActiveStep] = useState(-1);
  const [username, setUsername] = useState<string>("");
  const [progressValue, setProgressValue] = useState(0);
  const { user } = useContext(AuthContext);
  const navigation = useNavigate();
  const errorStore = useErrorStore();
  const [transactionState, setTransactionState] = useState<
    "prepurchase" | "loading" | "purchased"
  >("prepurchase");
  const [trxUrl, setTrxUrl] = useState<string | undefined>(undefined);
  const [balance, setBalance] = useState<number | undefined>(undefined);
  const [from, setFrom] = useState<string>("rabbithole20222");
  const [recipient, setRecipient] = useState<string>("DigitalWarren1122");
  const [success, setSuccess] = useState<boolean>(false);

  const [description, setDescription] = useState<string>(
    "Art print from MONA gallery"
  );

  async function onRender() {
    try {
      const username = await user?.getUsername();

      if (!username) throw new Error("No username found");
      setUsername(username.getBaseUsername());
      const accountName = await user?.getAccountName();

      if (accountName) {
        const accountBalance = await eosioTokenContract.getBalance(accountName);

        setBalance(accountBalance);
        if (accountBalance > 10) return;
        await user?.signTransaction("eosio.token", "selfissue", {
          to: accountName,
          quantity: "10 SYS",
          memo: "test",
        });
      }
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
      const from = await user?.getAccountName();
      const toUsername = TonomyUsername.fromUsername(
        "cheesecakeophobia",
        AccountType.PERSON,
        settings.config.accountSuffix
      );
      const to = await getAccountNameFromUsername(toUsername);

      const trx = await user?.signTransaction("eosio.token", "transfer", {
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

      setActiveStep(3);
      setProgressValue(80);

      setTimeout(() => {
        setActiveStep(4);
        setProgressValue(100);
      }, 3000);

      setTrxUrl(url);
      setTransactionState("purchased");
    } catch (e) {
      errorStore.setError({ error: e, expected: false });
    }
  }

  const scrollToDemo = (sectionId: string) => {
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="blockConatiner">
      <div className="header-container">
        <p className="leftText sign-dcoument">Feature Name: Sign Transaction</p>
        <p className="userLogoVC">
          {<img src={userLogo} alt="userLogo" />}
          <span>{username}</span>
        </p>
        {/* <div className="header-image" /> */}
        <img src={SignBanner} alt="banner-image" className="header-image" />

        <TH1 className="how-to-use-label">How to use :</TH1>
        <HeaderTonomy>Tonomy ID</HeaderTonomy>
        <TH2 className="header-description">
          Tonomy ID utilizes a digital signatures and a distributed transaction
          protocol to safeguard your transactions and digital assets from
          unauthorized access or tampering.
        </TH2>
        <a
          href="https://docs.eosnetwork.com/"
          target="_blank"
          className="paraLink"
          rel="noreferrer"
        >
          Learn about the Antelope blockchain protocol{`->`}
        </a>

        <button
          className="demoLink"
          onClick={() => scrollToDemo("demoSection")}
        >
          Enter Demo
        </button>
      </div>
      <div className="paraSection">
        <p className="imagine">Imagine,</p>
        <p className="paralines">
          {`you go to the doctor's office for a checkup. While waiting, your
          Tonomy ID notifies you that Dr. Smith wants access to your medical
          files. With just one click, you can grant access to the files while
          waiting for the doctor to arrive.`}
        </p>
      </div>
      {!success ? (
        <section id="demoSection">
          <MainContainer>
            <FormHeaderContainer>
              <div className="blanceDiv">
                <p className="balance-container-text-left">Balance: </p>
                <p className="balance-container-text-right">100 EUR</p>
              </div>
              <p className="form-header-container-text">Dashboard</p>
              <p className="form-header-container-text">Exchange rate</p>
              <p className="form-header-container-text transa-bottom-margin">
                <span></span>Transactions
              </p>
            </FormHeaderContainer>
            <FormContainer>
              <p className="make-payment">Make a payment</p>
              <TextboxLayout label="From:" value={from} onChange={setFrom} />
              <div className="input-container">
                <input
                  type="number"
                  className="transparent-textbox"
                  id="inputField"
                  value={balance}
                  onChange={(e) => {
                    const newValue =
                      e.target.value !== ""
                        ? parseInt(e.target.value)
                        : undefined;

                    setBalance(newValue);
                  }}
                />
                <label htmlFor="inputField" className="textbox-label">
                  Balance
                </label>
              </div>
              <TextboxLayout
                label="Recipient"
                value={recipient}
                onChange={setRecipient}
              />
              <TextboxLayout
                label="Description"
                value={description}
                onChange={setDescription}
              />
              <div>
                <TButton
                  className="btnPayment btnStyle1 "
                  onClick={() => onBuy()}
                  disabled={
                    progressValue > 0 && progressValue <= 100 ? true : false
                  }
                >
                  <HttpsOutlinedIcon /> Send Payment
                </TButton>
              </div>
            </FormContainer>
            <div style={{ marginTop: "1.5rem" }}>
              <VerticalLinearStepper
                activeStep={activeStep}
                steps={steps}
                progressValue={progressValue}
                onContinue={() => setSuccess(true)}
              />
            </div>
          </MainContainer>
        </section>
      ) : (
        <SuccessSection
          message="you have successfully signed a blockchain transaction using Tonomy ID."
          labels={[
            "Insurance claims",
            "Shipping and logistic events",
            "Games",
            "NFTs",
            "Accounting and Defi",
            "Votes",
          ]}
          submit={() => {
            setProgressValue(0);
            setActiveStep(-1);
            setSuccess(false);
          }}
          url={trxUrl}
        />
      )}
      <CodeSnippetPreview
        snippetCode={snippetCode}
        documentationLink="https://docs.tonomy.foundation/start/usage/#sign-a-blockchain-transaction"
      />
    </div>
  );
}
