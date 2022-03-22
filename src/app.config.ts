import BigNumber from 'bignumber.js';

import { Standard } from '@graphql';
import { QSNets, ConnectType, QSNetwork, QSNetworkType, Token, WhitelistedBaker } from '@utils/types';

export const COLOR_MODE_STORAGE_KEY = 'theme';

export const DEFAULT_DECIMALS = 6;
export const EMPTY_POOL_AMOUNT = 0;

export const QUIPUSWAP = 'https://quipuswap.com';
export const QUIPUSWAP_TRADE = 'https://quipuswap.com/swap';
export const QUIPUSWAP_INVEST = 'https://quipuswap.com/invest/add-liquidity';

export const APOLLO_CLIENT_ENDPOINT = process.env.NEXT_PUBLIC_APOLLO_CLIENT_ENDPOINT;

export const QUIPUSWAP_ANALYTICS_TOKENS = 'https://analytics.quipuswap.com/tokens';
export const QUIPUSWAP_ANALYTICS_PAIRS = 'https://analytics.quipuswap.com/pairs';

export const TZKT_API_DELEGATE_URL = 'https://api.tzkt.io/v1/delegates';

export const TEMPLEWALLET_IMG = 'https://img.templewallet.com/insecure/fill/50/50/ce/0/plain';
export const CLOUDFLARE_IPFS = 'https://cloudflare-ipfs.com/ipfs';
export const BAKERS_HTTP = 'https://services.tzkt.io/v1/avatars';
export const IPFS = 'ipfs';
export const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY!;

export const FEE_RATE = process.env.NEXT_PUBLIC_FEE!;
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME!;

export const NETWORK_ID = (process.env.NEXT_PUBLIC_NETWORK ?? QSNets.mainnet) as QSNets;
export const MAINNET_BASE_URL = process.env.NEXT_PUBLIC_MAINNET_BASE_URL!;
export const HANGZHOUNET_BASE_URL = process.env.NEXT_PUBLIC_HANGZHOUNET_BASE_URL!;
export const BASE_URL = NETWORK_ID === QSNets.mainnet ? MAINNET_BASE_URL : HANGZHOUNET_BASE_URL;
export const networksBaseUrls = {
  [QSNets.mainnet]: MAINNET_BASE_URL,
  [QSNets.hangzhounet]: HANGZHOUNET_BASE_URL
};

export const BAKERS_API = process.env.NEXT_PUBLIC_BAKERS_API_URL!;
export const MAINNET_TOKENS = process.env.NEXT_PUBLIC_MAINNET_TOKENS!;
export const TESTNET_TOKENS = process.env.NEXT_PUBLIC_TESTNET_TOKENS!;

export const ZERO_ADDRESS = 'tz1ZZZZZZZZZZZZZZZZZZZZZZZZZZZZNkiRg';
export const MS_IN_SECOND = 1000;
export const SECONDS_IN_MINUTE = 60;
export const MINUTES_IN_HOUR = 60;
export const HOURS_IN_DAY = 24;
export const SECONDS_IN_DAY = HOURS_IN_DAY * MINUTES_IN_HOUR * SECONDS_IN_MINUTE;
export const MAX_SLIPPAGE_PERCENTAGE = 30;
export const DEFAULT_SLIPPAGE_PERCENTAGE = 0.5;
export const LIQUIDITY_DEFAULT_SLIPPAGE = 0;
export const DEFAULT_DEADLINE_MINS = 30;
const MAX_DEADLINE_DAYS = 30;
export const DAYS_IN_YEAR = 365;
export const USD_DECIMALS = 2;
export const MAX_DEADLINE_MINS = MAX_DEADLINE_DAYS * HOURS_IN_DAY * MINUTES_IN_HOUR;
export const MIN_DEADLINE_MINS = 1;
export const MAX_ITEMS_PER_PAGE = 5;
export const MAX_ITEMS_PER_PAGE_MOBILE = 3;
export const MAX_HOPS_COUNT = 5;

export const TEZ_TO_LEAVE = new BigNumber('0.1');
export const TEZ_TRANSFER_AMOUNT_CAP = new BigNumber('0.01');

export const PRESET_AMOUNT_INPUT_DECIMALS = 2;
export const MINIMUM_PRESET_AMOUNT_INPUT_VALUE = 0;

export const DELAY_BEFORE_DATA_UPDATE = 3000;

