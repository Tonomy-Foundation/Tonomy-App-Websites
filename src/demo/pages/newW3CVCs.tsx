import React from "react";
import { TButton } from "../../common/atoms/TButton";
import user from "../assets/user.png";
import VCBanner from "../assets/VC-banner.png";
import TextboxLayout from "../components/TextboxLayout";
import "./newW3CVCs.css";

export default function W3CVCs() {
  return (
    <>
      <div className="containerVC">
        <div className="userSectionVC">
          <p className="leftText sign-dcoument">Feature Name: Sign Document</p>
          <p className="userLogoVC">
            <img src={user} alt="userLogo" />
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

          <TextboxLayout label="Name:" value="Johnathan Doe" />
          <TextboxLayout label="Phone number:" value="+33 64 34 55 76 34" />
          <TextboxLayout label="Address:" value="123 Baker Street" />
          <TextboxLayout label="Birth Date:" value="03/03/1976" />
          <div className="row-container">
            <TextboxLayout label="Weight:" value="108kg" />
            <TextboxLayout label="Height:" value="187cm" />
          </div>
          <TextboxLayout label="Allergies:" value="none" />
          <TextboxLayout label="Medication:" value="none" />
          <TextboxLayout
            label="Treatment plan:"
            value="sufficient rest and increase intake of fluids"
          />
          <div className="security-message">
            {" "}
            This data is fully private never stored on servers.{" "}
            <a className="linkColor">Learn more</a>
          </div>
          <div>
            <TButton className="btnStyle1">Sign using your tonomy DID</TButton>
          </div>
        </div>
      </div>
    </>
  );
}
