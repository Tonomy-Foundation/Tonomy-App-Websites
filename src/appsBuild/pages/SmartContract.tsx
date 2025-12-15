import React from "react";
import "./SmartContract.css";

export default function SmartContract() {
    return (
        <div className="smart-contract">
            <section className="sc-section sc-intro">
                <h3>Smart Contracts</h3>
                <p>
                    Deploy and manage smart contracts on the Tonomy blockchain using the Tonomy ID SDK.
                </p>
            </section>

            <section className="sc-section">
                <h4>Getting Started</h4>
                <p>
                    Smart contracts allow you to build decentralized applications with persistent, on-chain state.
                    Learn more about deploying and managing contracts in the documentation.
                </p>
                <a
                    href="https://docs.tonomy.io/build-web4-apps/usage/smart-contracts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cta-link"
                >
                    View Smart Contract Documentation →
                </a>
            </section>
        </div>
    );
}
