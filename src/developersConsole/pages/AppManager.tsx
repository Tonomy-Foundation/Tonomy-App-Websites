import React from "react";
import "./AppManager.css";
import AppNotFound from "../assets/no-app-found.png";
import DefaultAppLogo from "../assets/deuces-wild.png";
import CardView from "../components/CardView";

const apps = [
  { appName: "Booking.com", username: "Micheal Brown", logo: DefaultAppLogo },
  { appName: "Booking.com", username: "Micheal Brown", logo: DefaultAppLogo },
];

export default function AppManager() {
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
      <h2 className="heading">Welcome, Michael Brown</h2>
      {apps?.length > 0 ? (
        <>{appCards}</>
      ) : (
        <div className="imageContainer">
          <img src={AppNotFound} alt="App-Not-Found" />
        </div>
      )}

      <button className="bottomLeftButton">+</button>
    </div>
  );
}
