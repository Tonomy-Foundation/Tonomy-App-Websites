import userLogo from "../../assets/user.png";
import SignBanner from "../../assets/sign-transaction.png";
import { TH1, TH2 } from "../../../common/atoms/THeadings";
import { HeaderTonomy } from "../../components/styles";
import LogoutIcon from "@mui/icons-material/Logout";
import settings from "../../../common/settings";

export type SignTransactionIntroProps = {
  username: string;
  scrollToDemo: () => void;
  signout: () => void;
  setActiveSection?: (section: string) => void;
};

const SignTransactionIntro = (props: SignTransactionIntroProps) => (
  <>
    <div className="header-container ">
      <p className="float-left sign-dcoument mobile-display-none">
        Feature Name: Sign Transaction
      </p>
      <p className="vc-user-logo mobile-display-none">
        {<img src={userLogo} alt="userLogo" />}
        <span>{props.username}</span>
      </p>
      <div className="mobile-container mobile-view">
        <div className="user-section">
          <img src={userLogo} alt="userLogo" className="user-logo" />
          <span>{props.username}</span>
        </div>
        <div className="mobile-logout-section">
          <LogoutIcon className="user-logo" />
          <span onClick={() => props.signout()}>Log out</span>
        </div>
      </div>
      {/* <div className="header-image" /> */}
      <img src={SignBanner} alt="banner-image" className="header-image" />
      <div className="web-view">
        <TH1 className="how-to-use-label">How to use :</TH1>
        <HeaderTonomy>{settings.config.appName}</HeaderTonomy>
      </div>
      <div className="mobile-view">
        <TH1 className="how-to-use-label">
          How to use {settings.config.appName}:
        </TH1>
        <p className="tonomy-header ">Sign all your transactions</p>
      </div>

      <TH2 className="header-description">
        {settings.config.appName} utilizes a digital signature and a
        distributed transaction protocol to safeguard your transactions and
        digital assets from unauthorized access or tampering.
      </TH2>
      <a
        href="https://docs.eosnetwork.com/"
        target="_blank"
        className="paragrapgh-link"
        rel="noreferrer"
      >
        Learn about the Antelope blockchain protocol{`->`}
      </a>
      <button className="demo-link web-view" onClick={props.scrollToDemo}>
        Enter Demo
      </button>
      {props?.setActiveSection && (
        <button
          className="mobile-demo-link mobile-view"
          onClick={() => props?.setActiveSection?.("imagine")}
        >
          Enter Demo
        </button>
      )}
    </div>
  </>
);

export default SignTransactionIntro;
