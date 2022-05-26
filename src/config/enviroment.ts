import { NetworkType } from '@airgap/beacon-sdk';

import { SupportedNetworks } from '@shared/types';

export const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY!;

export const FEE_RATE = process.env.REACT_APP_FEE!;
export const APP_NAME = process.env.REACT_APP_APP_NAME!;

export const AMPLITUDE_API_KEY = process.env.REACT_APP_AMPLITUDE_API_KEY!;

export const NETWORK_ID = (process.env.REACT_APP_NETWORK! ?? NetworkType.MAINNET) as SupportedNetworks;
export const EXCHANGE_RATES_URL = process.env.REACT_APP_EXCHANGE_RATES_URL!;
export const BAKERS_API = process.env.REACT_APP_BAKERS_API_URL!;

//#region BASE_URL
export const networksBaseUrls: Record<SupportedNetworks, string> = {
  [NetworkType.MAINNET]: process.env.REACT_APP_MAINNET_BASE_URL!,
  [NetworkType.HANGZHOUNET]: process.env.REACT_APP_HANGZHOUNET_BASE_URL!,
  [NetworkType.ITHACANET]: process.env.REACT_APP_ITHACANET_BASE_URL!
};

export const BASE_URL = networksBaseUrls[NETWORK_ID];
//#endregion BASE_URL

//#region TOKENS_URL
const TOKENS_URL_MAP: Record<SupportedNetworks, string> = {
  [NetworkType.MAINNET]: process.env.REACT_APP_MAINNET_TOKENS!,
  [NetworkType.HANGZHOUNET]: process.env.REACT_APP_HANGZHOUNET_TOKENS!,
  [NetworkType.ITHACANET]: process.env.REACT_APP_ITHACANET_TOKENS!
};

export const TOKENS_URL = TOKENS_URL_MAP[NETWORK_ID];
//#endregion TOKENS_URL

//#region READ_ONLY_SIGNER
export const READ_ONLY_SIGNER_PK = process.env.REACT_APP_READ_ONLY_SIGNER_PK!;
export const READ_ONLY_SIGNER_PK_HASH = process.env.REACT_APP_READ_ONLY_SIGNER_PK_HASH!;
//#endregion READ_ONLY_SIGNER

//#region FARMING_CONTRACTS
const FARMING_CONTRACTS_ADDRESSES: Record<SupportedNetworks, string> = {
  [NetworkType.MAINNET]: process.env.REACT_APP_MAINNET_FARMING_CONTRACT!,
  [NetworkType.HANGZHOUNET]: process.env.REACT_APP_HANGZHOUNET_FARMING_CONTRACT!,
  [NetworkType.ITHACANET]: process.env.REACT_APP_ITHACANET_FARMING_CONTRACT!
};

export const FARMING_CONTRACT_ADDRESS = FARMING_CONTRACTS_ADDRESSES[NETWORK_ID];
export const FARMING_REFERRER_CONTRACT = process.env.REACT_APP_FARMING_REFERRER_CONTRACT!;
//#endregion FARMING_CONTRACTS

//#region FARMING_API
export const FARMING_API_URLS: Record<SupportedNetworks, string> = {
  [NetworkType.MAINNET]: process.env.REACT_APP_MAINNET_FARMING_API_URL!,
  [NetworkType.HANGZHOUNET]: process.env.REACT_APP_HANGZHOUNET_FARMING_API_URL!,
  [NetworkType.ITHACANET]: process.env.REACT_APP_ITHACANET_FARMING_API_URL!
};

export const FARMING_API_URL = FARMING_API_URLS[NETWORK_ID];
//#endregion FARMING_API

//#region STABLESWAP_API
export const STABLESWAP_API_URLS: Record<SupportedNetworks, string> = {
  [NetworkType.MAINNET]: process.env.REACT_APP_MAINNET_STABLESWAP_API_URL!,
  [NetworkType.HANGZHOUNET]: process.env.REACT_APP_HANGZHOUNET_STABLESWAP_API_URL!,
  [NetworkType.ITHACANET]: process.env.REACT_APP_ITHACANET_STABLESWAP_API_URL!
};

export const STABLESWAP_API_URL = STABLESWAP_API_URLS[NETWORK_ID];
//#endregion STABLESWAP_API

//#region COIN_FLIP_CONTRACTS
const COIN_FLIP_CONTRACTS_ADDRESSES: Record<SupportedNetworks, string> = {
  [NetworkType.MAINNET]: process.env.REACT_APP_MAINNET_COIN_FLIP_CONTRACT!,
  [NetworkType.HANGZHOUNET]: process.env.REACT_APP_HANGZHOUNET_COIN_FLIP_CONTRACT!,
  [NetworkType.ITHACANET]: process.env.REACT_APP_ITHACANET_COIN_FLIP_CONTRACT!
};

export const COIN_FLIP_CONTRACT_ADDRESS = COIN_FLIP_CONTRACTS_ADDRESSES[NETWORK_ID];
//#endregion COIN_FLIP_CONTRACTS

//#region RPC_URLS
export const RPC_URLS: Record<SupportedNetworks, string> = {
  [NetworkType.MAINNET]: process.env.REACT_APP_MAINNET_RPC_URL!,
  [NetworkType.HANGZHOUNET]: process.env.REACT_APP_HANGZHOUNET_RPC_URL!,
  [NetworkType.ITHACANET]: process.env.REACT_APP_ITHACANET_RPC_URL!
};

export const RPC_URL = RPC_URLS[NETWORK_ID];
//#endregion RPC_URLS

//#region METADATA_API
export const METADATA_API: Record<SupportedNetworks, string> = {
  [NetworkType.MAINNET]: process.env.REACT_APP_METADATA_API_MAINNET!,
  [NetworkType.HANGZHOUNET]: process.env.REACT_APP_METADATA_API_HANGZHOUNET!,
  [NetworkType.ITHACANET]: process.env.REACT_APP_METADATA_API_ITHACANET!
};
//#endregion METADATA_API

//#region DEX_POOLS_URLS
const DEX_POOLS_URLS: Record<SupportedNetworks, string> = {
  [NetworkType.MAINNET]: process.env.REACT_APP_MAINNET_POOLS_URL!,
  [NetworkType.HANGZHOUNET]: process.env.REACT_APP_HANGZHOUNET_POOLS_URL!,
  [NetworkType.ITHACANET]: process.env.REACT_APP_ITHACANET_POOLS_URL!
};

export const DEX_POOL_URL = DEX_POOLS_URLS[NETWORK_ID];
//#region DEX_POOLS_URLS
