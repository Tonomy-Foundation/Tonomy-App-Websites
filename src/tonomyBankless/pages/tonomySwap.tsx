import React, { useState } from "react";
import { useAccount } from "wagmi";
import { useAppKit } from '@reown/appkit/react'
import SwapIcon from "../assets/icons/swap-icon.png";  
import TonomyIcon from "../assets/icons/tonomy-icon.png";
import BaseIcon from "../assets/icons/base-icon.png";
import "./TonomySwap.css";  

const SwapDirection = {
  TONOMY_TO_BASE: 'TONOMY_TO_BASE',
  BASE_TO_TONOMY: 'BASE_TO_TONOMY'
};

export default function Swap() {
    const [currentDirection, setCurrentDirection] = useState(SwapDirection.TONOMY_TO_BASE);

  const [swapDirection, setSwapDirection] = useState(false);
  const { isConnected, address } = useAccount();
  const { open } = useAppKit();
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  console.log("currentDirection", currentDirection)
  const handleSwap = () => {
     const newDirection = currentDirection === SwapDirection.TONOMY_TO_BASE 
      ? SwapDirection.BASE_TO_TONOMY 
      : SwapDirection.TONOMY_TO_BASE;
    
    setCurrentDirection(newDirection);
    
    // Swap the amounts
    const temp = fromAmount;
    setFromAmount(toAmount);
    setToAmount(temp);
  };

  const handleFromAmountChange = (e) => {
    const value = e.target.value;
    setFromAmount(value);
    setToAmount(value);
  };

  const handleToAmountChange = (e) => {
     const value = e.target.value;
    setFromAmount(value);
    setToAmount(value);
  };

  const handleSwapAction = () => {
   
    // Perform the swap based on current direction
    if (currentDirection === SwapDirection.TONOMY_TO_BASE) {
      console.log(`Swapping ${fromAmount} $TONO from Tonomy to Base`);
      // Add your actual swap logic here
    } else {
      console.log(`Swapping ${fromAmount} $TONO from Base to Tonomy`);
      // Add your actual swap logic here
    }
  };

  // Determine button text
  const buttonText = isConnected ? fromAmount && toAmount ? "Swap Assets" : "Enter Amount" : "Connect Wallet";

  // Swap content based on state
   const fromContent = currentDirection === SwapDirection.TONOMY_TO_BASE ?(
    <>
      <div className="swap-label">
        <span role="img" aria-label="from">
           <img
            src={TonomyIcon}
            alt="Tonomy Logo"
            className="tonomy-icon"
          />
        </span>
        From Tonomy <span className="username">@miles-brown</span>
        <span className="balance">10.0000 $TONO</span>
      </div>
      <div className="input-row">
        <input 
          type="number" 
          placeholder="0.0" 
          value={fromAmount}
          onChange={handleFromAmountChange}
        />
        <span className="currency">
          $TONO <span className="hint-network">Tonomy</span>
        </span>
      </div>
    </>
  ) : (
    <>
      <div className="swap-label">
        <span role="img" aria-label="to">
          <img
            src={BaseIcon}
            alt="Base Logo"
            className="tonomy-icon"
          />
        </span>
        To Base <span className="connect-wallet">Connect Wallet ›</span>
      </div>
      <div className="input-row">
        <input 
          type="number" 
          placeholder="0.0" 
          value={toAmount}
          onChange={handleToAmountChange}
        />
        <span className="currency">
          $TONO <span className="hint-network">Base</span>
        </span>
      </div>
    </>
  );

 const toContent = currentDirection === SwapDirection.TONOMY_TO_BASE ? (
    <>
      <div className="swap-label">
        <span role="img" aria-label="to">
         <img
            src={BaseIcon}
            alt="Base Logo"
            className="tonomy-icon"
          />
        </span>
        To Base <span className="connect-wallet" onClick={() => open()}>Connect Wallet › </span>
      </div>
      <div className="input-row">
        <input 
          type="number" 
          placeholder="0.0" 
          value={toAmount}
          onChange={handleToAmountChange}
        />
        <span className="currency">
          $TONO <span className="hint-network">Base</span>
        </span>
      </div>
    </>
  ) : (
    <>
      <div className="swap-label">
        <span role="img" aria-label="from">
           <img
            src={TonomyIcon}
            alt="Tonomy Logo"
            className="tonomy-icon"
          />
        </span>
        From Tonomy <span className="username">@miles-brown</span>
        <span className="balance">10.0000 $TONO</span>
      </div>
      <div className="input-row">
        <input 
          type="number" 
          placeholder="0.0" 
          value={fromAmount}
          onChange={handleFromAmountChange}
        />
        <span className="currency">
          $TONO <span className="hint-network">Tonomy</span>
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
          <img
            src={SwapIcon}
            alt="Tonomy Logo"
            style={{width:"36px"}}
          />
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
      <button className="connect-btn" disabled={!isConnected || !fromAmount || !toAmount} onClick={handleSwapAction}>
        {buttonText}
      </button>
    </div>
  );
}