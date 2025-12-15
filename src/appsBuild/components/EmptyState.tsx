import React from "react";
import AppNotFound from "../assets/no-app-found.png";
import "./EmptyState.css";

export type EmptyStateProps = {
    onCreateApp: () => void;
};

const EmptyState = (props: EmptyStateProps) => {
    return (
        <div className="empty-state-container">
            <div className="empty-state-content">
                <img src={AppNotFound} alt="No apps" className="empty-state-image" />
                <h2 className="empty-state-title">No applications yet</h2>
                <p className="empty-state-description">
                    Get started by creating your first application
                </p>
                <button
                    className="empty-state-button"
                    onClick={props.onCreateApp}
                >
                    Create your first app
                </button>
            </div>
        </div>
    );
};

export default EmptyState;
