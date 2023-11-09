import React, { useState, useContext } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { TH2 } from "../../../common/atoms/THeadings";
import TextboxLayout from "../../components/TextboxLayout";
import { TButton } from "../../../common/atoms/TButton";
import { randomString } from "@tonomy/tonomy-id-sdk";
import { AuthContext } from "../../providers/AuthProvider";
import useErrorStore from "../../../common/stores/errorStore";

export type W3VCSignDocumentProps = {
  username: string;
  setActiveStep: (step: number) => void;
  setProgressValue: (progressValue: number) => void;
  setActiveSection?: (section: string) => void;
};

const W3VCSignDocument = (props: W3VCSignDocumentProps) => {
  const { user } = useContext(AuthContext);
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
  const errorStore = useErrorStore();

  async function onSubmit() {
    try {
      setLoading(true);

      props.setActiveStep(0);
      props.setProgressValue(0);
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
        props.setActiveStep(1);
        props.setProgressValue(50);
      }, 200);
      await setTimeout(() => {
        props.setActiveStep(2);
        props.setProgressValue(100);
      }, 200);
      await user?.signVc(id, "MedicalRecord", data);

      setLoading(false);
      props?.setActiveSection?.("progress");
    } catch (e) {
      setLoading(false);

      errorStore.setError({ error: e, expected: false });
    }
  }

  return (
    <>
      <section>
        <div className="mobile-container mobile-view imagine-mobile">
          <div className="user-section" style={{ width: "30%" }}>
            <ArrowBackIosIcon
              className="user-logo"
              onClick={() => props?.setActiveSection?.("imagine")}
            />
          </div>
          <div
            className="mobile-logout-section"
            style={{
              justifyContent: "flex-start",
              width: "70%",
              fontSize: "0.7rem",
            }}
          >
            <TH2>Signing Documents</TH2>
          </div>
        </div>
        <section id="VCdemoSection">
          <div className="formSection">
            <ul className="web-view horizontal-list">
              <li>Appointment</li>
              <li>Messages</li>
              <li className="border-bottom-margin">
                <span></span>Results
              </li>
            </ul>

            <div className="mobile-view display-mobile-w3vc">
              <p>Sign and verify sensitive information with Tonomy ID </p>

              <p className="blue-text">
                The W3C Verifiable Credential standard help ensure trust and
                security when sharing sensitive and tamper-proof data
              </p>
            </div>
            <div className="clientSection">
              <h4 className="head web-view">Client details</h4>

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
                {/* TODO uncomment link */}
                {/* <a className="linkColor">Learn more</a> */}
              </div>
              <div>
                <TButton
                  className="btn-style"
                  onClick={() => onSubmit()}
                  disabled={loading}
                >
                  Sign using your tonomy DID
                </TButton>
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
};

export default W3VCSignDocument;
