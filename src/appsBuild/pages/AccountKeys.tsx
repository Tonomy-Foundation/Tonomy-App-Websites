import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useApps } from "../context/AppsContext";
import "./AccountKeys.css";

export default function AccountKeys() {
    const { username } = useParams();
    const { getAppByUsername, addAccountKey, removeAccountKey } = useApps();
    const app = username ? getAppByUsername(username) : undefined;

    const [lastPrivateKey, setLastPrivateKey] = useState<string | null>(null);
    const [loadingKey, setLoadingKey] = useState<string | null>(null);

    if (!app) {
        return <div className="signing-keys"><p>App not found.</p></div>;
    }

    const keys = app.accountKeys || [];

    const handleAdd = async () => {
        setLoadingKey("add");
        const result = await addAccountKey(app.appUsername);
        if (result) {
            setLastPrivateKey(result.privateKey);
        }
        setLoadingKey(null);
    };

    const handleRemove = async (publicKey: string) => {
        setLoadingKey(publicKey);
        await removeAccountKey(app.appUsername, publicKey);
        setLoadingKey(null);
    };

    return (
        <div className="signing-keys">
            <div className="keys-header">
                <div>
                    <h3>Signing Keys</h3>
                    <p className="keys-subtitle">Add or remove signing keys for this app.</p>
                </div>
                <button className="btn-primary" onClick={handleAdd} disabled={loadingKey === "add"}>
                    {loadingKey === "add" ? "Generating..." : "Generate Key"}
                </button>
            </div>

            {lastPrivateKey && (
                <div className="key-alert">
                    <strong>Save this private key now:</strong>
                    <div className="private-key">{lastPrivateKey}</div>
                    <div className="alert-hint">This secret key is shown only once. Store it securely.</div>
                </div>
            )}

            {keys.length === 0 ? (
                <div className="no-keys">
                    <p>No keys yet.</p>
                    <button className="btn-secondary" onClick={handleAdd} disabled={loadingKey === "add"}>
                        Generate First Key
                    </button>
                </div>
            ) : (
                <div className="keys-table">
                    {keys.map((key) => (
                        <div className="key-row" key={key.publicKey}>
                            <div className="key-info">
                                <div className="key-label">Public Key</div>
                                <div className="key-value">{key.publicKey}</div>
                                <div className="key-meta">Updated {key.updatedAt.toLocaleDateString()}</div>
                            </div>
                            <div className="key-actions">
                                <button className="btn-text" onClick={() => handleRemove(key.publicKey)} disabled={loadingKey === key.publicKey}>
                                    {loadingKey === key.publicKey ? "Removing..." : "Remove"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