export const READ_ONLY_SIGNER_PK = process.env.NEXT_PUBLIC_READ_ONLY_SIGNER_PK!;
export const READ_ONLY_SIGNER_PK_HASH = process.env.NEXT_PUBLIC_READ_ONLY_SIGNER_PK_HASH!;
export const MAINNET_LAMBDA_VIEW_CONTRACT = process.env.NEXT_PUBLIC_MAINNET_LAMBDA_VIEW_CONTRACT!;
export const HANGZHOUNET_LAMBDA_VIEW_CONTRACT = process.env.NEXT_PUBLIC_HANGZHOUNET_LAMBDA_VIEW_CONTRACT!;
export const KNOWN_LAMBDA_CONTRACTS = new Map([
  ['NetXdQprcVkpaWU', MAINNET_LAMBDA_VIEW_CONTRACT],
  ['NetXZSsxBpMQeAT', HANGZHOUNET_LAMBDA_VIEW_CONTRACT]
]);

export const SAVED_TOKENS_KEY = 'savedCustomTokens';
export const SAVED_BAKERS_KEY = 'savedCustomBakers';
export const SAVED_TERMS_KEY = 'savedTerms';
export const SAVED_ANALYTICS_KEY = 'savedAnalytics';

export const DONATION_ADDRESS = 'tz1LpP5zU73ivpXwHnKYBDRBL3F7aoNsaGWu';

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

export const TEZOS_TOKEN_DECIMALS = TEZOS_TOKEN.metadata.decimals;
export const TEZOS_TOKEN_SYMBOL = TEZOS_TOKEN.metadata.symbol;
export const TEZOS_TOKEN_SLUG = TEZOS_TOKEN.contractAddress;

export const MAINNET_DEFAULT_TOKEN: Token = {
  type: Standard.Fa2,
  contractAddress: 'KT193D4vozYnhGJQVtw7CoxxqphqUEEwK6Vb',
  fa2TokenId: 0,
  isWhitelisted: true,
  metadata: {
    decimals: 6,
    symbol: 'QUIPU',
    name: 'Quipuswap Governance Token',
    thumbnailUri: 'https://quipuswap.com/tokens/quipu.png'
  }
};

export const HANGZHOUNET_DEFAULT_TOKEN: Token = {
  type: Standard.Fa2,
  contractAddress: 'KT1VowcKqZFGhdcDZA3UN1vrjBLmxV5bxgfJ',
  fa2TokenId: 0,
  isWhitelisted: true,
  metadata: {
    decimals: 6,
    symbol: 'QUIPU',
    name: 'Quipuswap Governance Token',
    thumbnailUri: `${IPFS_GATEWAY}/QmcSH2iaipU1kqcQfZhV5b2CL6Rm8Q8agRwdk1xq38Y3sP`
  }
};

