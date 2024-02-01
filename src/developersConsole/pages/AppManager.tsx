import React from "react";
import "./AppManager.css";
import AppNotFound from "../assets/no-app-found.png";

export default function AppManager() {
  return (
    <div>
      <h2 className="heading">Welcome, Michael Brown</h2>
      <div className="imageContainer">
        <img src={AppNotFound} alt="App-Not-Found" />
      </div>
      <button className="bottomLeftButton">+</button>
    </div>
  );
}
