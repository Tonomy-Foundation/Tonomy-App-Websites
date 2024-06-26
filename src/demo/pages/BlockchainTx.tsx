import React, { useEffect, useState, useContext } from "react";
import "./BlockchainTx.css";
import useErrorStore from "../../common/stores/errorStore";
import CodeSnippetPreview from "../components/CodeSnippetPreview";
import { AuthContext } from "../providers/AuthProvider";
import SignTransactionSendPayment from "./BlockchainTransaction/SignTransactionSendPayment";
import SignTransactionProgress from "./BlockchainTransaction/SignTransactionProgress";
import SignTransactionIntro from "./BlockchainTransaction/SignTransactionIntro";
import SignTransactionImagine from "./BlockchainTransaction/SignTransactionImagine";
import SignTransactionConfirmation from "./BlockchainTransaction/SignTransactionConfirmation";
import settings from "../../common/settings";

const snippetCode = `
// SignBlockchain.jsx
const trx = await user.signTransaction('eosio.token', 'transfer', {
  from: "me",
  to: "you",
  quantity: '1 DEMO',
  memo: 'test memo',
})
`;

export default function BlockchainTx() {
  const [activeStep, setActiveStep] = useState(-1);
  const [username, setUsername] = useState<string>("");
  const [progressValue, setProgressValue] = useState(0);
  const { user, signout } = useContext(AuthContext);
  const errorStore = useErrorStore();
  const [activeSection, setActiveSection] = useState("intro");
  const [success, setSuccess] = useState<boolean>(false);
  const [trxUrl, setTrxUrl] = useState<string | undefined>(undefined);
  const [balance, setBalance] = useState<number>(0);

  async function onRender() {
    try {
      const username = await user?.getUsername();

      if (!username) throw new Error("No username found");
      setUsername(username.getBaseUsername());
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

  const scrollToDemo = (sectionId: string) => {
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    if (isMobile) {
      window.scrollTo(0, 0);
    }
  }, [activeSection, isMobile]);

  return (
    <>
      {isMobile ? (
        <div className="mobile-main-container">
          {activeSection === "intro" && (
            <SignTransactionIntro
              username={username}
              scrollToDemo={() => scrollToDemo("demoSection")}
              signout={signout}
              setActiveSection={setActiveSection}
            />
          )}
          {activeSection === "imagine" && (
            <SignTransactionImagine
              setSuccess={setSuccess}
              setActiveSection={setActiveSection}
            />
          )}

          {!success ? (
            <>
              {activeSection === "sendPayment" && (
                <SignTransactionSendPayment
                  setActiveStep={setActiveStep}
                  setProgressValue={setProgressValue}
                  username={username}
                  setTrxUrl={setTrxUrl}
                  setActiveSection={setActiveSection}
                  setBalance={setBalance}
                  balance={balance}
                />
              )}
              {activeSection === "progress" && (
                <SignTransactionProgress
                  activeStep={activeStep}
                  progressValue={progressValue}
                  setSuccess={setSuccess}
                  setActiveSection={setActiveSection}
                />
              )}
            </>
          ) : (
            <>
              {activeSection === "confirmation" && (
                <SignTransactionConfirmation
                  trxUrl={trxUrl}
                  setSuccess={setSuccess}
                  setProgressValue={setProgressValue}
                  setActiveStep={setActiveStep}
                  balance={balance}
                  setActiveSection={setActiveSection}
                />
              )}
            </>
          )}
        </div>
      ) : (
        <div className="block-container">
          <SignTransactionIntro
            username={username}
            scrollToDemo={() => scrollToDemo("demoSection")}
            signout={signout}
          />
          <SignTransactionImagine />

          {!success ? (
            <>
              <SignTransactionSendPayment
                setActiveStep={setActiveStep}
                setProgressValue={setProgressValue}
                username={username}
                setTrxUrl={setTrxUrl}
                setBalance={setBalance}
                balance={balance}
              />

              <SignTransactionProgress
                activeStep={activeStep}
                progressValue={progressValue}
                setSuccess={setSuccess}
              />
            </>
          ) : (
            <SignTransactionConfirmation
              trxUrl={trxUrl}
              setSuccess={setSuccess}
              setProgressValue={setProgressValue}
              setActiveStep={setActiveStep}
              balance={balance}
            />
          )}
          <CodeSnippetPreview
            snippetCode={snippetCode}
            documentationLink={`${settings.config.documentationLink}/start/usage/#sign-a-blockchain-transaction`}
          />
        </div>
      )}
    </>
  );
}
