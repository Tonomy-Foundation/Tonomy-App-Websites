import React, { useEffect, useState, useContext } from "react";
import ImageSlider from "../components/ImageSlider";
import userLogo from "../assets/user.png";
import { ContainerStyle } from "../components/styles";
import useErrorStore from "../../common/stores/errorStore";
import { AuthContext } from "../providers/AuthProvider";
import { images, linkTexts } from "./userHomeHelper";
import "./UserHome.css";

const USerHome: React.FC = () => {
  const errorStore = useErrorStore();
  const [username, setUsername] = useState<string>("");
  const { user } = useContext(AuthContext);

  async function onRender() {
    try {
      const username = await user.getUsername();

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
    <ContainerStyle>
      <div className="userSection">
        <img src={userLogo} alt="userLogo" className="userLogo" />
        <span>{username}</span>
      </div>
      <div>
        <p className="pageHeading">Test the possibilities of Tonomy ID</p>
      </div>
      <div className="imageSlider">
        <ImageSlider
          images={images}
          linkTexts={linkTexts}
          description="Our demo site showcases the benefits of Tonomy ID for both users and
          administrators. As a user, Tonomy ID enables you access to a variety of
          features. Some you can test on our demo website:"
        />
      </div>
    </ContainerStyle>
  );
};

export default USerHome;
