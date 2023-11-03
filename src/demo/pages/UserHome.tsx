import React, { useEffect, useState, useContext } from "react";
import ImageSlider from "../components/ImageSlider";
import userLogo from "../assets/user.png";
import { ContainerStyle } from "../components/styles";
import useErrorStore from "../../common/stores/errorStore";
import { AuthContext } from "../providers/AuthProvider";
import { images, linkTexts } from "./userHomeHelper";
import "./UserHome.css";
import CodeSnippetPreview from "../components/CodeSnippetPreview";

const snippetCode = `
// CallbackPage.jsx
const user = await api.ExternalUser.verifyLoginRequest();
`;

const USerHome: React.FC = () => {
  const errorStore = useErrorStore();
  const [username, setUsername] = useState<string>("");
  const { user } = useContext(AuthContext);

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
    // onRender();
  }, []);

  return (
    <ContainerStyle className="home-container">
      <div className="user-section display-none">
        <img src={userLogo} alt="userLogo" className="user-logo" />
        <span>{username}</span>
      </div>
      <div>
        <p className="page-heading">Test the possibilities of Tonomy ID</p>
      </div>
      <div className="image-slider">
        <ImageSlider images={images} linkTexts={linkTexts} />
      </div>
      <p className="description">
        Our demo site showcases the benefits of Tonomy ID for both users and
        administrators. As a user, Tonomy ID enables you access to a variety of
        features. Some you can test on our demo website:
      </p>
      <CodeSnippetPreview 
        snippetCode={snippetCode}
        documentationLink="https://docs.tonomy.foundation/start/single-sign-on/#3-callback-page"
      /> 
    </ContainerStyle>
  );
};

export default USerHome;
