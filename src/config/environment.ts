import { NetworkType } from '@airgap/beacon-sdk';

import { SupportedNetworks } from '@shared/types';

import PACKAGE_JSON from '../../package.json';

export const PROJECT_NAME = process.env.PROJECT_NAME ?? PACKAGE_JSON.name;
export const VERSION = process.env.VERSION ?? PACKAGE_JSON.version;

export const AMPLITUDE_API_KEY = process.env.REACT_APP_AMPLITUDE_API_KEY!;
export const SENTRY_DSN = process.env.REACT_APP_SENTRY_DSN!;

export const NETWORK_ID = (process.env.REACT_APP_NETWORK! ?? NetworkType.MAINNET) as SupportedNetworks;

//#region BASE_URL
export const networksBaseUrls: Record<SupportedNetworks, string> = {
  [NetworkType.MAINNET]: process.env.REACT_APP_MAINNET_BASE_URL!,
  [NetworkType.GHOSTNET]: process.env.REACT_APP_GHOSTNET_BASE_URL!
};

export const BASE_URL = networksBaseUrls[NETWORK_ID];
//#endregion BASE_URL

export const RPC_URLS = process.env.REACT_APP_RPC_URLS?.split(',') ?? [process.env.REACT_APP_RPC_URL!];

export const TZKT_EXPLORER_URL = process.env.REACT_APP_TZKT_EXPLORER_URL!;

export const TOKEN_TO_TOKEN_DEX = process.env.REACT_APP_TTDEX_CONTRACT!;
export const FARMING_CONTRACT_ADDRESS = process.env.REACT_APP_FARMING_CONTRACT!;
export const COINFLIP_CONTRACT_ADDRESS = process.env.REACT_APP_COINFLIP_CONTRACT!;
export const DEX_TWO_CONTRACT_ADDRESS = process.env.REACT_APP_DEX_TWO_CONTRACT_ADDRESS!;
export const DEX_V3_FACTORY_ADDRESS = process.env.REACT_APP_DEX_V3_FACTORY_ADDRESS!;
export const STABLESWAP_FACTORY_CONTRACT_ADDRESS = process.env.REACT_APP_STABLESWAP_FACTORY_CONTRACT_ADDRESS!;
export const STABLESWAP_V2_FACTORY_ADDRESS = process.env.REACT_APP_STABLESWAP_V2_FACTORY_ADDRESS;
export const STABLESWAP_STRATEGY_FACTORY_ADDRESS = process.env.REACT_APP_STABLESWAP_STRATEGY_FACTORY_ADDRESS!;

export const TEMPLEWALLET_API_URL = process.env.REACT_APP_TEMPLEWALLET_API_URL!;
export const METADATA_API = process.env.REACT_APP_METADATA_API_URL!;
export const DEX_POOL_URL = process.env.REACT_APP_POOLS_URL!;
export const THREE_ROUTE_API_URL = process.env.REACT_APP_THREE_ROUTE_API_URL;
export const THREE_ROUTE_API_AUTH_TOKEN = process.env.REACT_APP_THREE_ROUTE_API_AUTH_TOKEN;
export const THREE_ROUTE_CONTRACT_ADDRESS = process.env.REACT_APP_THREE_ROUTE_CONTRACT_ADDRESS;

export const FARMING_API_URL = process.env.REACT_APP_FARMING_API_URL!;
export const STABLESWAP_API_URL = process.env.REACT_APP_STABLESWAP_API_URL!;
export const LIQUIDITY_API_URL = process.env.REACT_APP_LIQUIDITY_API_URL!;
export const CLAIM_BOT_URL = process.env.REACT_APP_CLAIM_BOT_URL!;

export const TZKT_API = process.env.REACT_APP_TZKT_API!;
