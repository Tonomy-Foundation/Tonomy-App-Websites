import userLogo from "../../assets/user.png";
import VCBanner from "../../assets/VC-banner.png";
import { TH1, TH2 } from "../../../common/atoms/THeadings";
import { HeaderTonomy, HeaderTonomySmall } from "../../components/styles";
import LogoutIcon from "@mui/icons-material/Logout";
import settings from "../../../common/settings";

export type W3VCIntroProps = {
  username: string;
  scrollToDemo: () => void;
  signout: () => void;
  setActiveSection?: (section: string) => void;
};

const W3VCIntro = (props: W3VCIntroProps) => (
  <>
    <div className="header-container ">
      <p className="float-left sign-dcoument mobile-display-none">
        Feature Name: Sign Document
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
      <img src={VCBanner} alt="banner-image" className="header-image" />
      <div className="web-view">
        <TH1 className="how-to-use-label">How to use :</TH1>
        {settings.config.appName.length > 12 ? (
          <HeaderTonomySmall>{settings.config.appName}</HeaderTonomySmall>
        ) : (
          <HeaderTonomy>{settings.config.appName} </HeaderTonomy>
        )}
      </div>
      <div className="mobile-view">
        <TH1 className="how-to-use-label">
          How to use {settings.config.appName}:
        </TH1>
        <p className="tonomy-header ">Sign all your documents</p>
      </div>

      <TH2 className="header-description">
        Sign and verify sensitive information with {settings.config.appName}.
        The W3C Verifiable Credential standard can help ensure trust and
        security when sharing sensitive and tamper-proof data.
      </TH2>
      <a
        href="https://www.youtube.com/watch?v=vuSPy1xMNVg"
        target="_blank"
        className="paragrapgh-link"
        rel="noreferrer"
      >
        Learn about the W3C Verifiable Credentials{`->`}
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

export default W3VCIntro;
