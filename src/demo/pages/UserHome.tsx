import React, { useEffect, useState, useContext } from "react";
import ImageSlider from "../components/ImageSlider";
import userLogo from "../assets/user.png";
import { ContainerStyle } from "../components/styles";
import useErrorStore from "../../common/stores/errorStore";
import { AuthContext } from "../providers/AuthProvider";
import { images, linkTexts } from "./userHomeHelper";
import "./UserHome.css";
import CodeSnippetPreview from "../components/CodeSnippetPreview";
import LogoutIcon from "@mui/icons-material/Logout";
import settings from "../../common/settings";

const snippetCode = `
// CallbackPage.jsx
const user = await api.ExternalUser.verifyLoginRequest();
`;

const USerHome: React.FC = () => {
  const errorStore = useErrorStore();
  const [username, setUsername] = useState<string>("");
  const { user, signout } = useContext(AuthContext);

  async function onRender() {
    try {
      const username = await user?.getUsername();

      if (!username) throw new Error("No username found");
      setUsername(username.getBaseUsername());
    } catch (e) {
      errorStore.setError({ error: e, expected: false });
    }
  }

  useEffect(() => {
    onRender();
  }, []);

  return (
    <div className="home-container">
      <div className="mobile-container user-section-spacing">
        <div className="user-section">
          <img
            src={userLogo}
            alt={`${settings.config.appName} Logo`}
            className="user-logo"
          />
          <span>{username}</span>
        </div>
        <div className="mobile-logout-section">
          <LogoutIcon className="user-logo" />
          <span onClick={() => signout()}>Log out</span>
        </div>
      </div>
      <div>
        <p className="page-heading">
          Test the possibilities of {settings.config.appName}
        </p>
      </div>
      <div className="image-slider">
        <ImageSlider images={images} linkTexts={linkTexts} />
      </div>
      <p className="description">
        Our demo site showcases the benefits of {settings.config.appName} for
        both users and administrators. As a user, {settings.config.appName}{" "}
        enables you access to a variety of features. Some you can test on our
        demo website:
      </p>
      <CodeSnippetPreview
        snippetCode={snippetCode}
        documentationLink={`${settings.config.documentationLink}/start/single-sign-on#id-3.-callback-page`}
      />
    </div>
  );
};

export default USerHome;
