import { QSMainNet, QSNetwork, WhitelistedToken } from '@utils/types';

export const COLOR_MODE_STORAGE_KEY = 'theme';

export const DEFAULT_DECIMALS = 6;

export const TEN = 10;
export const ZERO = 0;

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

export const BAKERS_API = process.env.NEXT_PUBLIC_BAKERS_API_URL!;
export const MAINNET_TOKENS = process.env.NEXT_PUBLIC_MAINNET_TOKENS!;
export const TESTNET_TOKENS = process.env.NEXT_PUBLIC_TESTNET_TOKENS!;

export const MAX_SLIPPAGE_PERCENTAGE = 30;
export const DEFAULT_SLIPPAGE_PERCENTAGE = 0.5;
export const DEFAULT_SLIPPAGE = 0.005;
export const MAX_ITEMS_PER_PAGE = 5;
export const MAX_ITEMS_PER_PAGE_MOBILE = 3;

export const READ_ONLY_SIGNER_PK = process.env.NEXT_PUBLIC_READ_ONLY_SIGNER_PK!;
export const READ_ONLY_SIGNER_PK_HASH = process.env.NEXT_PUBLIC_READ_ONLY_SIGNER_PK_HASH!;
export const KNOWN_LAMBDA_CONTRACTS = new Map([
  ['NetXdQprcVkpaWU', 'KT1CPuTzwC7h7uLXd5WQmpMFso1HxrLBUtpE'],
  ['NetXz969SFaFn8k', 'KT1VhtTGAyh7AVVwyH2ExNhaXvQq2rAJ6DNs'],
  ['NetXxkAx4woPLyu', 'KT1BbTmNHmJp2NnQyw5qsAExEYmYuUpR2HdX'],
  ['NetXSgo1ZT2DRUG', 'KT1A64nVZDccAHGAsf1ZyVajXZcbiwjV3SnN'],
  ['NetXZSsxBpMQeAT', 'KT19ewhnhaCcCuoF1Ly2pxXAFRiF3UtgaY9U']
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
    thumbnailUri: 'https://ipfs.io/ipfs/Qmf3brydfr8c6CKGUUu73Dd7wfBw66Zbzof5E1BWGeU222'
  }
};

export const MAINNET_DEFAULT_TOKEN: WhitelistedToken = {
  type: 'fa2',
  contractAddress: 'KT193D4vozYnhGJQVtw7CoxxqphqUEEwK6Vb',
  fa2TokenId: 0,
  metadata: {
    decimals: 6,
    symbol: 'QUIPU',
    name: 'Quipuswap Governance Token',
    thumbnailUri: 'https://quipuswap.com/tokens/quipu.png'
  }
};

export const HANGZHOUNET_DEFAULT_TOKEN: WhitelistedToken = {
  type: 'fa2',
  contractAddress: 'KT1VowcKqZFGhdcDZA3UN1vrjBLmxV5bxgfJ',
  fa2TokenId: 0,
  metadata: {
    decimals: 6,
    symbol: 'QUIPU',
    name: 'Quipuswap Governance Token',
    thumbnailUri: 'https://ipfs.io/ipfs/QmcSH2iaipU1kqcQfZhV5b2CL6Rm8Q8agRwdk1xq38Y3sP'
  }
};

export const networksDefaultTokens: Record<QSMainNet, WhitelistedToken> = {
  mainnet: MAINNET_DEFAULT_TOKEN,
  hangzhounet: HANGZHOUNET_DEFAULT_TOKEN
};

export const FACTORIES = {
  mainnet: {
    fa1_2Factory: ['KT1FWHLMk5tHbwuSsp31S4Jum4dTVmkXpfJw', 'KT1Lw8hCoaBrHeTeMXbqHPG4sS4K1xn7yKcD'],
    fa2Factory: ['KT1PvEyN1xCFCgorN92QCfYjw3axS6jawCiJ', 'KT1SwH9P1Tx8a58Mm6qBExQFTcy2rwZyZiXS']
  },
  hangzhounet: {
    fa1_2Factory: ['KT1HrQWkSFe7ugihjoMWwQ7p8ja9e18LdUFn'],
    fa2Factory: ['KT1Dx3SZ6r4h2BZNQM8xri1CtsdNcAoXLGZB']
  }
};

export const TTDEX_CONTRACTS: Partial<Record<QSMainNet, string>> = {
  hangzhounet: 'KT1Ni6JpXqGyZKXhJCPQJZ9x5x5bd7tXPNPC'
};

export const METADATA_API_MAINNET = process.env.NEXT_PUBLIC_METADATA_API_MAINNET!; // 'ex https://<host>:<port>/metadata'
export const METADATA_API_TESTNET = process.env.NEXT_PUBLIC_METADATA_API_TESTNET!;
export const POOLS_LIST_API = process.env.NEXT_PUBLIC_POOLS_LIST_API!;
// NETWORKS
export const LAST_USED_CONNECTION_KEY = 'lastUsedConnection';
export const LAST_USED_ACCOUNT_KEY = 'lastUsedAccount';
export const NETWORK_ID_KEY = 'networkId';
export const MAINNET_NETWORK: QSNetwork = {
  id: 'mainnet',
  connectType: 'default',
  name: 'Tezos Mainnet',
  type: 'main',
  rpcBaseURL: 'https://mainnet.smartpy.io/',
  metadata: METADATA_API_MAINNET,
  description: 'Tezos mainnet',
  disabled: false
};
export const HANGZHOUNET_NETWORK: QSNetwork = {
  id: 'hangzhounet',
  connectType: 'default',
  name: 'Hangzhounet Testnet',
  type: 'test',
  rpcBaseURL: 'https://hangzhounet.api.tez.ie',
  metadata: METADATA_API_TESTNET,
  description: 'Hangzhounet testnet',
  disabled: false
};
export const ALL_NETWORKS = [MAINNET_NETWORK, HANGZHOUNET_NETWORK];
export const DEFAULT_NETWORK = MAINNET_NETWORK;
export const CHAIN_ID_MAPPING = new Map<QSMainNet, string>([
  ['mainnet', 'NetXdQprcVkpaWU'],
  ['hangzhounet', 'NetXZSsxBpMQeAT']
]);

export const TOKEN_TO_TOKEN_DEX = 'KT1Ni6JpXqGyZKXhJCPQJZ9x5x5bd7tXPNPC';

export const LP_TOKEN_DECIMALS = 6;
