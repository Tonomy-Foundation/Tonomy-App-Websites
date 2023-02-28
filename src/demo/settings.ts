import { defaultConfig } from "./config/config";
import { stagingConfig } from "./config/config.staging";

// cannot use NODE_ENV as it is always "production" on `npm run build`
const env = import.meta.env.REACT_APP_NODE_ENV || 'development';
console.log(import.meta.env)
console.log(`REACT_APP_NODE_ENV=${env}`);

export type ConfigType = {
    blockchainUrl: string;
    theme: {
        primaryColor: string;
        secondaryColor: string;
        tertiaryColor: string;
    };
    appLogoUrl:string;
    appName: string;
    ecosystemName: string;
    appSlogan: string;
    images: {
        logo48: string;
        logo1024: string;
    };
    ssoWebsiteOrigin: string;
};

type SettingsType = {
    env: string;
    config: ConfigType;
    isProduction: () => boolean;
};
let config: ConfigType;
const settings: SettingsType = {
    env,
    isProduction: () => settings.env === 'production',
} as SettingsType;

switch (env) {
    case 'test':
    case 'local':
    case 'development':
        
        config = defaultConfig
        break;
    case 'staging':
        config = stagingConfig;
        break;
    case 'production':
        config = defaultConfig;
        // TODO add production config when ready
        break;
    default:
        throw new Error('Unknown environment: ' + env);
}

if (import.meta.env.VITE_BLOCKCHAIN_URL) {
    console.log(`Using BLOCKCHAIN_URL from env:  ${import.meta.env.VITE_BLOCKCHAIN_URL}`);
    config.blockchainUrl = import.meta.env.VITE_BLOCKCHAIN_URL;
}

if (import.meta.env.VITE_SSO_WEBSITE_ORIGIN) {
    console.log(`Using SSO_WEBSITE_ORIGIN from env:  ${import.meta.env.VITE_SSO_WEBSITE_ORIGIN}`);
    config.ssoWebsiteOrigin = import.meta.env.VITE_SSO_WEBSITE_ORIGIN;
}

settings.config = config;

export default settings;
