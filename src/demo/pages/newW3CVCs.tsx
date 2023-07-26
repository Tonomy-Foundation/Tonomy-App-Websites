import React, { useState } from "react";
import { TH2, TP } from "../../common/atoms/THeadings";
import { TButton } from "../../common/atoms/TButton";
import userLogo from "../assets/user.png";
import VCBanner from "../assets/VC-banner.png";
import TextboxLayout from "../components/TextboxLayout";
import { useUserStore } from "../../common/stores/user.store";
import { randomString, api } from "@tonomy/tonomy-id-sdk";
import useErrorStore from "../../common/stores/errorStore";
import TModal from "../../common/molecules/TModal";
import { VerifiableCredential } from "@tonomy/tonomy-id-sdk/build/sdk/types/sdk/util/ssi/vc";
import { VerifiedCredential } from "@tonomy/did-jwt-vc";
import TIcon from "../../common/atoms/TIcon";
import CodeSnippetPreview from "../components/CodeSnippetPreview";
import "./newW3CVCs.css";

export default function W3CVCs() {
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
  const [vc, setVc] = useState<VerifiableCredential>();
  const [verifiedVc, setVerifiedVc] = useState<VerifiedCredential>();
  const [verifiedLoading, setVerifiedLoading] = useState(false);

  let user = useUserStore((state) => state.user);
  const errorStore = useErrorStore();

  async function onSubmit() {
    try {
      if (!user) {
        // TODO: This is a hack to get the user. We should have a better way to get the user.
        user = await api.ExternalUser.getUser();
      }

      setVerifiedVc(undefined);
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

      const vc = await user.signVc(id, "MedicalRecord", data);

      setVc(vc);
    } catch (e) {
      errorStore.setError({ error: e, expected: false });
    }
  }

  async function onVerify() {
    try {
      setVerifiedLoading(true);
      if (!vc) throw new Error("No VC to verify");
      const verified = await vc.verify();

      if (!verified || !verified.verified) {
        throw new Error("VC not verified");
      }

      setVerifiedVc(verified);
      setVerifiedLoading(false);
    } catch (e) {
      errorStore.setError({ error: e, expected: false });
      setVerifiedLoading(false);
    }
  }

  const onCloseModal = async () => {
    setVc(undefined);
    setVerifiedVc(undefined);
    setVerifiedLoading(false);
  };

  return (
    <>
      <TModal
        onPress={onCloseModal}
        icon="block"
        iconColor="success"
        title="Success!"
        buttonLabel="OK"
        open={vc !== undefined}
      >
        <>
          <TH2>Medical record created</TH2>
          <TP>Your record can now be taken and verified anywhere!</TP>
          {!verifiedVc && (
            <TButton variant="outlined" onClick={onVerify}>
              Verify Document
            </TButton>
          )}
          {verifiedVc && (
            <div>
              <TIcon icon="verified" color="success" />
              <div>Verified</div>
            </div>
          )}
        </>
      </TModal>
      <div className="containerVC">
        <div className="userSectionVC">
          <p className="leftText sign-dcoument">Feature Name: Sign Document</p>
          <p className="userLogoVC">
            {<img src={userLogo} alt="userLogo" />}
            <span>Jack Tanner</span>
          </p>
        </div>
        <div className="gridView">
          <div className="leftSection">
            <div className="headSection">
              <p className="howText">How to use:</p>
              <p className="tonomy-head">
                Tonomy <span className="tonomy-d">ID</span>
              </p>
            </div>
            <p className="paraDetail">
              Sign and verify sensitive information with Tonomy ID. The W3C
              Verifiable Credential standard can help ensure trust and security
              when sharing sensitive and tamper-proof data.
            </p>
            <a href="#" className="paraLink">
              Learn about the W3C Verifiable Credentials {`->`}
            </a>
            <p className="demoLink">Enter Demo</p>
          </div>
          <div className="rightSection">
            <img src={VCBanner} alt="banner-image" className="bannerImg" />
          </div>
        </div>
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
          <TextboxLayout label="Birth Date:" value={dob} onChange={setDob} />
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
            <TButton className="btnStyle1" onClick={onSubmit}>
              Sign using your tonomy DID
            </TButton>
          </div>
        </div>
        <CodeSnippetPreview
          value={`
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
      </div>
    </>
  );
}
