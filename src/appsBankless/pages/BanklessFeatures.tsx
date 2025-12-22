import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./BanklessFeatures.css";
import SwapComponent from "../components/SwapComponent";
import Faucet from "../components/Faucet";
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
    getActiveFeatureFromPath(),
  );

  // Update active feature when URL changes
  useEffect(() => {
    const feature = getActiveFeatureFromPath();
    setActiveFeature(feature);
  }, [location.pathname]);

  // Check if we're on testnet
  const isProduction = getSettings().environment === "production";

  // Redirect from faucet to swap if on production
  useEffect(() => {
    if (activeFeature === "faucet" && isProduction) {
      navigate("/bankless/swap", { replace: true });
    }
  }, [activeFeature, isProduction, navigate]);

  const handleFeatureChange = (feature: "swap" | "faucet") => {
    setActiveFeature(feature);
    navigate(`/bankless/${feature}`);
  };

  return (
    <div className="swap-container">
      <div className="swap-header">
        <h2
          className={`swap-title ${activeFeature === "swap" ? "active" : ""}`}
          onClick={() => handleFeatureChange("swap")}
        >
          Swap
        </h2>
        {!isProduction && (
          <h2
            className={`swap-title ${activeFeature === "faucet" ? "active" : ""}`}
            onClick={() => handleFeatureChange("faucet")}
          >
            Faucet
          </h2>
        )}
        <div className="transactions">
          Transactions <span className="coming-soon">Coming soon</span>
        </div>
      </div>

      {/* Render active feature component */}
      {activeFeature === "swap" && <SwapComponent />}
      {activeFeature === "faucet" && <Faucet />}
    </div>
  );
}
