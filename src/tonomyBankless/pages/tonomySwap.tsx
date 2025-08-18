import React, { useState } from "react";
import { useAccount } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import SwapIcon from "../assets/icons/swap-icon.png";
import TonomyIcon from "../assets/icons/tonomy-icon.png";
import BaseIcon from "../assets/icons/base-icon.png";
import "./TonomySwap.css";

const SwapDirection = {
  TONOMY_TO_BASE: "TONOMY_TO_BASE",
  BASE_TO_TONOMY: "BASE_TO_TONOMY",
};

export default function Swap() {
  const [currentDirection, setCurrentDirection] = useState(
    SwapDirection.TONOMY_TO_BASE,
  );
  const { isConnected } = useAccount();
  const { open } = useAppKit();
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");

  const handleSwap = () => {
    const newDirection =
      currentDirection === SwapDirection.TONOMY_TO_BASE
        ? SwapDirection.BASE_TO_TONOMY
        : SwapDirection.TONOMY_TO_BASE;
    setCurrentDirection(newDirection);
    const temp = fromAmount;
    setFromAmount(toAmount);
    setToAmount(temp);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setFromAmount(value);
    setToAmount(value);
  };

  const handleSwapAction = () => {
    if (currentDirection === SwapDirection.TONOMY_TO_BASE) {
      console.log(`Swapping ${fromAmount} $TONO from Tonomy to Base`);
    } else {
      console.log(`Swapping ${fromAmount} $TONO from Base to Tonomy`);
    }
  };

  const buttonText = isConnected
    ? fromAmount && toAmount
      ? "Swap Assets"
      : "Enter Amount"
    : "Connect Wallet";

  const renderSwapBox = (isFromBox) => {
    const isTonomyToBase = currentDirection === SwapDirection.TONOMY_TO_BASE;
    const isFromTonomy =
      (isFromBox && isTonomyToBase) || (!isFromBox && !isTonomyToBase);
    const isConnectWalletNeeded = !isFromTonomy && !isConnected;

    return (
      <>
        <div className="swap-label">
          <span role="img" aria-label={isFromTonomy ? "from" : "to"}>
            <img
              src={isFromTonomy ? TonomyIcon : BaseIcon}
              alt={isFromTonomy ? "Tonomy Logo" : "Base Logo"}
              className="tonomy-icon"
            />
          </span>
          {isFromTonomy ? (
            <>
              From Tonomy <span className="username">@miles-brown</span>
              <span className="balance">10.0000 $TONO</span>
            </>
          ) : (
            <>
              To Base{" "}
              {isConnectWalletNeeded && (
                <span className="connect-wallet" onClick={() => open()}>
                  Connect Wallet ›
                </span>
              )}
            </>
          )}
        </div>
        <div className="input-row">
          <input
            type="number"
            placeholder="0.0"
            value={isFromBox ? fromAmount : toAmount}
            onChange={handleAmountChange}
          />
          <span className="currency">
            $TONO{" "}
            <span className="hint-network">
              {isFromTonomy ? "Tonomy" : "Base"}
            </span>
          </span>
        </div>
      </>
    );
  };

  return (
    <div className="swap-container">
      <div className="swap-header">
        <h2>Tonomy Swap</h2>
        <div className="transactions">
          Transactions <span className="coming-soon">Coming soon</span>
        </div>
      </div>

      <div className="swap-card">
        <div className="swap-box">{renderSwapBox(true)}</div>
        <div className="swap-icon" onClick={handleSwap}>
          <img src={SwapIcon} alt="Swap Icon" style={{ width: "36px" }} />
        </div>
        <div className="swap-box">{renderSwapBox(false)}</div>
      </div>

      <p className="info-text">
        Send $TONO from Tonomy to Base. Connect your Base wallet, choose the
        amount, and confirm. The same amount will be released to your Base
        wallet once the transfer is complete.
      </p>

      <button
        className="connect-btn"
        disabled={!isConnected || !fromAmount || !toAmount}
        onClick={handleSwapAction}
      >
        {buttonText}
      </button>
    </div>
  );
}
