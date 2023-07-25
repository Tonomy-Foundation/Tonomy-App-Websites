import React, { useEffect, useState } from "react";
import ImageSlider from "../components/ImageSlider";
import user from "../assets/user.png";
import { ContainerStyle } from "../components/styles";
import { useUserStore } from "../../common/stores/user.store";
import { api } from "@tonomy/tonomy-id-sdk";
import useErrorStore from "../../common/stores/errorStore";
import settings from "../../common/settings";
import { images, linkTexts } from "./userHomeHelper";
import "./UserHome.css";

const USerHome: React.FC = () => {
  const userStore = useUserStore();
  const errorStore = useErrorStore();
  const [username, setUsername] = useState<string>("");
  const [blockExplorerUrl, setBlockExplorerUrl] = useState<string>("");

  async function onRender() {
    try {
      if (!userStore.user) {
        const user = await api.ExternalUser.getUser();

        userStore.setUser(user);

        const username = await user.getUsername();

        if (!username) throw new Error("No username found");
        setUsername(username.getBaseUsername());

        const accountName = await user?.getAccountName();

        if (!accountName) throw new Error("No account name found");
        let url = "https://local.bloks.io/account/" + accountName + "?nodeUrl=";

        url += settings.isProduction()
          ? settings.config.blockchainUrl
          : "http://localhost:8888";
        setBlockExplorerUrl(url);
      }
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
        <img src={user} alt="userLogo" className="userLogo" />
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
          code={true}
        />
      </div>
    </ContainerStyle>
  );
};

export default USerHome;
