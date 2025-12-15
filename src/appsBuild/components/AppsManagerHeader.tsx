import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AppsIcon from "@mui/icons-material/Apps";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import "./AppsManagerHeader.css";

export default function AppsManagerHeader() {
    const navigate = useNavigate();
    const location = useLocation();

    // Show back button only on app viewer/editor pages
    const showBackButton = location.pathname.includes("/apps/@");

    const handleBack = () => {
        navigate("/build/apps");
    };

    return (
        <header className="apps-manager-header">
            <div className="header-content">
                {showBackButton && (
                    <IconButton
                        onClick={handleBack}
                        className="back-button"
                        size="small"
                    >
                        <ArrowBackIcon />
                    </IconButton>
                )}
                <AppsIcon className="header-icon" />
                <h1 className="header-title">Apps Manager</h1>
            </div>
        </header>
    );
}
