import React, { useState } from "react";
import "./TonomySwap.css";

export default function Swap() {
  const [swapDirection, setSwapDirection] = useState(false);

  const handleSwap = () => {
    setSwapDirection(!swapDirection);
  };

  // Swap content based on state
  const fromContent = !swapDirection ? (
    <>
      <div className="swap-label">
        <span role="img" aria-label="from">
          ✈️
        </span>
        From Tonomy <span className="username">@miles-brown</span>
        <span className="balance">10.0000 $TONO</span>
      </div>
      <div className="input-row">
        <input type="number" placeholder="0.0" />
        <span className="currency">
          $TONO <span className="coming-soon">Tonomy</span>
        </span>
      </div>
    </>
  ) : (
    <>
      <div className="swap-label">
        <span role="img" aria-label="to">
          🌐
        </span>
        To Base <span className="connect-wallet">Connect Wallet ›</span>
      </div>
      <div className="input-row">
        <input type="number" placeholder="0.0" />
        <span className="currency">
          $TONO <span className="coming-soon">Base</span>
        </span>
      </div>
    </>
  );

  const toContent = !swapDirection ? (
    <>
      <div className="swap-label">
        <span role="img" aria-label="to">
          🌐
        </span>
        To Base <span className="connect-wallet">Connect Wallet ›</span>
      </div>
      <div className="input-row">
        <input type="number" placeholder="0.0" />
        <span className="currency">
          $TONO <span className="coming-soon">Base</span>
        </span>
      </div>
    </>
  ) : (
    <>
      <div className="swap-label">
        <span role="img" aria-label="from">
          ✈️
        </span>
        From Tonomy <span className="username">@miles-brown</span>
        <span className="balance">10.0000 $TONO</span>
      </div>
      <div className="input-row">
        <input type="number" placeholder="0.0" />
        <span className="currency">
          $TONO <span className="coming-soon">Tonomy</span>
        </span>
      </div>
    </>
  );

  return (
    <div className="swap-container">
      {/* Header */}
      <div className="swap-header">
        <h2>Tonomy Swap</h2>
        <div className="transactions">
          Transactions <span className="coming-soon">Coming soon</span>
        </div>
      </div>

      {/* Swap Card */}
      <div className="swap-card">
        {/* From - dynamic content */}
        <div className="swap-box">{fromContent}</div>

        {/* Swap Icon with click handler */}
        <div className="swap-icon" onClick={handleSwap}>
          ⇅
        </div>

        {/* To - dynamic content */}
        <div className="swap-box">{toContent}</div>
      </div>

      {/* Info Text */}
      <p className="info-text">
        Send $TONO from Tonomy to Base. Connect your Base wallet, choose the
        amount, and confirm. The same amount will be released to your Base
        wallet once the transfer is complete.
      </p>

      {/* Connect Button */}
      <button className="connect-btn">Connect your wallet</button>
    </div>
  );
}