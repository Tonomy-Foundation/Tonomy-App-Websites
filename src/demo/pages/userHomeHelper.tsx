import messagingPreview from "../assets/messaging-preview.png";
import vcPreview from "../assets/VC-preview.png";
import signtransactionPreview from "../assets/sign-transaction-preview.png";

export const images: string[] = [
  vcPreview,
  signtransactionPreview,
  messagingPreview,
];

export const linkTexts = [
  {
    text: "Use case of Signing a Document",
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
    text: "Use case of Signing Transactions",
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
    text: "Use case of Messaging Peers",
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
