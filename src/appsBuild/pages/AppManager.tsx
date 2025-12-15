import React, { useState } from "react";
import "./AppManager.css";
import CardView from "../components/CardView";
import EmptyState from "../components/EmptyState";
import CreateAppForm from "../components/CreateAppForm";
import { useApps } from "../context/AppsContext";
import { useNavigate } from "react-router-dom";

export default function AppManager() {
  const { apps } = useApps();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const navigate = useNavigate();

  const handleCreateApp = async () => setShowCreateForm(false);

  if (showCreateForm) {
    return (
      <div className="app-manager-content">
        <CreateAppForm onSubmit={handleCreateApp} onCancel={() => setShowCreateForm(false)} />
      </div>
    );
  }

  return (
    <div className="app-manager-content">
      {apps?.length > 0 ? (
        <div className="apps-section">
          <div className="cards-container">
            {apps.map((app) => (
              <CardView
                key={app.appUsername}
                appName={app.appName}
                accountName={app.accountName}
                domain={app.domain}
                logo={app.logoUrl}
                onClick={() => navigate(`/build/apps/${app.appUsername}`)}
              />
            ))}
          </div>
        </div>
      ) : (
        <EmptyState onCreateApp={() => setShowCreateForm(true)} />
      )}

      {!showCreateForm && (
        <button
          className="bottom-left-button"
          onClick={() => setShowCreateForm(true)}
          title="Create new app"
        >
          +
        </button>
      )}
    </div>
  );
}
