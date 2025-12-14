import React, { useState } from "react";
import "./TonomySwap.css";
import SwapComponent from "../components/SwapComponent";

export default function Swap() {
  const [activeFeature, setActiveFeature] = useState<
    "swap" | "faucet" | "transfers"
  >("swap");

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
          onClick={() => setActiveFeature("swap")}
        >
          Swap
        </button>
        {/* Uncomment these when implementing additional features */}
        {/* <button 
          className={`feature-tab ${activeFeature === "faucet" ? "active" : ""}`}
          onClick={() => setActiveFeature("faucet")}
        >
          Faucet
        </button>
        <button 
          className={`feature-tab ${activeFeature === "transfers" ? "active" : ""}`}
          onClick={() => setActiveFeature("transfers")}
        >
          Transfers
        </button> */}
      </div>

      {/* Render active feature component */}
      {activeFeature === "swap" && <SwapComponent />}
      {/* Future feature components */}
      {/* {activeFeature === "faucet" && <FaucetComponent />} */}
      {/* {activeFeature === "transfers" && <TransfersComponent />} */}
    </div>
  );
}