export const networksDefaultTokens: Record<QSNets, Token> = {
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

const TTDEX_CONTRACTS = {
  [QSNets.hangzhounet]: 'KT1Ni6JpXqGyZKXhJCPQJZ9x5x5bd7tXPNPC',
  [QSNets.mainnet]: 'KT1VNEzpf631BLsdPJjt2ZhgUitR392x6cSi'
};

const FARMING_CONTRACTS_ADDRESSES = {
  [QSNets.mainnet]: process.env.NEXT_PUBLIC_MAINNET_FARMING_CONTRACT,
  [QSNets.hangzhounet]: process.env.NEXT_PUBLIC_HANGZHOUNET_FARMING_CONTRACT
};
export const FARMING_CONTRACT_ADDRESS = FARMING_CONTRACTS_ADDRESSES[NETWORK_ID]!;
export const FARMING_REFERRER_CONTRACT = process.env.NEXT_PUBLIC_FARMING_REFERRER_CONTRACT!;

export const DEX_POOLS_URLS = {
  mainnet: process.env.NEXT_PUBLIC_MAINNET_POOLS_URL!,
  hangzhounet: process.env.NEXT_PUBLIC_HANGZHOUNET_POOLS_URL!
};

const tzktExplorerUrls = {
  [QSNets.mainnet]: 'https://tzkt.io',
  [QSNets.hangzhounet]: 'https://hangzhounet.tzkt.io'
};
export const TZKT_EXPLORER_URL = tzktExplorerUrls[NETWORK_ID];

export const METADATA_API_MAINNET = process.env.NEXT_PUBLIC_METADATA_API_MAINNET!; // 'ex https://<host>:<port>/metadata'
export const METADATA_API_TESTNET = process.env.NEXT_PUBLIC_METADATA_API_TESTNET!;
export const EXCHANGE_RATES_URL = process.env.NEXT_PUBLIC_EXCHANGE_RATES_URL!;

export const FARMING_API_URLS = {
  [QSNets.mainnet]: process.env.NEXT_PUBLIC_MAINNET_FARMING_API_URL!,
  [QSNets.hangzhounet]: process.env.NEXT_PUBLIC_HANGZHOUNET_FARMING_API_URL!
};

export const FARMING_API_URL = FARMING_API_URLS[NETWORK_ID]!;

// NETWORKS
export const MAINNET_RPC_URL = process.env.NEXT_PUBLIC_MAINNET_RPC_URL!;
export const HANGZHOUNET_RPC_URL = process.env.NEXT_PUBLIC_HANGZHOUNET_RPC_URL!;
export const LAST_USED_CONNECTION_KEY = 'lastUsedConnection';
export const LAST_USED_ACCOUNT_KEY = 'lastUsedAccount';
const MAINNET_NETWORK: QSNetwork = {
  id: QSNets.mainnet,
  connectType: ConnectType.DEFAULT,
  name: 'Mainnet',
  type: QSNetworkType.MAIN,
  rpcBaseURL: MAINNET_RPC_URL,
  metadata: METADATA_API_MAINNET,
  disabled: false
};
const HANGZHOUNET_NETWORK: QSNetwork = {
  id: QSNets.hangzhounet,
  connectType: ConnectType.DEFAULT,
  name: 'Hangzhounet',
  type: QSNetworkType.TEST,
  rpcBaseURL: HANGZHOUNET_RPC_URL,
  metadata: METADATA_API_TESTNET,
  disabled: false
};
const networks: Record<QSNets, QSNetwork> = {
  [QSNets.mainnet]: MAINNET_NETWORK,
  [QSNets.hangzhounet]: HANGZHOUNET_NETWORK
};
export const NETWORK = networks[NETWORK_ID];
export const IS_NETWORK_MAINNET = NETWORK_ID === QSNets.mainnet;

export const ALL_NETWORKS = [MAINNET_NETWORK, HANGZHOUNET_NETWORK];
export const CHAIN_ID_MAPPING = new Map<QSNets, string>([
  [QSNets.mainnet, 'NetXdQprcVkpaWU'],
  [QSNets.hangzhounet, 'NetXZSsxBpMQeAT']
]);

export const TOKEN_TO_TOKEN_DEX = TTDEX_CONTRACTS[NETWORK_ID];

export const LP_TOKEN_DECIMALS = 6;

export const QUIPUSWAP_OLD_VERSION_LINK = process.env.NEXT_PUBLIC_QUIPUSWAP_OLD_VERSION_LINK!;
export const HANGZHOUNET_BAKERS: WhitelistedBaker[] = [
  {
    address: 'tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9',
    logo: 'https://services.tzkt.io/v1/avatars/tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9'
  },
  {
    address: 'tz1cBHUzXNFEHc21QZTc9oyT8Xig1Yv7Wqtp',
    logo: 'https://services.tzkt.io/v1/avatars/tz1cBHUzXNFEHc21QZTc9oyT8Xig1Yv7Wqtp'
  },
  {
    address: 'tz1PirbogVqfmBT9XCuYJ1KnDx4bnMSYfGru',
    logo: 'https://services.tzkt.io/v1/avatars/tz1PirbogVqfmBT9XCuYJ1KnDx4bnMSYfGru'
  },
  {
    address: 'tz1WVs9DWoMLYcoL24JnsmbDqDShCnxxDt16',
    logo: 'https://services.tzkt.io/v1/avatars/tz1WVs9DWoMLYcoL24JnsmbDqDShCnxxDt16'
  },
  {
    address: 'tz1VoSM93UoY5gjuvb1bHdwdJZzU4P5eEAs4',
    logo: 'https://services.tzkt.io/v1/avatars/tz1VoSM93UoY5gjuvb1bHdwdJZzU4P5eEAs4'
  }
];

const dummyBakers: Record<QSNets, string> = {
  [QSNets.mainnet]: 'tz1aRoaRhSpRYvFdyvgWLL6TGyRoGF51wDjM',
  [QSNets.hangzhounet]: 'tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9'
};

export const DUMMY_BAKER = dummyBakers[NETWORK_ID];
