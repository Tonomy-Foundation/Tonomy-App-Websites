import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApps } from "../context/AppsContext";
import CreateAppForm from "../components/CreateAppForm";

export default function AppEditor() {
    const { username } = useParams();
    const navigate = useNavigate();
    const { getAppByUsername } = useApps();
    const app = username ? getAppByUsername(username) : undefined;

    if (!app) {
        return (
            <div className="app-editor-container">
                <div className="editor-content">
                    <div className="editor-card">
                        <h2>App not found</h2>
                        <p>The requested application could not be found.</p>
                    </div>
                </div>
            </div>
        );
    }

    const handleSubmit = () => {
        navigate(`/build/apps/${app.appUsername}`);
    };

    const handleCancel = () => {
        navigate(`/build/apps/${app.appUsername}`);
    };

    return (
        <CreateAppForm
            mode="edit"
            initialApp={app}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
        />
    );
}
