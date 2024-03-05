import React, { useState, useContext, useEffect } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { TH1, TH2 } from "../../../common/atoms/THeadings";
import TextboxLayout from "../../components/TextboxLayout";
import HttpsOutlinedIcon from "@mui/icons-material/HttpsOutlined";
import {
  MainContainer,
  FormContainer,
  FormHeaderContainer,
} from "../../components/styles";
import { AuthContext } from "../../providers/AuthProvider";
import {
  AccountType,
  TonomyUsername,
  getAccountNameFromUsername,
  DemoTokenContract,
  getSettings,
} from "@tonomy/tonomy-id-sdk";
import useErrorStore from "../../../common/stores/errorStore";
import settings from "../../../common/settings";

const env = settings.env || "development";

const demoTokenContract = DemoTokenContract.Instance;

export type SignTransactionSendPaymentProps = {
  username: string;
  setActiveStep: (step: number) => void;
  setProgressValue: (progressValue: number) => void;
  setTrxUrl: (url: string) => void;
  setActiveSection?: (section: string) => void;
  balance: number;
  setBalance: (balance: number) => void;
};

const SignTransactionSendPayment = (props: SignTransactionSendPaymentProps) => {
  const { user } = useContext(AuthContext);
  const [recipient, setRecipient] = useState<string>("cheesecakeophobia");
  const errorStore = useErrorStore();
  const [transactionState, setTransactionState] = useState<
    "prepurchase" | "loading" | "purchased" | "getAmount"
  >("prepurchase");
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState<string>(
    "Art print from MONA gallery"
  );

  async function onRender() {
    try {
      const accountName = await user?.getAccountName();

      if (accountName) {
        setTransactionState("loading");
        let accountBalance = await demoTokenContract.getBalance(accountName);

        console.log("accountBalance", accountBalance);
        props.setBalance(accountBalance);
        setAmount(Math.floor(accountBalance / 2));

        if (accountBalance > 10) {
          setTransactionState("getAmount");
          return;
        }

        await user?.signTransaction(
          TonomyUsername.fromUsername(
            "demo",
            AccountType.APP,
            getSettings().accountSuffix
          ),
          "selfissue",
          {
            to: accountName,
            quantity: "10 LEOS",
            memo: "test",
          }
        );
        accountBalance = accountBalance + 10;
        props.setBalance(accountBalance);
        setAmount(Math.floor(accountBalance / 2));
        setTransactionState("getAmount");
      }
    } catch (e) {
      console.log("error", e);
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

  function onChangeAmount(value: string) {
    let newValue = value.replace(/[^0-9]/g, "");

    if (newValue.length === 0) newValue = "0";

    setAmount(parseInt(newValue));
  }

  async function onBuy() {
    try {
      if (!user) throw new Error("User not logged in");
      if (props?.setActiveSection) props.setActiveSection("progress");
      setTransactionState("loading");
      props.setActiveStep(0);
      props.setProgressValue(20);

      const toUsername = TonomyUsername.fromUsername(
        recipient,
        AccountType.PERSON,
        settings.config.accountSuffix
      );
      const to = await getAccountNameFromUsername(toUsername);

      await setTimeout(() => {
        props.setActiveStep(1);
        props.setProgressValue(40);
      }, 200);
      const trx = await user?.signTransaction(
        TonomyUsername.fromUsername(
          "demo",
          AccountType.APP,
          getSettings().accountSuffix
        ),
        "transfer",
        {
          from: await user.getAccountName(),
          to,
          quantity: amount + " LEOS",
          memo: "test",
        }
      );

      const updateBalance = props.balance - amount;

      props.setBalance(updateBalance);
      props.setActiveStep(2);
      props.setProgressValue(60);
      let url =
        "https://local.bloks.io/transaction/" +
        trx?.transaction_id +
        "?nodeUrl=";

      url += settings.isProduction()
        ? settings.config.blockchainUrl
        : "http://localhost:8888";

      await setTimeout(() => {
        props.setActiveStep(3);
        props.setProgressValue(80);
      }, 500);

      await setTimeout(() => {
        props.setActiveStep(4);
        props.setProgressValue(100);
        props.setTrxUrl(url);
        setTransactionState("purchased");
      }, 1000);
    } catch (e) {
      errorStore.setError({ error: e, expected: false });
    }
  }

  return (
    <>
      <section>
        <div className="mobile-container mobile-view imagine-mobile">
          <div className="user-section" style={{ width: "40%" }}>
            <ArrowBackIosIcon
              className="user-logo"
              onClick={() => props?.setActiveSection?.("imagine")}
            />
          </div>
          <div
            className="mobile-logout-section"
            style={{ justifyContent: "flex-start" }}
          >
            <TH2>Payment</TH2>
          </div>
        </div>
        <MainContainer>
          <div className="web-view " id="demoSection">
            <FormHeaderContainer>
              <div
                className="display-balance"
                style={
                  env === "staging"
                    ? {
                        backgroundColor:
                          "linear-gradient(180deg,#e8f8fc 0%,var(--primary) 100%)",
                      }
                    : {
                        backgroundColor: "var(--primary)",
                      }
                }
              >
                <p
                  className="balance-container-text-left"
                  style={
                    env === "staging"
                      ? {
                          color: "var(--accent)",
                        }
                      : {
                          color: "var(--white)",
                        }
                  }
                >
                  Balance:{" "}
                </p>
                <p
                  className="balance-container-text-right"
                  style={
                    env === "staging"
                      ? {
                          color: "var(--accent)",
                        }
                      : {
                          color: "var(--white)",
                        }
                  }
                >
                  {props.balance} EUR
                </p>
              </div>
              <p className="form-header-container-text">Dashboard</p>
              <p className="form-header-container-text">Exchange rate</p>
              <p className="form-header-container-text transa-bottom-margin">
                <span></span>Transactions
              </p>
            </FormHeaderContainer>
          </div>

          <div className="mobile-view display-mobile-balance">
            <TH1>Your Balance</TH1>
            <p>€{props.balance} EUR</p>
          </div>
          <FormContainer>
            <p className="make-payment web-view">Make a payment</p>
            <TextboxLayout label="From:" value={props.username} />
            <div className="input-container">
              <input
                type="number"
                className="transparent-textbox"
                id="inputField"
                value={amount}
                onChange={(e) => onChangeAmount(e.target.value)}
              />
              <label htmlFor="inputField" className="textbox-label">
                Balance:
              </label>
            </div>
            <div className="input-container">
              <select
                className="transparent-textbox"
                value={recipient}
                onChange={(e) => {
                  setRecipient(e.target.value);
                }}
              >
                <option value="lovesboost">lovesboost</option>
                <option value="sweetkristy">sweetkristy</option>
                <option value="cheesecakeophobia">cheesecakeophobia</option>
                <option value="ultimateBeast">ultimateBeast</option>
                <option value="tomtom">tomtom</option>
                <option value="readingpro">readingpro</option>
              </select>
              <label className="textbox-label">Recipient:</label>
            </div>

            <TextboxLayout
              label="Description:"
              value={description}
              onChange={setDescription}
            />
            <div>
              <button
                className="payment-btn btn-style"
                onClick={() => onBuy()}
                disabled={transactionState === "loading"}
              >
                <HttpsOutlinedIcon /> Send Payment
              </button>
            </div>
          </FormContainer>
        </MainContainer>
      </section>
    </>
  );
};

export default SignTransactionSendPayment;
