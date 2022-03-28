import { QSNetwork } from '../types/types';

export const APP_NAME = 'QuipuSwap Xmas';
export const SAVED_LISTS_KEY = 'savedCustomLists';
export const SAVED_TOKENS_KEY = 'savedCustomTokens';
export const SAVED_BAKERS_KEY = 'savedCustomBakers';
export const SAVED_TERMS_KEY = 'savedTerms';
export const SAVED_ANALYTICS_KEY = 'savedAnalytics';
export const BASE_URL = '';
export const LAST_USED_CONNECTION_KEY = 'lastUsedConnection';
export const LAST_USED_ACCOUNT_KEY = 'lastUsedAccount';
export const NETWORK_ID_KEY = 'networkId';

export const METADATA_API_MAINNET = 'https://metadata.templewallet.com/metadata'; // process.env.NEXT_PUBLIC_METADATA_API_MAINNET!; // 'ex https://<host>:<port>/metadata'
export const METADATA_API_TESTNET = 'http://165.232.69.152:3002/metadata'; // process.env.NEXT_PUBLIC_METADATA_API_TESTNET!;

export const MAINNET_NETWORK: QSNetwork = {
  id: 'mainnet',
  connectType: 'default',

  name: 'Tezos Mainnet',

  type: 'main',
  rpcBaseURL: 'https://mainnet-node.madfish.solutions/',
  metadata: METADATA_API_MAINNET,
  description:
    'Tezos mainnet',
  disabled:            false

};

export const HANGZHOUNET_NETWORK: QSNetwork = {
  id: 'hangzhounet',
  connectType: 'default',
  name: 'Hangzhounet Testnet',
  type: 'test',
  rpcBaseURL: 'https://hangzhounet-node.madfish.xyz',
  metadata: METADATA_API_TESTNET,
  description: 'Hangzhounet testnet',
  disabled: false
};

export const ALL_NETWORKS = [MAINNET_NETWORK, HANGZHOUNET_NETWORK];

export const DEFAULT_NETWORK = MAINNET_NETWORK;
