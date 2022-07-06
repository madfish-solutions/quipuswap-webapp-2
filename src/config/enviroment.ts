import { NetworkType } from '@airgap/beacon-sdk';

import { SupportedNetworks } from '@shared/types';

export const AMPLITUDE_API_KEY = process.env.REACT_APP_AMPLITUDE_API_KEY!;

export const NETWORK_ID = (process.env.REACT_APP_NETWORK! ?? NetworkType.MAINNET) as SupportedNetworks;

//#region BASE_URL
export const networksBaseUrls: Record<SupportedNetworks, string> = {
  [NetworkType.MAINNET]: process.env.REACT_APP_MAINNET_BASE_URL!,
  [NetworkType.GHOSTNET]: process.env.REACT_APP_GHOSTNET_BASE_URL!
};

export const BASE_URL = networksBaseUrls[NETWORK_ID];
//#endregion BASE_URL

export const RPC_URL = process.env.REACT_APP_RPC_URL!;

export const TZKT_EXPLORER_URL = process.env.REACT_APP_TZKT_EXPLORER_URL!;

export const TOKEN_TO_TOKEN_DEX = process.env.REACT_APP_TTDEX_CONTRACT!;
export const FARMING_CONTRACT_ADDRESS = process.env.REACT_APP_FARMING_CONTRACT!;
export const COINFLIP_CONTRACT_ADDRESS = process.env.REACT_APP_COINFLIP_CONTRACT!;

export const METADATA_API = process.env.REACT_APP_METADATA_API_URL!;
export const DEX_POOL_URL = process.env.REACT_APP_POOLS_URL!;

export const FARMING_API_URL = process.env.REACT_APP_FARMING_API_URL!;
export const STABLESWAP_API_URL = process.env.REACT_APP_STABLESWAP_API_URL!;
