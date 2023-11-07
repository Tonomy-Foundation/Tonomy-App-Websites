import React, { useState, useEffect, useContext } from "react";
import useErrorStore from "../../common/stores/errorStore";
import { AuthContext } from "../providers/AuthProvider";
import CodeSnippetPreview from "../components/CodeSnippetPreview";
import W3VCIntro from "./W3VCs/W3VCIntro";
import "./W3CVCs.css";
import W3VCSignDocument from "./W3VCs/W3VCSignDocument";
import W3VCImagine from "./W3VCs/W3VCImagine";
import W3VCProgress from "./W3VCs/W3VCProgress";
import W3VCConfirmation from "./W3VCs/W3VCConfirmation";

const snippetCode = `
// SignVcPage.jsx
const vc = await user.signVc("https://example.com/example-vc/1234", "NameAndDob", {
    name: "Joe Somebody",
    dob: new Date('1999-06-04')
});

const verifiedVc = await vc.verify();
`;

export default function W3CVCs() {
  const [activeStep, setActiveStep] = useState(-1);
  const [progressValue, setProgressValue] = useState(0);
  const [success, setSuccess] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const { user, signout } = useContext(AuthContext);
  const [activeSection, setActiveSection] = useState("intro");

  const errorStore = useErrorStore();

  async function onRender() {
    try {
      const username = await user?.getUsername();

      if (!username) throw new Error("No username found");
      setUsername(username.getBaseUsername());
    } catch (e) {
      errorStore.setError({ error: e, expected: false });
    }
  }

  useEffect(() => {
    onRender();
  }, []);
  console.log("success", success);

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
            <W3VCIntro
              username={username}
              scrollToDemo={() => scrollToDemo("demoSection")}
              signout={signout}
              setActiveSection={setActiveSection}
            />
          )}
          {activeSection === "imagine" && (
            <W3VCImagine
              setSuccess={setSuccess}
              setActiveSection={setActiveSection}
            />
          )}

          {!success ? (
            <>
              {activeSection === "signDocument" && (
                <W3VCSignDocument
                  setActiveStep={setActiveStep}
                  setProgressValue={setProgressValue}
                  username={username}
                  setActiveSection={setActiveSection}
                />
              )}
              {activeSection === "progress" && (
                <W3VCProgress
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
                <W3VCConfirmation
                  setSuccess={setSuccess}
                  setProgressValue={setProgressValue}
                  setActiveStep={setActiveStep}
                  setActiveSection={setActiveSection}
                />
              )}
            </>
          )}
        </div>
      ) : (
        <div className="blockConatiner">
          <W3VCIntro
            username={username}
            scrollToDemo={() => scrollToDemo("demoSection")}
            signout={signout}
            setActiveSection={setActiveSection}
          />
          <W3VCImagine setActiveSection={setActiveSection} />

          {!success ? (
            <>
              <W3VCSignDocument
                setActiveStep={setActiveStep}
                setProgressValue={setProgressValue}
                username={username}
                setActiveSection={setActiveSection}
              />
              <W3VCProgress
                activeStep={activeStep}
                progressValue={progressValue}
                setSuccess={setSuccess}
                setActiveSection={setActiveSection}
              />
            </>
          ) : (
            <>
              <W3VCConfirmation
                setSuccess={setSuccess}
                setProgressValue={setProgressValue}
                setActiveStep={setActiveStep}
                setActiveSection={setActiveSection}
              />
            </>
          )}
          <CodeSnippetPreview
            snippetCode={snippetCode}
            documentationLink="https://docs.tonomy.foundation/start/usage/#sign-a-w3c-verifiable-credential"
          />
        </div>
      )}
    </>
  );
}
