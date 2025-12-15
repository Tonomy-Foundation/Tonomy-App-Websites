import React, { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { AuthContext } from "../../apps/providers/AuthProvider";

export type AppCreateInfo = {
    appName: string;
    appUsername: string;
    domain: string;
    description: string;
    logoUrl: string;
    backgroundColor: string;
    accentColor: string;
};

export type AppInfo = AppCreateInfo & {
    accountName: string; // owner account name (from user)
    ownerUsername: string; // username string
    dateCreated: Date;
    dateUpdated: Date;
    version: string;
};

export type AppsContextType = {
    apps: AppInfo[];
    addApp: (info: AppCreateInfo) => Promise<AppInfo>;
    updateApp: (username: string, info: Partial<AppCreateInfo>) => Promise<AppInfo | undefined>;
    getAppByUsername: (username: string) => AppInfo | undefined;
};

const AppsContext = createContext<AppsContextType | undefined>(undefined);

export const AppsProvider = ({ children, initialApps }: { children: ReactNode; initialApps?: AppInfo[] }) => {
    const { user } = useContext(AuthContext);
    const [apps, setApps] = useState<AppInfo[]>(initialApps || [
        {
            appName: "CoinMarketCap",
            appUsername: "@cmc",
            domain: "https://coinmarketcap.com",
            description: "Crypto market data",
            logoUrl: "https://wp.logos-download.com/wp-content/uploads/2019/01/CoinMarketCap_Logo.png",
            backgroundColor: "#ffffff",
            accentColor: "#0f62fe",
            accountName: "cmc",
            ownerUsername: "@cmc",
            dateCreated: new Date("2024-01-15"),
            dateUpdated: new Date("2024-12-10"),
            version: "1.0.0",
        },
        {
            appName: "Cool App",
            appUsername: "@coolapp",
            domain: "https://example.com",
            description: "An example cool app",
            logoUrl: "https://play-lh.googleusercontent.com/VjoaCzJAuyZuy8AiJc_PbVSHBZBoZp-LVG7_PkyeDS0RovS-fwuI32b_ku7ETryxnA",
            backgroundColor: "#ffffff",
            accentColor: "#111827",
            accountName: "coolapp",
            ownerUsername: "@coolapp",
            dateCreated: new Date("2024-03-20"),
            dateUpdated: new Date("2024-12-05"),
            version: "2.1.3",
        }
    ]);

    const addApp = async (info: AppCreateInfo): Promise<AppInfo> => {
        let accountName = "Anonymous";
        if (user) {
            try {
                const name = await user.getAccountName();
                accountName = name?.toString?.() || String(name);
            } catch (e) {
                // ignore and use default
            }
        }

        const newApp: AppInfo = {
            ...info,
            accountName,
            ownerUsername: info.appUsername,
            dateCreated: new Date(),
            dateUpdated: new Date(),
            version: "1.0.0",
        };
        setApps((prev) => [newApp, ...prev]);
        return newApp;
    };



    const getAppByUsername = (username: string) => {
        // Remove @ prefix if present
        const cleanUsername = username.startsWith("@") ? username.slice(1) : username;
        return apps.find((a) => a.appUsername === `@${cleanUsername}` || a.appUsername === cleanUsername);
    };

    const updateApp = async (username: string, updates: Partial<AppCreateInfo>): Promise<AppInfo | undefined> => {
        const cleanUsername = username.startsWith("@") ? username.slice(1) : username;
        const existingApp = apps.find((a) => a.appUsername === `@${cleanUsername}` || a.appUsername === cleanUsername);
        
        if (!existingApp) return undefined;

        const updatedApp: AppInfo = {
            ...existingApp,
            ...updates,
            dateUpdated: new Date(),
        };

        setApps((prev) => prev.map((a) => (a.appUsername === existingApp.appUsername ? updatedApp : a)));
        return updatedApp;
    };

    const value = useMemo(() => ({ apps, addApp, updateApp, getAppByUsername }), [apps]);

    return <AppsContext.Provider value={value}>{children}</AppsContext.Provider>;
};

export const useApps = () => {
    const ctx = useContext(AppsContext);
    if (!ctx) throw new Error("useApps must be used within AppsProvider");
    return ctx;
};
