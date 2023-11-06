import userLogo from "../../assets/user.png";
import SignBanner from "../../assets/sign-transaction.png";
import { TH1, TH2 } from "../../../common/atoms/THeadings";
import { HeaderTonomy } from "../../components/styles";
import LogoutIcon from "@mui/icons-material/Logout";

export type SignTransactionIntroProps = {
  username: string;
  scrollToDemo: () => void;
  signout: () => void;
  setActiveSection?: (section: string) => void;
};

const SignTransactionIntro = (props: SignTransactionIntroProps) => (
  <>
    <div className="header-container ">
      <p className="leftText sign-dcoument mobile-display-none">
        Feature Name: Sign Transaction
      </p>
      <p className="userLogoVC mobile-display-none">
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
        <HeaderTonomy>
          Tonomy
          <span style={{ fontWeight: 300, display: "contents" }}>ID</span>
        </HeaderTonomy>
      </div>
      <div className="mobile-view">
        <TH1 className="how-to-use-label">How to use Tonomy ID:</TH1>
        <p className="tonomy-header ">Sign all your transactions</p>
      </div>

      <TH2 className="header-description">
        Tonomy ID utilizes a digital signature and a distributed transaction
        protocol to safeguard your transactions and digital assets from
        unauthorized access or tampering.
      </TH2>
      <a
        href="https://docs.eosnetwork.com/"
        target="_blank"
        className="paraLink"
        rel="noreferrer"
      >
        Learn about the Antelope blockchain protocol{`->`}
      </a>
      <button className="demoLink web-view" onClick={props.scrollToDemo}>
        Enter Demo
      </button>
      {props?.setActiveSection && (
        <button
          className="mobile-demo-link mobile-view"
          onClick={() => props?.setActiveSection("imagine")}
        >
          Enter Demo
        </button>
      )}
    </div>
  </>
);

export default SignTransactionIntro;
