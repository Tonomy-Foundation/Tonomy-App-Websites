import React, { useContext, useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";
import { useAppKit, useAppKitProvider } from "@reown/appkit/react";
import SwapIcon from "../assets/icons/swap-icon.png";
import TonomyIcon from "../assets/icons/tonomy-icon.png";
import BaseIcon from "../assets/icons/base-icon.png";
import "./SwapComponent.css";
import { AuthContext } from "../../apps/providers/AuthProvider";
import {
    createSignedProofMessage,
    AppsExternalUser,
    EosioTokenContract,
    getBaseTokenContract,
} from "@tonomy/tonomy-id-sdk";
import Decimal from "decimal.js";
import TModal from "../../apps/components/TModal";
import CircularIcon from "../assets/icons/circular-arrow.png";
import InprogressIcon from "../assets/icons/inprogress.png";
import useErrorStore from "../../common/stores/errorStore";
import { BrowserProvider, JsonRpcSigner } from "ethers";
import { useAppKitEvents } from "@reown/appkit/react";
import { ToastContainer, toast } from "react-toastify";

const SwapDirection = {
    TONOMY_TO_BASE: "TONOMY_TO_BASE",
    BASE_TO_TONOMY: "BASE_TO_TONOMY",
};

export default function SwapComponent() {
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
    const { open } = useAppKit();
    const [fromAmount, setFromAmount] = useState("");
    const [toAmount, setToAmount] = useState("");
    const [isBalanceSufficient, setIsBalanceSufficient] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { signin } = useContext(AuthContext);
    const { walletProvider } = useAppKitProvider("eip155");
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // `events` gives you the *last event*
    const events = useAppKitEvents();

    useEffect(() => {
        if (!events) return;

        if (
            events.data.event === "MODAL_CLOSE" ||
            events.data.event === "USER_REJECTED"
        ) {
            // handle closure
            setSwapModal(false);
            setShowModal(false);
        }
    }, [events]);

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
        }, 8000); // 8 seconds
    };

    // Function to stop polling
    const stopBalancePolling = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

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
            fetchWalletBalance();
        } catch (e) {
            console.log("update balance error", e);
        }
    };

    const handleSwap = () => {
        setIsBalanceSufficient(true);
        setError(null);
        const newDirection =
            currentDirection === SwapDirection.TONOMY_TO_BASE
                ? SwapDirection.BASE_TO_TONOMY
                : SwapDirection.TONOMY_TO_BASE;
        setCurrentDirection(newDirection);
        const temp = fromAmount;
        setFromAmount(toAmount);
        setToAmount(temp);
        if (Number(temp) > 0) {
            if (
                newDirection === SwapDirection.TONOMY_TO_BASE &&
                new Decimal(temp).greaterThan(availableBalance)
            ) {
                setIsBalanceSufficient(false);
            } else if (
                newDirection === SwapDirection.BASE_TO_TONOMY &&
                new Decimal(temp).greaterThan(walletBalance)
            ) {
                setIsBalanceSufficient(false);
            }
        }
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
        const decimalValue = new Decimal(value || 0);
        // Check if value is numeric and > availableBalance or wallet balance
        if (
            currentDirection === SwapDirection.TONOMY_TO_BASE &&
            decimalValue.greaterThan(availableBalance)
        ) {
            setIsBalanceSufficient(false);
        } else if (
            currentDirection === SwapDirection.BASE_TO_TONOMY &&
            decimalValue.greaterThan(walletBalance)
        ) {
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
            // Set up timeout for 100 seconds
            const timeoutDuration = currentDirection === "base" ? 60000 : 100000;
            // Create a timeout that will close the modal if the operation takes too long
            const timeoutId = setTimeout(() => {
                console.warn("Swap timed out — closing modal.");
                setShowModal(false);
                setSwapModal(false);
                errorStore.setError({
                    title: "Something goes wrong",
                    error: new Error(
                        "Swap operation timed out. Please refresh and try again.",
                    ),
                    expected: true,
                });
            }, timeoutDuration);

            try {
                const direction: "tonomy" | "base" =
                    currentDirection === SwapDirection.TONOMY_TO_BASE ? "base" : "tonomy";
                await appUser.swapToken(new Decimal(toAmount), proof, direction);
                await new Promise((resolve) => setTimeout(resolve, 10000));
            } catch (error) {
                console.log("error", error);
                errorStore.setError({ error: error.message, expected: false });
            } finally {
                // Always clear timeout
                clearTimeout(timeoutId);
                await updateBalance();
                setShowModal(false);
                setSwapModal(false);
                setFromAmount("");
                setToAmount("");
                notify();
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

    const fetchWalletBalance = async () => {
        if (address) {
            const walletAmount = await getBaseTokenContract().balanceOf(address);
            const precisionMultiplier = new Decimal(10).pow(18);
            const newWalletBalance = new Decimal(walletAmount.toString()).div(
                precisionMultiplier,
            );

            if (!walletBalance.equals(newWalletBalance)) {
                setWalletBalance(newWalletBalance);
            }
        }
    };

    // Add this useEffect to update wallet balance when address changes
    useEffect(() => {
        try {
            fetchWalletBalance();
        } catch (e) {
            console.error("Error updating wallet balance:", e);
        }
    }, [address, walletProvider]);

    const renderSwapBox = (isFromBox) => {
        const isTonomyToBase = currentDirection === SwapDirection.TONOMY_TO_BASE;

        // Determine if this box is for Tonomy or Base
        const isTonomyBox =
            (isFromBox && isTonomyToBase) || // Top box in TONOMY_TO_BASE direction
            (!isFromBox && !isTonomyToBase); // Bottom box in BASE_TO_TONOMY direction

        const isBaseBox = !isTonomyBox;
        const isConnectWalletNeeded = isBaseBox && !isConnected;

        return (
            <>
                <div className="swap-label">
                    <span role="img" aria-label={isTonomyBox ? "tonomy" : "base"}>
                        <img
                            src={isTonomyBox ? TonomyIcon : BaseIcon}
                            alt={isTonomyBox ? "Tonomy Logo" : "Base Logo"}
                            className="tonomy-icon"
                        />
                    </span>
                    {isFromBox ? "From" : "To"} {isTonomyBox ? "Tonomy" : "Base"}{" "}
                    {isTonomyBox ? (
                        <>
                            <span className="username">@{username}</span>
                            <span className="balance">
                                {availableBalance.toString()} $TONO
                            </span>
                        </>
                    ) : (
                        <>
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
                        className="input-width"
                    />
                    <span className="currency">
                        $TONO{" "}
                        <span className="hint-network">
                            {isTonomyBox ? "Tonomy" : "Base"}
                        </span>
                    </span>
                </div>
            </>
        );
    };

    const notify = () => toast("Swap successful! Your balance is now updated");

    const description =
        currentDirection === SwapDirection.TONOMY_TO_BASE
            ? `You're about to swap ${fromAmount} $TONO from Tonomy Blockchain to Base Blockchain.`
            : `You're about to swap ${fromAmount} $TONO from Base Blockchain to Tonomy Blockchain.`;

    return (
        <>
            <div className="swap-card">
                <div className="swap-box">{renderSwapBox(true)}</div>
                <div className="swap-icon" onClick={handleSwap}>
                    <img src={SwapIcon} alt="Swap Icon" />
                </div>
                <div className="swap-box">{renderSwapBox(false)}</div>
            </div>
            {!isBalanceSufficient && (
                <p className="error-text">Insufficient balance</p>
            )}
            {error && <p className="error-text">{error}</p>}

            <p className="info-text">
                Connect your wallet, choose the amount, and confirm the transfer. The
                same amount will be released to the destination network once the swap is
                complete.
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
                description={description}
                cancelLabel="Cancel"
                confirmLabel="Confirm Swap"
                onCancel={() => setSwapModal(false)}
                onConfirm={() => {
                    setSwapModal(false);
                    confirmSwapAsset();
                    setShowModal(true);
                }}
            >
                <div></div>
            </TModal>

            <TModal
                open={showModal}
                image={InprogressIcon}
                title="Swap in progress"
                description={"It usually takes less than a minute"}
                onCancel={() => setShowModal(false)}
                onConfirm={() => setShowModal(false)}
                loading={true}
                closeIcon={false}
            >
                <div></div>
            </TModal>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick={true}
                rtl={false}
                draggable
                pauseOnHover
                theme="dark"
            />
        </>
    );
}
