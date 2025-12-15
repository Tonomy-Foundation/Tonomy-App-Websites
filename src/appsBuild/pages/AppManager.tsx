import React, { useEffect, useState, useContext } from "react";
import useErrorStore from "../../common/stores/errorStore";
import { AuthContext } from "../../apps/providers/AuthProvider";
import "./AppManager.css";
import CardView from "../components/CardView";
import EmptyState from "../components/EmptyState";
import CreateAppForm from "../components/CreateAppForm";

type AppInfo = {
  appName: string;
  username: string;
  logoUrl: string;
}
const stubApps: AppInfo[] = [
  { appName: "CoinMarketCap", username: "cmc", logoUrl: "https://wp.logos-download.com/wp-content/uploads/2019/01/CoinMarketCap_Logo.png" },
  { appName: "Cool App", username: "coolapp", logoUrl: "https://play-lh.googleusercontent.com/VjoaCzJAuyZuy8AiJc_PbVSHBZBoZp-LVG7_PkyeDS0RovS-fwuI32b_ku7ETryxnA" },
];

export default function AppManager() {
  const errorStore = useErrorStore();
  const { user } = useContext(AuthContext);
  const [apps, setApps] = useState<AppInfo[]>(stubApps);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateApp = async (formData: any) => {
    let username = "Anonymous";
    if (user) {
      try {
        const accountName = await user.getAccountName();
        username = accountName.toString();
      } catch (error) {
        console.error("Failed to get account name:", error);
      }
    }

    const newApp = {
      appName: formData.appName,
      username: username,
      logoUrl: formData.logo || "https://via.placeholder.com/48?text=App",
    };
    setApps([...apps, newApp]);
    setShowCreateForm(false);
  };

  if (showCreateForm) {
    return (
      <div className="app-manager-container">
        <CreateAppForm
          onSubmit={handleCreateApp}
          onCancel={() => setShowCreateForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="app-manager-container">
      {apps?.length > 0 ? (
        <div className="apps-grid">
          <h2 className="heading">My apps</h2>
          <div className="cards-container">
            {apps.map((app, index) => (
              <CardView
                key={index}
                appName={app.appName}
                username={app.username}
                logo={app.logoUrl}
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
