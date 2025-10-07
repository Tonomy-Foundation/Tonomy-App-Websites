import React, { useContext, useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";
import { useAppKit, useAppKitProvider } from "@reown/appkit/react";
import SwapIcon from "../assets/icons/swap-icon.png";
import TonomyIcon from "../assets/icons/tonomy-icon.png";
import BaseIcon from "../assets/icons/base-icon.png";
import "./TonomySwap.css";
import { AuthContext } from "../../tonomyAppList/providers/AuthProvider";
import {
  createSignedProofMessage,
  AppsExternalUser,
  EosioTokenContract,
  getBaseTokenContract,
} from "@tonomy/tonomy-id-sdk";
import Decimal from "decimal.js";
import TModal from "../../tonomyAppList/components/TModal";
import CircularIcon from "../assets/icons/circular-arrow.png";
import InprogressIcon from "../assets/icons/inprogress.png";
import useErrorStore from "../../common/stores/errorStore";
import { BrowserProvider, JsonRpcSigner } from "ethers";
import { useAppKitBalance, useAppKitEvents } from "@reown/appkit/react";

const SwapDirection = {
  TONOMY_TO_BASE: "TONOMY_TO_BASE",
  BASE_TO_TONOMY: "BASE_TO_TONOMY",
};

export default function Swap() {
  const errorStore = useErrorStore();
  const [currentDirection, setCurrentDirection] = useState(
    SwapDirection.TONOMY_TO_BASE,
  );
  const [swapModal, setSwapModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { user } = useContext(AuthContext);
  const [username, setUsername] = React.useState<string>("");
  const [availableBalance, setAvailableBalance] = useState<Decimal>(
    new Decimal(0),
  );
  const [walletBalance, setWalletBalance] = useState<Decimal>(new Decimal(0));
  const { isConnected, address } = useAccount();
  const { fetchBalance } = useAppKitBalance();
  const { open } = useAppKit();
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [isBalanceSufficient, setIsBalanceSufficient] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { signin } = useContext(AuthContext);
  const { walletProvider } = useAppKitProvider("eip155");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  // Update the type to match the expected result from fetchBalance
  const [baseBalance, setBaseBalance] = useState();

  // Add this after the useAppKit line
  const events = useAppKitEvents();
  console.log("appkit events", events);

  useEffect(() => {
    async function authentication() {
      try {
        if (!user) {
          const user1 = await AppsExternalUser.getUser({ autoLogout: false });
          if (user1) {
            signin(user1, "bankless/swap");
          }
        }
        const username = await user?.getUsername();
        if (username) {
          setUsername(username.getBaseUsername());
          await updateBalance();
          startBalancePolling();
        }
      } catch (e) {
        errorStore.setError({ error: e, expected: false });
      }
    }
    authentication();
    // Cleanup function to clear interval on component unmount
    return () => {
      stopBalancePolling();
    };
  }, []);

  const startBalancePolling = () => {
    // Clear any existing interval first
    stopBalancePolling();

    // Set up new interval
    intervalRef.current = setInterval(async () => {
      try {
        await updateBalance();
      } catch (error) {
        console.error("Error polling balance:", error);
        // Don't stop polling on error, just log it
      }
    }, 10000); // 10 seconds
  };

  // Function to stop polling
  const stopBalancePolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (isConnected) {
      fetchBalance().then((result) => {
        console.log("baseBalance", result, result?.data, baseBalance);

        if (result && result.data) {
          setBaseBalance(result.data);
        } else {
          setBaseBalance(undefined);
        }
      });
    }
  }, [isConnected, fetchBalance]);

  const updateBalance = async () => {
    try {
      const accountName = await user?.getAccountName();
      if (!accountName) throw new Error("No account name found");
      const eosioTokenContract = await EosioTokenContract.atAccount();
      const accountBalance =
        await eosioTokenContract.getBalanceDecimal(accountName);
      // Only update state if balance actually changed
      if (!availableBalance.equals(accountBalance)) {
        setAvailableBalance(accountBalance);
      }
      if (address) {
        const walletAmount = await getBaseTokenContract().balanceOf(address);
        const newWalletBalance = new Decimal(walletAmount.toString());

        // Only update state if balance actually changed
        if (!walletBalance.equals(newWalletBalance)) {
          setWalletBalance(newWalletBalance);
        }
      }
    } catch (e) {
      errorStore.setError({ error: e, expected: false });
    }
  };

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
    setError(null);
    const value = e.target.value;
    setFromAmount(value);
    setToAmount(value);

    const validRegex = /^[\d.]*$/;
    if (!validRegex.test(value)) {
      setError("Only numbers and decimal point allowed");
      return;
    }

    // Check if value is numeric and > availableBalance
    if (new Decimal(value || 0).greaterThan(availableBalance)) {
      setIsBalanceSufficient(false);
    } else {
      setIsBalanceSufficient(true);
    }
  };

  const confirmSwapAsset = async () => {
    if (buttonText === "Swap Assets") {
      if (!user) return;
      const appUser = new AppsExternalUser(user);

      const ethersProvider = new BrowserProvider(
        walletProvider as import("ethers").Eip1193Provider,
      );
      const signer = await ethersProvider.getSigner();
      const proof = await createSignedProofMessage(signer as JsonRpcSigner);

      try {
        const direction: "tonomy" | "base" =
          currentDirection === SwapDirection.TONOMY_TO_BASE ? "base" : "tonomy";
        await appUser.swapToken(new Decimal(toAmount), proof, direction);
      } catch (error) {
        console.log("e", error);
        errorStore.setError({ error: error, expected: false });
      } finally {
        await updateBalance();
        setShowModal(false);
        setSwapModal(false);
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
                <>
                  <span className="username">{formatAddress(address)}</span>
                  <span className="balance">
                    {walletBalance.toString()} $TONO
                  </span>
                </>
              )}
            </>
          )}
        </div>
        <div className="input-row">
          <input
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
      {error && <p className="error-text">{error}</p>}

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
        onClick={() => {
          if (buttonText === "Swap Assets") {
            setSwapModal(true);
          }
        }}
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
          confirmSwapAsset();
          setShowModal(true);
        }}
      >
        {/* Add any modal content here if needed */}
        <div></div>
      </TModal>

      <TModal
        open={showModal}
        image={InprogressIcon}
        title="Swap in progress"
        description={`We’re swapping ${fromAmount} $TONO from Base to Tonomy.Your balance should change in your wallet shortly`}
        confirmLabel="Return to Swap"
        onCancel={() => setShowModal(false)}
        onConfirm={() => setShowModal(false)}
        loading={true}
      >
        {/* Add any modal content here if needed */}
        <div></div>
      </TModal>
    </div>
  );
}
