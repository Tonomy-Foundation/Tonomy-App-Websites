import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./BanklessFeatures.css";
import SwapComponent from "../components/SwapComponent";
import Faucet from "./Faucet";
import { getSettings } from "@tonomy/tonomy-id-sdk";

export default function BanklessFeatures() {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active feature from URL path
  const getActiveFeatureFromPath = () => {
    if (location.pathname.includes("/faucet")) return "faucet";
    return "swap";
  };

  const [activeFeature, setActiveFeature] = useState<"swap" | "faucet">(
    getActiveFeatureFromPath()
  );

  // Check if we're on testnet
  const isTestnet = getSettings().environment === "testnet";

  const handleFeatureChange = (feature: "swap" | "faucet") => {
    setActiveFeature(feature);
    navigate(`/bankless/${feature}`);
  };

  return (
    <div className="swap-container">
      <div className="swap-header">
        <h2 className="swap-title">Tonomy Bankless</h2>
        <div className="transactions">
          Transactions <span className="coming-soon">Coming soon</span>
        </div>
      </div>

      {/* Feature tabs - ready for future expansion */}
      <div className="feature-tabs">
        <button
          className={`feature-tab ${activeFeature === "swap" ? "active" : ""}`}
          onClick={() => handleFeatureChange("swap")}
        >
          Swap
        </button>
        {isTestnet && (
          <button
            className={`feature-tab ${activeFeature === "faucet" ? "active" : ""}`}
            onClick={() => handleFeatureChange("faucet")}
          >
            Faucet
          </button>
        )}
        {/* Uncomment when implementing transfers feature */}
        {/* <button 
          className={`feature-tab ${activeFeature === "transfers" ? "active" : ""}`}
          onClick={() => handleFeatureChange("transfers")}
        >
          Transfers
        </button> */}
      </div>

      {/* Render active feature component */}
      {activeFeature === "swap" && <SwapComponent />}
      {activeFeature === "faucet" && <Faucet />}
      {/* Future feature components */}
      {/* {activeFeature === "transfers" && <TransfersComponent />} */}
    </div>
  );
}
