import { QSNetwork, WhitelistedToken } from '@utils/types';

export const COLOR_MODE_STORAGE_KEY = 'theme';

export const DEFAULT_DECIMALS = 6;

export const QUIPUSWAP = 'https://quipuswap.com/';
export const QUIPUSWAP_TRADE = 'https://quipuswap.com/swap';
export const QUIPUSWAP_INVEST = 'https://quipuswap.com/invest/add-liquidity';

export const APOLLO_CLIENT_ENDPOINT = process.env.NEXT_PUBLIC_APOLLO_CLIENT_ENDPOINT;

export const QUIPUSWAP_ANALYTICS_TOKENS = 'https://analytics.quipuswap.com/tokens';
export const QUIPUSWAP_ANALYTICS_PAIRS = 'https://analytics.quipuswap.com/pairs';

export const TEMPLEWALLET_IMG = 'https://img.templewallet.com/insecure/fill/50/50/ce/0/plain';
export const CLOUDFLARE_IPFS = 'https://cloudflare-ipfs.com/ipfs';
export const IPFS = 'ipfs';
export const IPFS_IO = 'https://ipfs.io/ipfs/';

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME!;
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

export const MAINNET_TOKENS = process.env.NEXT_PUBLIC_MAINNET_TOKENS!;
export const TESTNET_TOKENS = process.env.NEXT_PUBLIC_TESTNET_TOKENS!;

export const SAVED_TOKENS_KEY = 'savedCustomTokens';
export const TEZOS_TOKEN: WhitelistedToken = {
  type: 'fa1.2',
  contractAddress: 'tez',
  metadata: {
    decimals: 6,
    name: 'Tezos',
    symbol: 'TEZ',
    thumbnailUri: 'https://ipfs.io/ipfs/Qmf3brydfr8c6CKGUUu73Dd7wfBw66Zbzof5E1BWGeU222',
  },
};
export const FACTORIES = {
  florencenet: {
    fa1_2Factory: [
      'KT195gyo5G7pay2tYweWDeYFkGLqcvQTXoCW',
      'KT1We4CHneKjnCkovTDV34qc4W7xzWbn5LwY',
    ],
    fa2Factory: [
      'KT1HjLwPC3sbh6W5HjaKBsiVPTgptcNbnXnc',
      'KT1SQX24W2v6D5sgihznax1eBykEGQNc7UpD',
    ],
  },
  mainnet: {
    fa1_2Factory: [
      'KT1FWHLMk5tHbwuSsp31S4Jum4dTVmkXpfJw',
      'KT1Lw8hCoaBrHeTeMXbqHPG4sS4K1xn7yKcD',
    ],
    fa2Factory: [
      'KT1PvEyN1xCFCgorN92QCfYjw3axS6jawCiJ',
      'KT1SwH9P1Tx8a58Mm6qBExQFTcy2rwZyZiXS',
    ],
  },
};

export const METADATA_API_MAINNET = process.env.NEXT_PUBLIC_METADATA_API_MAINNET!; // 'ex https://<host>:<port>/metadata'
export const METADATA_API_TESTNET = process.env.NEXT_PUBLIC_METADATA_API_TESTNET!;
// NETWORKS
export const LAST_USED_CONNECTION_KEY = 'lastUsedConnection';
export const LAST_USED_ACCOUNT_KEY = 'lastUsedAccount';
export const NETWORK_ID_KEY = 'networkId';
export const FLORENCENET_NETWORK: QSNetwork = {
  id: 'florencenet',
  connectType: 'default',
  name: 'Florence Testnet',
  type: 'test',
  rpcBaseURL: 'https://testnet-tezos.giganode.io',
  metadata: METADATA_API_TESTNET,
  description: 'Florence testnet',
  disabled: false,
};
export const MAINNET_NETWORK: QSNetwork = {
  id: 'mainnet',
  connectType: 'default',
  name: 'Tezos Mainnet',
  type: 'main',
  rpcBaseURL: 'https://mainnet-node.madfish.solutions/',
  metadata: METADATA_API_MAINNET,
  description: 'Tezos mainnet',
  disabled: false,
};
export const ALL_NETWORKS = [MAINNET_NETWORK, FLORENCENET_NETWORK];
export const DEFAULT_NETWORK = MAINNET_NETWORK;
export const CHAIN_ID_MAPPING = new Map<string, string>([
  ['florencenet', 'NetXxkAx4woPLyu'],
  ['mainnet', 'NetXdQprcVkpaWU'],
]);
