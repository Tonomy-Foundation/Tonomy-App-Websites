import messagingPreview from "../assets/messaging-preview.png";
import messagingLeft from "../assets/messaging-left.png";
import messagingRight from "../assets/messaging-right.png";
import vcPreview from "../assets/VC-preview.png";
import vcLeft from "../assets/VC-left.png";
import vcRight from "../assets/VC-right.png";
import signtransactionPreview from "../assets/sign-transaction-preview.png";
import signtransactionRight from "../assets/sign-transaction-right.png";

export const images: string[] = [
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

export const linkTexts = [
  {
    text: "SIGN W3C VERIFIABLE CREDENTIALS",
    url: "/w3c-vcs",
    code: `
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
            `,
  },
  {
    text: "SIGN BLOCKCHAIN TRANSACTIONS",
    url: "/blockchain-tx",
    code: `
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
            `,
  },
  {
    text: "MESSAGING",
    url: "#",
    code: `
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
            `,
  },
];
