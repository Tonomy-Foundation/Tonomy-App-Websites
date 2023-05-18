import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import TUserInfo from "../components/TUserInfo";
import { TH2, TP } from "../../common/atoms/THeadings";
import "@tonomy/tonomy-id-sdk/build/api/tonomy.css";
import { TButton } from "../../common/atoms/TButton";
import HighlightedPageView from "../components/TPageHighlighted";
import { FormControl, InputLabel, Input } from "@mui/material";
import HorizontalLabelInput from "../components/HorizontalLabelInput";

export default function W3CVCs() {
  return (
    <div className="container">
      <div className="pageIntro">
        <TUserInfo></TUserInfo>
        <TP className="text-header marginTop">
          Demo feature of how to use Tonomy ID to
        </TP>
        <TH2> Signing Verifiable Credentials</TH2>
        <TP className="text-header">
          By digitally signing the medical record, you can help protect it from
          unauthorized access and tampering, while also providing a traceable
          record of who has accessed the information. <br /> Whether you're a
          medical professional or someone who needs to sign and verify sensitive
          information, the W3C verifiable credential standard can help ensure
          trust and security in digital transactions.
        </TP>
        <TP>
          Below we will illustrate the process of signing verifiable credentials
          on our demo website.
        </TP>
        <TP className="list">
          Other examples of how to use credentials with Tonomy ID include:
          <ul>
            <li>employment contracts</li>
            <li>shipping and logistics events</li>
            <li>events payments and payment metadata</li>
            <li>votes</li>
            <li>event tickets much more!</li>
          </ul>
        </TP>
        <div className="example-container backgroundGrey">
          <TH2>Client details</TH2>
          <div className="formView">
            <HorizontalLabelInput label="Name:" value={"Johnathan Doe"} />
            <HorizontalLabelInput
              label="Phone number:"
              value={"+33 64 34 55 76 34"}
            />
            <HorizontalLabelInput label="Address:" value={"123 Baker Street"} />
            <HorizontalLabelInput label="Birth Date:" value={"03/03/1976"} />
            <HorizontalLabelInput label="Weight:" value={"103 kg"} />
            <HorizontalLabelInput label="Height:" value={"187 cm"} />
            <HorizontalLabelInput label="Allergies:" value={"none"} />
            <HorizontalLabelInput label="Medication:" value={"none"} />
            <HorizontalLabelInput
              label="Treatment plan:"
              value={"sufficient rest and increase intake of fluids"}
            />
            <div className="security-message">
              {" "}
              This data is fully private never stored on servers.{" "}
              <p className="link-color">Learn more</p>
            </div>
          </div>
        </div>
      </div>
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
        documentLink="https://docs.tonomy.foundation"
        githubLink="https://github.com/Tonomy-Foundation/Tonomy-App-Websites/blob/master/src/demo/pages/Home.tsx"
      />
    </div>
  );
}
