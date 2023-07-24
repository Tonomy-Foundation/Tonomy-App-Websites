import React from "react";
import ImageSlider from "../components/ImageSlider";
import messagingPreview from "../assets/messaging-preview.png";
import messagingLeft from "../assets/messaging-left.png";
import messagingRight from "../assets/messaging-right.png";
import vcPreview from "../assets/VC-preview.png";
import vcLeft from "../assets/VC-left.png";
import vcRight from "../assets/VC-right.png";
import signtransactionPreview from "../assets/sign-transaction-preview.png";
// import signtransactionLeft from "../assets/sign-transaction-left.png";
import signtransactionRight from "../assets/sign-transaction-right.png";
import user from "../assets/user.png";
import { ContainerStyle } from "../components/styles";
import HighlightedPageView from "../components/TPageHighlighted";

import "./newUserHome.css";

// const rightImages: string[] = [
//   signtransactionRight,
//   messaging,
//   vcRight,
//   vc,
//   // signtransactionLeft,
//   // Add more image URLs here
// ];
// const leftImages: string[] = [
//   messaging,
//   messagingLeft,
//   vc,
//   vcLeft,
//   signtransaction,
//   // signtransactionLeft,
//   signtransactionRight,
//   // Add more image URLs here
// ];
const images: string[] = [
  messagingPreview,
  vcLeft,
  signtransactionRight,
  signtransactionPreview,
  vcRight,
  messagingLeft,

  vcPreview,
  signtransactionRight,
  messagingLeft,
];

const USerHome: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    // <div>
    //   <h1>Image Slider</h1>
    //   <ImageSlider images={images} />
    // </div>
    <ContainerStyle>
      <div className="userSection">
        <img src={user} alt="userLogo" className="userLogo" />
        <span>Jack Tanner</span>
      </div>
      <div>
        <p className="pageHeading">Test the possibilities of Tonomy ID</p>
      </div>
      <div className="imageSlider">
        <ImageSlider images={images} />
      </div>
      <p className="description">
        Our demo site showcases the benefits of Tonomy ID for both users and
        administrators. As a user, Tonomy ID enables you access to a variety of
        features. Some you can test on our demo website:
      </p>
      <div className="documentation">
        <p>Documentation {`->`} </p>
        <div>
          <button onClick={handleOpen}>Code Snippet</button>
          {open && (
            <div className="dropdown-content">
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
                githubLink="https://github.com/Tonomy-Foundation/Tonomy-App-Websites/blob/development/src/demo/pages/blockchainTx.tsx"
              />
            </div>
          )}
        </div>
      </div>
    </ContainerStyle>
  );
};

export default USerHome;
