import React, { useEffect, useState } from "react";
import HttpsIcon from "@mui/icons-material/Https";
import MobileScreen from "/Group_567_1.png";

import {
  HeaderContainer,
  HeaderTonomy,
  MainDescription,
  MainContainer,
  BalanceContainer,
  FormContainer,
  FormHeaderContainer,
  TransactionButton,
  CodeSnippetCombo,
  PageFooter,
  HeaderPictureContainer,
  FormInput,
  CircleContainer,
} from "../components/styles";
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
import {
  Box,
  Button,
  LinearProgress,
  Link,
  Paper,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { TH1, TH2, TH4 } from "../../common/atoms/THeadings";

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
    label: "Confirming network",
  },
  {
    label: "Transacting consensus on the network",
  },
];

export default function BlockchainTx() {
  const user = useUserStore((state) => state.user);
  //const navigation = useNavigate();
  const errorStore = useErrorStore();
  const [transactionState, setTransactionState] = useState<
    "prepurchase" | "loading" | "purchased"
  >("prepurchase");
  const [trxUrl, setTrxUrl] = useState<string | undefined>(undefined);
  const [balance, setBalance] = useState<number | undefined>(undefined);
  const [paymentDone, setBpeymentDone] = useState<boolean | undefined>(true);

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

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

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
        <TH1>Feature Name: Sign Transaction</TH1>

        <TH1 className="how-to-use-label">How to use :</TH1>
        <HeaderTonomy>Tonomy ID</HeaderTonomy>
        <TH2 className="header-description">
          Tonomy ID utilizes a digital signatures and a distributed transaction
          protocol to safeguard your transactions and digital assets from
          unauthorized access or tampering.
        </TH2>

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
      {paymentDone ? (
        <MainContainer>
          <FormHeaderContainer>
            <BalanceContainer>
              <p className="balance-container-text-left">Balance: </p>
              <p className="balance-container-text-right">100 EUR</p>
            </BalanceContainer>
            <p className="form-header-container-text">Dashboard</p>
            <p className="form-header-container-text">Exchange rate</p>
            <p className="form-header-container-text">Transactions</p>
          </FormHeaderContainer>
          <FormContainer>
            <p className="make-payment">Make a payment</p>

            <FormInput>
              <div>
                <label>From:</label>

                <label>rabbithole20222</label>
              </div>
              <input id="txtAmount" type="text" />
            </FormInput>

            <FormInput>
              <div>
                <label>Amount: </label>

                <label>EUR 90</label>
              </div>
              <input id="txtAmount" type="text" />
            </FormInput>

            <FormInput>
              <div>
                <label>Recipient: </label>

                <label>DigitalWarren1122</label>
              </div>
              <select id="cmbRecipient">
                <option>Code snippet</option>
                <option>Code snippet</option>
                <option>Code snippet</option>
                <option>Code snippet</option>
              </select>
            </FormInput>

            <FormInput>
              <div>
                <label>Description: </label>

                <label>Art print from MONA gallery</label>
              </div>
              <input id="txtAmount" type="text" />
            </FormInput>

            <TransactionButton
              onClick={(e) => {
                setBpeymentDone(false);
              }}
            >
              <HttpsIcon /> SEND PAYMENT
            </TransactionButton>
          </FormContainer>
          <Box sx={{ m: -2 }}> </Box>
          <Box
            sx={{
              maxWidth: 780,
              backgroundColor: "white",
              mt: 4,
              mr: "auto",
              ml: "auto",
              borderRadius: 3,
              p: 4,
            }}
          >
            <LinearProgress
              variant="determinate"
              value={(100 / steps.length) * activeStep}
              sx={{ mb: 4 }}
            />
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel>{step.label}</StepLabel>
                  <StepContent>
                    <Box sx={{ mb: 2 }}>
                      <div>
                        <Button
                          variant="contained"
                          onClick={handleNext}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          {index === steps.length - 1 ? "Finish" : "Continue"}
                        </Button>
                        <Button
                          disabled={index === 0}
                          onClick={handleBack}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Back
                        </Button>
                      </div>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
            {activeStep === steps.length && (
              <Paper square elevation={0} sx={{ p: 3 }}>
                <Typography>
                  All steps completed - you&apos;re finished
                </Typography>
                <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                  Reset
                </Button>
              </Paper>
            )}
          </Box>
        </MainContainer>
      ) : (
        <MainContainer>
          <Box
            sx={{
              pt: 2,
              pb: 10,
            }}
          >
            <TH4 className="Successfully-signed">Congratulations</TH4>
            <TH4 className="Successfully-signed">
              you have successfully signed a blockchain transaction using Tonomy
              ID.
            </TH4>
          </Box>
          <CircleContainer className="Circle-insurance-claims">
            Insurance claims
          </CircleContainer>
          <CircleContainer className="Circle-shipping-logistic-events">
            Shipping and logistic events
          </CircleContainer>
          <CircleContainer className="Circle-games">Games</CircleContainer>
          <CircleContainer className="Circle-ntfs">NFTs</CircleContainer>
          <CircleContainer className="Circle-accounting-and-defi">
            Accounting and Defi
          </CircleContainer>
          <CircleContainer className="Circle-votes">Votes</CircleContainer>

          <Box sx={{ display: "grid", mt: 32 }}>
            <img
              src={MobileScreen}
              alt="mobile-screen"
              className="Mobile-screen"
            />
            <TransactionButton>TRY SIGNING A document AGAIN</TransactionButton>
            <TH4 className="set-blockchain">
              See it on the blockchain <a href="/">here</a>
            </TH4>
          </Box>
        </MainContainer>
      )}
      <PageFooter>
        <p>View Documentation</p>
        <CodeSnippetCombo>
          <option>Code snippet</option>
        </CodeSnippetCombo>
      </PageFooter>
    </>
  );
}
