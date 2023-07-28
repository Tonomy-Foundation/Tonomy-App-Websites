import React, { useState } from "react";
import { TH2, TP } from "../../common/atoms/THeadings";
import { TButton } from "../../common/atoms/TButton";
import {
  ContainerStyle,
  PageIntroStyle,
  BoxContainer,
} from "../components/styles";
import HighlightedPageView from "../components/TPageHighlighted";
import HorizontalLabelInput from "../components/HorizontalLabelInput";
import TImage from "../../common/atoms/TImage";
import Ticket from "../assets/emojis/ticket.png";
import Handshake from "../assets/emojis/handshake.png";
import Money from "../assets/emojis/money.png";
import Vote from "../assets/emojis/vote.png";
import Cruise from "../assets/emojis/cruise.png";
import "./W3CVCs.css";
import { useUserStore } from "../../common/stores/user.store";
import { randomString, api } from "@tonomy/tonomy-id-sdk";
import useErrorStore from "../../common/stores/errorStore";
import TModal from "../../common/molecules/TModal";
import { VerifiableCredential } from "@tonomy/tonomy-id-sdk/build/sdk/types/sdk/util/ssi/vc";
import { VerifiedCredential } from "@tonomy/did-jwt-vc";
import TIcon from "../../common/atoms/TIcon";

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
      <ContainerStyle>
        <PageIntroStyle>
          <TP className="text-header marginTop">
            Demo feature of how to use Tonomy ID to
          </TP>
          <TH2> Signing Verifiable Credentials</TH2>
          <TP className="text-header">
            By digitally signing the medical record, you can help protect it
            from unauthorized access and tampering, while also providing a
            traceable record of who has accessed the information. <br /> Whether
            you're a medical professional or someone who needs to sign and
            verify sensitive information, the W3C verifiable credential standard
            can help ensure trust and security in digital transactions.
          </TP>
          <TP>
            Below we will illustrate the process of signing verifiable
            credentials on our demo website.
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
          <BoxContainer className="clientBox">
            <TH2>Client details</TH2>
            <div className="formView marginTop">
              <HorizontalLabelInput
                label="Name:"
                value={name}
                onChange={setName}
              />
              <HorizontalLabelInput
                label="Phone number:"
                value={phone}
                onChange={setPhone}
              />
              <HorizontalLabelInput
                label="Address:"
                value={address}
                onChange={setAddress}
              />
              <HorizontalLabelInput
                label="Birth Date:"
                value={dob}
                onChange={setDob}
              />
              <HorizontalLabelInput
                label="Weight:"
                value={weight}
                onChange={setWeight}
              />
              <HorizontalLabelInput
                label="Height:"
                value={height}
                onChange={setHeight}
              />
              <HorizontalLabelInput
                label="Allergies:"
                value={allergies}
                onChange={setAllergies}
              />
              <HorizontalLabelInput
                label="Medication:"
                value={medications}
                onChange={setMedications}
              />
              <HorizontalLabelInput
                label="Treatment plan:"
                value={treatment}
                onChange={setTreatment}
              />
              <div className="security-message">
                {" "}
                This data is fully private never stored on servers.{" "}
                <a className="linkColor">Learn more</a>
              </div>
              <TButton className="btnStyle1" onClick={onSubmit}>
                Sign medical record
              </TButton>
            </div>
          </BoxContainer>
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
    </>
  );
}
