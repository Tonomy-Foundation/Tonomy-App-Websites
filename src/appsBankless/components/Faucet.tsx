import React, { useContext, useState } from "react";
import { AuthContext } from "../../apps/providers/AuthProvider";
import TonomyIcon from "../assets/icons/tonomy-icon.png";
import "./Faucet.css";
import Decimal from "decimal.js";
import useErrorStore from "../../common/stores/errorStore";
import { amountToAsset } from "@tonomy/tonomy-id-sdk";

export default function Faucet() {
    const { user } = useContext(AuthContext);
    const errorStore = useErrorStore();
    const [amount, setAmount] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [username, setUsername] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    React.useEffect(() => {
        async function getUsername() {
            if (user) {
                const username = await user.getUsername();
                if (username) {
                    setUsername(username.getBaseUsername());
                }
            }
        }
        getUsername();
    }, [user]);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        const value = e.target.value;

        const validRegex = /^[\d.]*$/;
        if (!validRegex.test(value)) {
            setError("Only numbers and decimal point allowed");
            return;
        }

        const numValue = parseFloat(value || "0");
        if (numValue > 1000) {
            setError("Maximum amount is 1,000 TONO");
            setAmount("1000");
            return;
        }

        setAmount(value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || parseFloat(amount) <= 0) {
            setError("Please enter a valid amount");
            return;
        }

        if (!user) {
            setError("User not authenticated");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await user.requestFaucetTokens(amountToAsset(parseFloat(amount), "TONO"));

            // Reset form on success
            setAmount("");
            setError(null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to request tokens";
            setError(errorMessage);
            errorStore.setError({ error: err, expected: false });
        } finally {
            setIsLoading(false);
        }
    };

    const isButtonDisabled = !amount || parseFloat(amount) <= 0 || parseFloat(amount) > 1000 || isLoading;

    return (
        <div className="faucet-container">
            <div className="faucet-card">
                <h3 className="faucet-title">Testnet Token Faucet</h3>
                <p className="faucet-description">
                    Request testnet TONO tokens for development and testing purposes.
                    Maximum 1,000 TONO per request.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="faucet-form">
                        <div className="faucet-recipient">
                            <span className="faucet-label">Recipient:</span>
                            <span className="faucet-username">@{username}</span>
                        </div>

                        <div className="faucet-input-group">
                            <div className="faucet-input-wrapper">
                                <input
                                    type="text"
                                    placeholder="0.0"
                                    value={amount}
                                    onChange={handleAmountChange}
                                    className="faucet-input"
                                />
                                <div className="faucet-token">
                                    <img
                                        src={TonomyIcon}
                                        alt="Tonomy Logo"
                                        className="faucet-token-icon"
                                    />
                                    <span className="faucet-token-symbol">$TONO</span>
                                    <span className="faucet-token-network">Tonomy</span>
                                </div>
                            </div>
                            <div className="faucet-max-hint">Max: 1,000 TONO</div>
                        </div>

                        {error && <p className="faucet-error">{error}</p>}

                        <button
                            type="submit"
                            className="faucet-button"
                            disabled={isButtonDisabled}
                        >
                            {isLoading ? "Requesting..." : "Request Tokens"}
                        </button>
                    </div>
                </form>

                <div className="faucet-info">
                    <p className="faucet-info-text">
                        ℹ️ Testnet tokens have no real value and are only for testing purposes.
                    </p>
                </div>
            </div>
        </div>
    );
}
