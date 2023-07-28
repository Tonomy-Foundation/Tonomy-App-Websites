import messagingPreview from "../assets/messaging-preview.png";
import vcPreview from "../assets/VC-preview.png";
import signtransactionPreview from "../assets/sign-transaction-preview.png";

export const images: string[] = [
  messagingPreview,
  signtransactionPreview,
  vcPreview,
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
