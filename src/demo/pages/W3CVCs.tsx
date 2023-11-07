import React, { useState, useEffect, useContext } from "react";
import { TButton } from "../../common/atoms/TButton";
import userLogo from "../assets/user.png";
import VCBanner from "../assets/VC-banner.png";
import TextboxLayout from "../components/TextboxLayout";
import { randomString } from "@tonomy/tonomy-id-sdk";
import useErrorStore from "../../common/stores/errorStore";
import { AuthContext } from "../providers/AuthProvider";
import CodeSnippetPreview from "../components/CodeSnippetPreview";
import VerticalLinearStepper from "../components/VerticalProgressStep";
import W3VCIntro from "./W3VCs/W3VCIntro";
import { TH1, TH2 } from "../../common/atoms/THeadings";
import "./W3CVCs.css";
import SuccessSection from "../components/SuccessSection";

const snippetCode = `
// SignVcPage.jsx
const vc = await user.signVc("https://example.com/example-vc/1234", "NameAndDob", {
    name: "Joe Somebody",
    dob: new Date('1999-06-04')
});

const verifiedVc = await vc.verify();
`;
const steps = [
  {
    label: "Fetching sovereign signer and checking if the key is still valid",
  },
  {
    label: "Checking W3C Verifiable Credential data structure",
  },
  {
    label: "Signing data",
  },
];

export default function W3CVCs() {
  const [activeStep, setActiveStep] = useState(-1);
  const [progressValue, setProgressValue] = useState(0);
  const [success, setSuccess] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [name, setName] = useState("Johnathan Doe");
  const [phone, setPhone] = useState("+1 123-456-7890");
  const [address, setAddress] = useState("1234 Main St, New York, NY 10001");
  const [dob, setDob] = useState("1 March 1990");
  const [weight, setWeight] = useState("69 kg");
  const [height, setHeight] = useState("180 cm");
  const [allergies, setAllergies] = useState("None");
  const [medications, setMedications] = useState("None");
  const [treatment, setTreatment] = useState(
    "sufficient rest and increase intake of fluids"
  );
  const [loading, setLoading] = useState<boolean>(false);
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

  async function onSubmit() {
    try {
      setLoading(true);

      setActiveStep(0);
      setProgressValue(0);
      const data = {
        name,
        phone,
        address,
        dob,
        weight,
        height,
        allergies,
        medications,
        treatment,
      };

      const id = window.location.origin + "/medical-record#" + randomString(8);

      await setTimeout(() => {
        setActiveStep(1);
        setProgressValue(50);
      }, 200);
      await setTimeout(() => {
        setActiveStep(2);
        setProgressValue(100);
      }, 200);
      await user?.signVc(id, "MedicalRecord", data);

      setLoading(false);
    } catch (e) {
      setLoading(false);

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
      <W3VCIntro
        username={username}
        scrollToDemo={() => scrollToDemo("demoSection")}
        signout={signout}
        setActiveSection={setActiveSection}
      />
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
        <section id="VCdemoSection">
          <div className="formSection">
            <ul className="horizontal-list">
              <li>Appointment</li>
              <li>Messages</li>
              <li className="border-bottom-margin">
                <span></span>Results
              </li>
            </ul>
            <div className="clientSection">
              <h4 className="head">Client details</h4>

              <TextboxLayout label="Name:" value={name} onChange={setName} />
              <TextboxLayout
                label="Phone number:"
                value={phone}
                onChange={setPhone}
              />
              <TextboxLayout
                label="Address:"
                value={address}
                onChange={setAddress}
              />
              <TextboxLayout
                label="Birth Date:"
                value={dob}
                onChange={setDob}
              />
              <div className="row-container">
                <TextboxLayout
                  label="Weight:"
                  value={weight}
                  onChange={setWeight}
                />
                <TextboxLayout
                  label="Height:"
                  value={height}
                  onChange={setHeight}
                />
              </div>
              <TextboxLayout
                label="Allergies:"
                value={allergies}
                onChange={setAllergies}
              />
              <TextboxLayout
                label="Medication:"
                value={medications}
                onChange={setMedications}
              />
              <TextboxLayout
                label="Treatment plan:"
                value={treatment}
                onChange={setTreatment}
              />
              <div className="security-message">
                {" "}
                This data is fully private never stored on servers.{" "}
                <a className="linkColor">Learn more</a>
              </div>
              <div>
                <TButton
                  className="btnStyle1"
                  onClick={onSubmit}
                  disabled={loading}
                >
                  Sign using your tonomy DID
                </TButton>
              </div>
            </div>
            <VerticalLinearStepper
              activeStep={activeStep}
              steps={steps}
              progressValue={progressValue}
              onContinue={() => setSuccess(true)}
            />
          </div>
        </section>
      ) : (
        <SuccessSection
          message="you have successfully signed a document using Tonomy ID."
          labels={[
            "Education Diplomas",
            "Shipping and logistic events",
            "Tickets",
            "Certificates",
            "Legal contracts",
            "Travel Documents",
          ]}
          submit={() => {
            setProgressValue(0);
            setActiveStep(-1);
            setSuccess(false);
          }}
        />
      )}

      <CodeSnippetPreview
        snippetCode={snippetCode}
        documentationLink="https://docs.tonomy.foundation/start/usage/#sign-a-w3c-verifiable-credential"
      />
    </div>
  );
}
