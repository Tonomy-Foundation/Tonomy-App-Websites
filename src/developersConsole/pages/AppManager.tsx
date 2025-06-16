import React, { useEffect, useState, useContext } from "react";
import useErrorStore from "../../common/stores/errorStore";
import { AuthContext } from "../providers/AuthProvider";
import "./AppManager.css";
import AppNotFound from "../assets/no-app-found.png";
import DefaultAppLogo from "../assets/deuces-wild.png";
import CardView from "../components/CardView";

const apps = [
  { appName: "Booking.com", username: "Micheal Brown", logo: DefaultAppLogo },
  { appName: "Booking.com", username: "Micheal Brown", logo: DefaultAppLogo },
];

export default function AppManager() {
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
    onRender();
  }, []);

  const appCards = apps.map((app, index) => (
    <CardView
      key={index}
      appName={app.appName}
      username={app.username}
      logo={app.logo}
    />
  ));

  return (
    <div>
      <h2 className="heading">Welcome, {username}</h2>
      {apps?.length > 0 ? (
        <>{appCards}</>
      ) : (
        <div className="image-container">
          <img src={AppNotFound} alt="App-Not-Found" />
        </div>
      )}

      <button className="bottom-left-button">+</button>
    </div>
  );
}
