import React, { useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import SwapIcon from "../assets/icons/swap-icon.png";
import TonomyIcon from "../assets/icons/tonomy-icon.png";
import BaseIcon from "../assets/icons/base-icon.png";
import "./TonomySwap.css";
import { AuthContext } from "../../tonomyAppList/providers/AuthProvider";
import {
  DemoTokenContract,
  createSignedProofMessage,
  AppsExternalUser
} from "@tonomy/tonomy-id-sdk";
import Decimal from "decimal.js";
import TModal from "../../tonomyAppList/components/TModal";
import CircularIcon from "../assets/icons/circular-arrow.png";

const SwapDirection = {
  TONOMY_TO_BASE: "TONOMY_TO_BASE",
  BASE_TO_TONOMY: "BASE_TO_TONOMY",
};

export default function Swap() {
  const [currentDirection, setCurrentDirection] = useState(
    SwapDirection.TONOMY_TO_BASE,
  );
  const [swapModal, setSwapModal] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { user } = useContext(AuthContext);
  const [username, setUsername] = React.useState<string>("");
  const [availableBalance, setAvailableBalance] = useState<number>(0);
  const { isConnected, address } = useAccount();
  const { open } = useAppKit();
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [isBalanceSufficient, setIsBalanceSufficient] = useState(true);

  useEffect(() => {
    async function authentication() {
      try {
        const username = await user?.getUsername();
        if (!username) throw new Error("No username found");
        setUsername(username.getBaseUsername());
        const accountName = await user?.getAccountName();
        if (!accountName) throw new Error("No account name found");
        const demoTokenContract = await DemoTokenContract.atAccount();
        const accountBalance = await demoTokenContract.getBalance(accountName);
        setAvailableBalance(accountBalance);
      } catch (e) {
        console.log("e", e);
      }
    }
    authentication();
  }, []);

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

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFromAmount(value);
    setToAmount(value);

    // Check if value is numeric and > availableBalance
    if (new Decimal(value || 0).greaterThan(availableBalance)) {
      setIsBalanceSufficient(false);
    } else {
      setIsBalanceSufficient(true);
    }
  };

  const handleSwapAction = async () => {
    if (buttonText === "Swap Assets") {
      if(!user) return;
      const appUser = new AppsExternalUser(user);
      const issuer = await appUser.getIssuer();
      const proof = await createSignedProofMessage(issuer.signer as any);

      try {
        await appUser.swapToken(new Decimal(fromAmount), proof, "base", username);
      } catch (error) {
        console.log("e", error);
      } finally {
        setShowModal(false);
        setFromAmount("");
        setToAmount("");
      }
    }
  };

  const buttonText = isConnected
    ? fromAmount && toAmount
      ? "Swap Assets"
      : "Enter Amount"
    : "Connect Wallet";

  const formatAddress = (address) => {
    return `${address.substring(0, 5)}....${address.substring(address.length - 5)}`;
  };

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
              From Tonomy <span className="username">@{username}</span>
              <span className="balance">
                {availableBalance.toString()} $TONO
              </span>
            </>
          ) : (
            <>
              To Base{" "}
              {isConnectWalletNeeded ? (
                <span className="connect-wallet" onClick={() => open()}>
                  Connect Wallet ›
                </span>
              ) : (
                <span className="username">{formatAddress(address)}</span>
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
      {!isBalanceSufficient && (
        <p className="error-text">Insufficient balance</p>
      )}

      <p className="info-text">
        Send $TONO from Tonomy to Base. Connect your Base wallet, choose the
        amount, and confirm. The same amount will be released to your Base
        wallet once the transfer is complete.
      </p>

      <button
        className="connect-btn"
        disabled={
          !isConnected || !fromAmount || !toAmount || !isBalanceSufficient
        }
        onClick={handleSwapAction}
      >
        {buttonText}
      </button>

     <TModal
      open={swapModal}
      image={CircularIcon}
      title="Confirm your swap"
      description={`You're about to swap ${fromAmount} $TONO from Base Blockchain to Tononomy Blockchain.`}
      cancelLabel="Cancel"
      confirmLabel="Confirm Swap"
      onCancel={() => setSwapModal(false)}
      onConfirm={() => {
        setSwapModal(false); 
        setShowModal(true);
      }}
    >
      {/* Add any modal content here if needed */}
      <div></div>
    </TModal>

     <TModal
      open={showModal}
      image={CircularIcon}
      title="Swap in progress"
      description={`We’re swapping ${fromAmount} $TONO from Base to Tonomy.Your balance should change in your wallet shortly`}
      confirmLabel="Return to Swap"
      onCancel={() => setShowModal(false)}
      onConfirm={handleSwap}
    >
      {/* Add any modal content here if needed */}
      <div></div>
    </TModal>

    </div>
  );
}
