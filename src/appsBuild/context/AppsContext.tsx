import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";
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

export type SmartContractInfo = {
  version: number;
  deployedOn: Date;
  ramUsedMB: number;
  ramPurchasedMB: number;
  sourceCodeUrl?: string;
  wasmFile?: File;
  abiFile?: File;
};

export type AccountKey = {
  publicKey: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AppInfo = AppCreateInfo & {
  accountName: string; // owner account name (from user)
  ownerUsername: string; // username string
  dateCreated: Date;
  dateUpdated: Date;
  version: number;
  plan: "basic" | "pro"; // subscription plan
  smartContract?: SmartContractInfo; // optional smart contract deployment
  accountKeys: AccountKey[];
};

export type AppsContextType = {
  apps: AppInfo[];
  showWelcome: boolean;
  setShowWelcome: (show: boolean) => void;
  addApp: (info: AppCreateInfo) => Promise<AppInfo>;
  updateApp: (
    username: string,
    info: Partial<AppCreateInfo>,
  ) => Promise<AppInfo | undefined>;
  getAppByUsername: (username: string) => AppInfo | undefined;
  updateAppPlan: (
    username: string,
    plan: "basic" | "pro",
  ) => Promise<AppInfo | undefined>;
  deploySmartContract: (
    username: string,
    wasmFile: File,
    abiFile: File,
    sourceCodeUrl?: string,
  ) => Promise<AppInfo | undefined>;
  updateSmartContract: (
    username: string,
    wasmFile: File,
    abiFile: File,
    sourceCodeUrl?: string,
  ) => Promise<AppInfo | undefined>;
  updateSmartContractRAM: (
    username: string,
    ramPurchasedMB: number,
  ) => Promise<AppInfo | undefined>;
  sellSmartContractRAM: (
    username: string,
    ramToSellMB: number,
  ) => Promise<AppInfo | undefined>;
  addAccountKey: (
    username: string,
  ) => Promise<{ app: AppInfo; privateKey: string } | undefined>;
  removeAccountKey: (
    username: string,
    publicKey: string,
  ) => Promise<AppInfo | undefined>;
  clearAllApps: () => void;
};

const AppsContext = createContext<AppsContextType | undefined>(undefined);

export const AppsProvider = ({
  children,
  initialApps,
}: {
  children: ReactNode;
  initialApps?: AppInfo[];
}) => {
  const { user } = useContext(AuthContext);
  const [apps, setApps] = useState<AppInfo[]>(
    initialApps || [
      {
        appName: "CoinMarketCap",
        appUsername: "@cmc",
        domain: "https://coinmarketcap.com",
        description: "Crypto market data",
        logoUrl:
          "https://wp.logos-download.com/wp-content/uploads/2019/01/CoinMarketCap_Logo.png",
        backgroundColor: "#ffffff",
        accentColor: "#0f62fe",
        accountName: "cmc",
        ownerUsername: "@cmcowner",
        dateCreated: new Date("2024-01-15"),
        dateUpdated: new Date("2024-12-10"),
        version: 1,
        plan: "basic",
        accountKeys: [],
      },
      {
        appName: "Cool App",
        appUsername: "@coolapp",
        domain: "https://example.com",
        description: "An example cool app",
        logoUrl:
          "https://play-lh.googleusercontent.com/VjoaCzJAuyZuy8AiJc_PbVSHBZBoZp-LVG7_PkyeDS0RovS-fwuI32b_ku7ETryxnA",
        backgroundColor: "#ffffff",
        accentColor: "#111827",
        accountName: "coolapp",
        ownerUsername: "@coolappowner",
        dateCreated: new Date("2024-03-20"),
        dateUpdated: new Date("2024-12-05"),
        version: 2,
        plan: "basic",
        accountKeys: [],
      },
    ],
  );
  const [showWelcome, setShowWelcome] = useState(true);

  const generateHexString = (length: number) => {
    try {
      const randomBytes = new Uint8Array(length);
      crypto.getRandomValues(randomBytes);
      return Array.from(randomBytes)
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
    } catch (_) {
      // Fallback for environments without crypto
      const chars = "abcdef0123456789";
      let result = "";
      for (let i = 0; i < length * 2; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    }
  };

  const generateKeyPair = () => {
    const privateKey = `PVT_${generateHexString(32)}`;
    const publicKey = `PUB_${generateHexString(32)}`;
    return { privateKey, publicKey };
  };

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
      version: 1,
      plan: "basic",
      accountKeys: [],
    };
    setApps((prev) => [newApp, ...prev]);
    return newApp;
  };

  const getAppByUsername = (username: string) => {
    // Remove @ prefix if present
    const cleanUsername = username.startsWith("@")
      ? username.slice(1)
      : username;
    return apps.find(
      (a) =>
        a.appUsername === `@${cleanUsername}` ||
        a.appUsername === cleanUsername,
    );
  };

  const updateApp = async (
    username: string,
    updates: Partial<AppCreateInfo>,
  ): Promise<AppInfo | undefined> => {
    const cleanUsername = username.startsWith("@")
      ? username.slice(1)
      : username;
    const existingApp = apps.find(
      (a) =>
        a.appUsername === `@${cleanUsername}` ||
        a.appUsername === cleanUsername,
    );

    if (!existingApp) return undefined;

    const updatedApp: AppInfo = {
      ...existingApp,
      ...updates,
      dateUpdated: new Date(),
    };

    setApps((prev) =>
      prev.map((a) =>
        a.appUsername === existingApp.appUsername ? updatedApp : a,
      ),
    );
    return updatedApp;
  };

  const updateAppPlan = async (
    username: string,
    plan: "basic" | "pro",
  ): Promise<AppInfo | undefined> => {
    const cleanUsername = username.startsWith("@")
      ? username.slice(1)
      : username;
    const existingApp = apps.find(
      (a) =>
        a.appUsername === `@${cleanUsername}` ||
        a.appUsername === cleanUsername,
    );

    if (!existingApp) return undefined;

    const updatedApp: AppInfo = {
      ...existingApp,
      plan,
      dateUpdated: new Date(),
    };

    setApps((prev) =>
      prev.map((a) =>
        a.appUsername === existingApp.appUsername ? updatedApp : a,
      ),
    );
    return updatedApp;
  };

  const deploySmartContract = async (
    username: string,
    wasmFile: File,
    abiFile: File,
    sourceCodeUrl?: string,
  ): Promise<AppInfo | undefined> => {
    const cleanUsername = username.startsWith("@")
      ? username.slice(1)
      : username;
    const existingApp = apps.find(
      (a) =>
        a.appUsername === `@${cleanUsername}` ||
        a.appUsername === cleanUsername,
    );

    if (!existingApp) return undefined;

    const smartContract: SmartContractInfo = {
      version: 1,
      deployedOn: new Date(),
      ramUsedMB: 1500,
      ramPurchasedMB: 2000,
      sourceCodeUrl,
      wasmFile,
      abiFile,
    };

    const updatedApp: AppInfo = {
      ...existingApp,
      smartContract,
      dateUpdated: new Date(),
    };

    setApps((prev) =>
      prev.map((a) =>
        a.appUsername === existingApp.appUsername ? updatedApp : a,
      ),
    );
    return updatedApp;
  };

  const updateSmartContract = async (
    username: string,
    wasmFile: File,
    abiFile: File,
    sourceCodeUrl?: string,
  ): Promise<AppInfo | undefined> => {
    const cleanUsername = username.startsWith("@")
      ? username.slice(1)
      : username;
    const existingApp = apps.find(
      (a) =>
        a.appUsername === `@${cleanUsername}` ||
        a.appUsername === cleanUsername,
    );

    if (!existingApp || !existingApp.smartContract) return undefined;

    const currentVersion = existingApp.smartContract.version;
    const newVersion = currentVersion + 1;

    const updatedContract: SmartContractInfo = {
      ...existingApp.smartContract,
      version: newVersion,
      deployedOn: new Date(),
      sourceCodeUrl:
        sourceCodeUrl !== undefined
          ? sourceCodeUrl
          : existingApp.smartContract.sourceCodeUrl,
      wasmFile,
      abiFile,
    };

    const updatedApp: AppInfo = {
      ...existingApp,
      smartContract: updatedContract,
      dateUpdated: new Date(),
    };

    setApps((prev) =>
      prev.map((a) =>
        a.appUsername === existingApp.appUsername ? updatedApp : a,
      ),
    );
    return updatedApp;
  };

  const updateSmartContractRAM = async (
    username: string,
    ramPurchasedMB: number,
  ): Promise<AppInfo | undefined> => {
    const cleanUsername = username.startsWith("@")
      ? username.slice(1)
      : username;
    const existingApp = apps.find(
      (a) =>
        a.appUsername === `@${cleanUsername}` ||
        a.appUsername === cleanUsername,
    );

    if (!existingApp || !existingApp.smartContract) return undefined;

    const updatedContract: SmartContractInfo = {
      ...existingApp.smartContract,
      ramPurchasedMB,
    };

    const updatedApp: AppInfo = {
      ...existingApp,
      smartContract: updatedContract,
      dateUpdated: new Date(),
    };

    setApps((prev) =>
      prev.map((a) =>
        a.appUsername === existingApp.appUsername ? updatedApp : a,
      ),
    );
    return updatedApp;
  };

  const sellSmartContractRAM = async (
    username: string,
    ramToSellMB: number,
  ): Promise<AppInfo | undefined> => {
    const cleanUsername = username.startsWith("@")
      ? username.slice(1)
      : username;
    const existingApp = apps.find(
      (a) =>
        a.appUsername === `@${cleanUsername}` ||
        a.appUsername === cleanUsername,
    );

    if (!existingApp || !existingApp.smartContract) return undefined;

    const newRamPurchased =
      existingApp.smartContract.ramPurchasedMB - ramToSellMB;

    // Ensure we don't sell more than available (keeping used RAM)
    if (newRamPurchased < existingApp.smartContract.ramUsedMB) return undefined;

    const updatedContract: SmartContractInfo = {
      ...existingApp.smartContract,
      ramPurchasedMB: newRamPurchased,
    };

    const updatedApp: AppInfo = {
      ...existingApp,
      smartContract: updatedContract,
      dateUpdated: new Date(),
    };

    setApps((prev) =>
      prev.map((a) =>
        a.appUsername === existingApp.appUsername ? updatedApp : a,
      ),
    );
    return updatedApp;
  };

  const addAccountKey = async (
    username: string,
  ): Promise<{ app: AppInfo; privateKey: string } | undefined> => {
    const cleanUsername = username.startsWith("@")
      ? username.slice(1)
      : username;
    const existingApp = apps.find(
      (a) =>
        a.appUsername === `@${cleanUsername}` ||
        a.appUsername === cleanUsername,
    );

    if (!existingApp) return undefined;

    const { publicKey, privateKey } = generateKeyPair();
    const newKey: AccountKey = {
      publicKey,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedApp: AppInfo = {
      ...existingApp,
      accountKeys: [...(existingApp.accountKeys || []), newKey],
      dateUpdated: new Date(),
    };

    setApps((prev) =>
      prev.map((a) =>
        a.appUsername === existingApp.appUsername ? updatedApp : a,
      ),
    );
    return { app: updatedApp, privateKey };
  };

  const updateAccountKey = async (
    username: string,
    publicKey: string,
  ): Promise<{ app: AppInfo; privateKey: string } | undefined> => {
    const cleanUsername = username.startsWith("@")
      ? username.slice(1)
      : username;
    const existingApp = apps.find(
      (a) =>
        a.appUsername === `@${cleanUsername}` ||
        a.appUsername === cleanUsername,
    );

    if (!existingApp) return undefined;

    const { publicKey: newPublicKey, privateKey } = generateKeyPair();

    const updatedKeys = (existingApp.accountKeys || []).map((k) =>
      k.publicKey === publicKey
        ? { ...k, publicKey: newPublicKey, updatedAt: new Date() }
        : k,
    );

    const updatedApp: AppInfo = {
      ...existingApp,
      accountKeys: updatedKeys,
      dateUpdated: new Date(),
    };

    setApps((prev) =>
      prev.map((a) =>
        a.appUsername === existingApp.appUsername ? updatedApp : a,
      ),
    );
    return { app: updatedApp, privateKey };
  };

  const removeAccountKey = async (
    username: string,
    publicKey: string,
  ): Promise<AppInfo | undefined> => {
    const cleanUsername = username.startsWith("@")
      ? username.slice(1)
      : username;
    const existingApp = apps.find(
      (a) =>
        a.appUsername === `@${cleanUsername}` ||
        a.appUsername === cleanUsername,
    );

    if (!existingApp) return undefined;

    const updatedKeys = (existingApp.accountKeys || []).filter(
      (k) => k.publicKey !== publicKey,
    );

    const updatedApp: AppInfo = {
      ...existingApp,
      accountKeys: updatedKeys,
      dateUpdated: new Date(),
    };

    setApps((prev) =>
      prev.map((a) =>
        a.appUsername === existingApp.appUsername ? updatedApp : a,
      ),
    );
    return updatedApp;
  };

  const clearAllApps = () => {
    setApps([]);
  };

  const value = useMemo(
    () => ({
      apps,
      showWelcome,
      setShowWelcome,
      addApp,
      updateApp,
      getAppByUsername,
      updateAppPlan,
      deploySmartContract,
      updateSmartContract,
      updateSmartContractRAM,
      sellSmartContractRAM,
      addAccountKey,
      updateAccountKey,
      removeAccountKey,
      clearAllApps,
    }),
    [apps, showWelcome],
  );

  return <AppsContext.Provider value={value}>{children}</AppsContext.Provider>;
};

export const useApps = () => {
  const ctx = useContext(AppsContext);
  if (!ctx) throw new Error("useApps must be used within AppsProvider");
  return ctx;
};
