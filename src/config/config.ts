import { defined } from '@shared/helpers';
import { QSNetwork, QSNets, Standard, Token } from '@shared/types/types';

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
  description: 'Tezos mainnet',
  disabled: false
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

export const FARMING_API_URLS = {
  [QSNets.mainnet]: defined(process.env.REACT_APP_MAINNET_FARMING_CONTRACT),
  [QSNets.hangzhounet]: defined(process.env.REACT_APP_HANGZHOUNET_FARMING_CONTRACT)
};

export const NETWORK_ID = (process.env.NETWORK ?? QSNets.mainnet) as QSNets;
export const FARMING_API_URL = FARMING_API_URLS[NETWORK_ID];

export const DEFAULT_DECIMALS = 6;

export const IPFS_GATEWAY = defined(process.env.IPFS_GATEWAY);

export const TEZOS_TOKEN: Token = {
  type: Standard.Fa12,
  contractAddress: 'tez',
  isWhitelisted: true,
  metadata: {
    decimals: 6,
    name: 'Tezos',
    symbol: 'TEZ',
    thumbnailUri: `${IPFS_GATEWAY}/Qmf3brydfr8c6CKGUUu73Dd7wfBw66Zbzof5E1BWGeU222`
  }
};

export const FARM_REWARD_UPDATE_INTERVAL = 1000;
export const FARM_USER_INFO_UPDATE_INTERVAL = 30000;

const FARMING_CONTRACTS_ADDRESSES = {
  [QSNets.mainnet]: defined(process.env.REACT_APP_MAINNET_FARMING_CONTRACT),
  [QSNets.hangzhounet]: defined(process.env.REACT_APP_HANGZHOUNET_FARMING_CONTRACT)
};
export const FARMING_CONTRACT_ADDRESS = FARMING_CONTRACTS_ADDRESSES[NETWORK_ID];

export const MS_IN_SECOND = 1000;

export const READ_ONLY_SIGNER_PK = defined(process.env.NEXT_PUBLIC_READ_ONLY_SIGNER_PK);
export const READ_ONLY_SIGNER_PK_HASH = defined(process.env.NEXT_PUBLIC_READ_ONLY_SIGNER_PK_HASH);
export const MAINNET_LAMBDA_VIEW_CONTRACT = defined(process.env.NEXT_PUBLIC_MAINNET_LAMBDA_VIEW_CONTRACT);
export const HANGZHOUNET_LAMBDA_VIEW_CONTRACT = defined(process.env.NEXT_PUBLIC_HANGZHOUNET_LAMBDA_VIEW_CONTRACT);
export const KNOWN_LAMBDA_CONTRACTS = new Map([
  ['NetXdQprcVkpaWU', MAINNET_LAMBDA_VIEW_CONTRACT],
  ['NetXZSsxBpMQeAT', HANGZHOUNET_LAMBDA_VIEW_CONTRACT]
]);
