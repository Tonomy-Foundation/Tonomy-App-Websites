import React from "react";
import "./WelcomePopup.css";

interface WelcomePopupProps {
  onUseDummyData: () => void;
  onStartFresh: () => void;
}

export default function WelcomePopup({
  onUseDummyData,
  onStartFresh,
}: WelcomePopupProps) {
  return (
    <div className="welcome-popup-overlay">
      <div className="welcome-popup">
        <h2 className="welcome-title">Preview Build App Manager</h2>
        <p className="welcome-text welcome-highlight">
          This is a UI preview only — no functionality is connected yet.
        </p>
        <p className="welcome-text">
          Nothing you do here will create real apps or make actual changes.
        </p>
        <div className="welcome-buttons">
          <button className="welcome-button primary" onClick={onUseDummyData}>
            With sample apps
          </button>
          <button className="welcome-button secondary" onClick={onStartFresh}>
            Empty workspace
          </button>
        </div>
      </div>
    </div>
  );
}
