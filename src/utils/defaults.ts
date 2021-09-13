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
export const BAKERS_HTTP = 'https://services.tzkt.io/v1/avatars';
export const IPFS = 'ipfs';
export const IPFS_IO = 'https://ipfs.io/ipfs/';

export const FEE_RATE = process.env.NEXT_PUBLIC_FEE!;
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME!;
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;
export const GOVERNANCE_CONTRACT = process.env.NEXT_PUBLIC_GOVERNANCE_CONTRACT!;

export const BAKERS_API = process.env.NEXT_PUBLIC_BAKERS_API_URL!;
export const MAINNET_TOKENS = process.env.NEXT_PUBLIC_MAINNET_TOKENS!;
export const TESTNET_TOKENS = process.env.NEXT_PUBLIC_TESTNET_TOKENS!;

export const READ_ONLY_SIGNER_PK = process.env.NEXT_PUBLIC_READ_ONLY_SIGNER_PK!;
export const READ_ONLY_SIGNER_PK_HASH = process.env.NEXT_PUBLIC_READ_ONLY_SIGNER_PK_HASH!;
export const KNOWN_LAMBDA_CONTRACTS = new Map([
  ['NetXdQprcVkpaWU', 'KT1CPuTzwC7h7uLXd5WQmpMFso1HxrLBUtpE'],
  ['NetXz969SFaFn8k', 'KT1VhtTGAyh7AVVwyH2ExNhaXvQq2rAJ6DNs'],
  ['NetXxkAx4woPLyu', 'KT1BbTmNHmJp2NnQyw5qsAExEYmYuUpR2HdX'],
  ['NetXSgo1ZT2DRUG', 'KT1A64nVZDccAHGAsf1ZyVajXZcbiwjV3SnN'],
]);

export const SAVED_TOKENS_KEY = 'savedCustomTokens';
export const SAVED_BAKERS_KEY = 'savedCustomBakers';
export const SAVED_TERMS_KEY = 'savedTerms';
export const SAVED_ANALYTICS_KEY = 'savedAnalytics';
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

export const STABLE_TOKEN: WhitelistedToken = {
  type: 'fa2',
  contractAddress: 'KT193D4vozYnhGJQVtw7CoxxqphqUEEwK6Vb',
  fa2TokenId: 0,
  metadata: {
    decimals: 6,
    symbol: 'QUIPU',
    name: 'Quipuswap Governance Token',
    thumbnailUri: 'https://quipuswap.com/tokens/quipu.png',
  },
};

export const FACTORIES = {
  granadanet: {
    fa1_2Factory: [
      'KT1EmfR5bSZN7mWgapE8FZKdbJ3NLjDHGZmd',
    ],
    fa2Factory: [
      'KT1SZzW5BZ6aLmcK9i3Us36angwFB67HmsYT',
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

export const GOVERNANCE_TOKEN_MAINNET = { contract: STABLE_TOKEN.contractAddress, id: 0 };
export const GOVERNANCE_TOKEN_TESTNET = {
  contract: process.env.NEXT_PUBLIC_GOVERNANCE_TESTNET_TOKEN!,
  id: 0,
};
// NETWORKS
export const LAST_USED_CONNECTION_KEY = 'lastUsedConnection';
export const LAST_USED_ACCOUNT_KEY = 'lastUsedAccount';
export const NETWORK_ID_KEY = 'networkId';
export const GRANADA_NETWORK: QSNetwork = {
  id: 'granadanet',
  connectType: 'default',
  name: 'Granada Testnet',
  type: 'test',
  rpcBaseURL: 'https://granadanet.smartpy.io/',
  metadata: METADATA_API_TESTNET,
  description: 'Granada testnet',
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
export const ALL_NETWORKS = [MAINNET_NETWORK, GRANADA_NETWORK];
export const DEFAULT_NETWORK = MAINNET_NETWORK;
export const CHAIN_ID_MAPPING = new Map<string, string>([
  ['florencenet', 'NetXxkAx4woPLyu'],
  ['mainnet', 'NetXdQprcVkpaWU'],
]);
