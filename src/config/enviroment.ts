// import { defined } from '@shared/helpers';
import { QSNets } from '@shared/types';

export const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY!;

export const FEE_RATE = process.env.REACT_APP_FEE!;
export const APP_NAME = process.env.REACT_APP_APP_NAME!;

export const NETWORK_ID = (process.env.REACT_APP_NETWORK! ?? QSNets.mainnet) as QSNets;
export const EXCHANGE_RATES_URL = process.env.REACT_APP_EXCHANGE_RATES_URL!;
export const BAKERS_API = process.env.REACT_APP_BAKERS_API_URL!;
export const QUIPUSWAP_OLD_VERSION_LINK = process.env.REACT_APP_QUIPUSWAP_OLD_VERSION_LINK!;
export const APOLLO_CLIENT_ENDPOINT = process.env.REACT_APP_APOLLO_CLIENT_ENDPOINT!;

const REACT_APP_MAINNET_BASE_URL = process.env.REACT_APP_MAINNET_BASE_URL!;
const REACT_APP_HANGZHOUNET_BASE_URL = process.env.REACT_APP_HANGZHOUNET_BASE_URL!;
const REACT_APP_ITHACANET_BASE_URL = process.env.REACT_APP_ITHACANET_BASE_URL!;

//#region BASE_URL
export const networksBaseUrls: Record<QSNets, string> = {
  [QSNets.mainnet]: REACT_APP_MAINNET_BASE_URL,
  [QSNets.hangzhounet]: REACT_APP_HANGZHOUNET_BASE_URL,
  [QSNets.ithacanet]: REACT_APP_ITHACANET_BASE_URL
};

export const BASE_URL = networksBaseUrls[NETWORK_ID];
//#endregion BASE_URL

//#region TOKENS_URL
const TOKENS_URL_MAP: Record<QSNets, string> = {
  [QSNets.mainnet]: process.env.REACT_APP_MAINNET_TOKENS!,
  [QSNets.hangzhounet]: process.env.REACT_APP_HANGZHOUNET_TOKENS!,
  [QSNets.ithacanet]: process.env.REACT_APP_ITHACANET_TOKENS!
};

export const TOKENS_URL = TOKENS_URL_MAP[NETWORK_ID];
//#endregion TOKENS_URL

//#region READ_ONLY_SIGNER
export const READ_ONLY_SIGNER_PK = process.env.REACT_APP_READ_ONLY_SIGNER_PK!;
export const READ_ONLY_SIGNER_PK_HASH = process.env.REACT_APP_READ_ONLY_SIGNER_PK_HASH!;
//#endregion READ_ONLY_SIGNER

//#region FARMING_CONTRACTS
const FARMING_CONTRACTS_ADDRESSES: Record<QSNets, string> = {
  [QSNets.mainnet]: process.env.REACT_APP_MAINNET_FARMING_CONTRACT!,
  [QSNets.hangzhounet]: process.env.REACT_APP_HANGZHOUNET_FARMING_CONTRACT!,
  [QSNets.ithacanet]: process.env.REACT_APP_ITHACANET_FARMING_CONTRACT!
};

export const FARMING_CONTRACT_ADDRESS = FARMING_CONTRACTS_ADDRESSES[NETWORK_ID];
export const FARMING_REFERRER_CONTRACT = process.env.REACT_APP_FARMING_REFERRER_CONTRACT!;
//#endregion FARMING_CONTRACTS

//#region FARMING_API
export const FARMING_API_URLS: Record<QSNets, string> = {
  [QSNets.mainnet]: process.env.REACT_APP_MAINNET_FARMING_API_URL!,
  [QSNets.hangzhounet]: process.env.REACT_APP_HANGZHOUNET_FARMING_API_URL!,
  [QSNets.ithacanet]: process.env.REACT_APP_ITHACANET_FARMING_API_URL!
};

export const FARMING_API_URL = FARMING_API_URLS[NETWORK_ID];
//#endregion FARMING_API

//#region RPC_URLS
export const RPC_URLS: Record<QSNets, string> = {
  [QSNets.mainnet]: process.env.REACT_APP_MAINNET_RPC_URL!,
  [QSNets.hangzhounet]: process.env.REACT_APP_HANGZHOUNET_RPC_URL!,
  [QSNets.ithacanet]: process.env.REACT_APP_ITHACANET_RPC_URL!
};

export const RPC_URL = RPC_URLS[NETWORK_ID];
//#endregion RPC_URLS

//#region METADATA_API
export const METADATA_API: Record<QSNets, string> = {
  [QSNets.mainnet]: process.env.REACT_APP_METADATA_API_MAINNET!,
  [QSNets.hangzhounet]: process.env.REACT_APP_METADATA_API_HANGZHOUNET!,
  [QSNets.ithacanet]: process.env.REACT_APP_EXCHANGE_RATES_URL!
};
//#endregion METADATA_API

//#region DEX_POOLS_URLS
const DEX_POOLS_URLS: Record<QSNets, string> = {
  [QSNets.mainnet]: process.env.REACT_APP_MAINNET_POOLS_URL!,
  [QSNets.hangzhounet]: process.env.REACT_APP_HANGZHOUNET_POOLS_URL!,
  [QSNets.ithacanet]: process.env.REACT_APP_ITHACANET_POOLS_URL!
};

export const DEX_POOL_URL = DEX_POOLS_URLS[NETWORK_ID];
//#region DEX_POOLS_URLS
