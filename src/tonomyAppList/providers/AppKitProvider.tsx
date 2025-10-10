
import { createAppKit } from "@reown/appkit/react";

import { WagmiProvider } from "wagmi";
import { mainnet } from "@reown/appkit/networks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import type { AppKitNetwork } from "@reown/appkit/networks";
import settings from "../../common/settings";

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Get projectId from https://dashboard.reown.com
export const projectId = settings.config.reownProjectId;

// 2. Create a metadata object - optional
const metadata = {
  name: "Tonomy Swap",
  description: "Swap your Tonomy coins quickly and securely",
  url: settings.config.demoWebsiteOrigin,
  icons: [settings.config.images.logo48],
};

// 3. Set the networks
export const networks = [mainnet] as [AppKitNetwork, ...AppKitNetwork[]];

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});

// 5. Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
});

export function AppKitProvider({ children }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
