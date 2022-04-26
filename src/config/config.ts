import { ConnectType, QSNets, QSNetwork, QSNetworkType } from '@shared/types';

import { METADATA_API, NETWORK_ID, RPC_URLS } from './enviroment';

export const QUIPUSWAP_DOMAIN_NAME = 'quipuswap.com';

export const QUIPUSWAP_URL = `https://${QUIPUSWAP_DOMAIN_NAME}`;

export const QUIPUSWAP_ANALYTICS_PAIRS = 'https://analytics.quipuswap.com/pairs';

export const TZKT_API_DELEGATE_URL = 'https://api.tzkt.io/v1/delegates';

export const TEMPLEWALLET_IMG = 'https://img.templewallet.com/insecure/fill/50/50/ce/0/plain';
export const CLOUDFLARE_IPFS = 'https://cloudflare-ipfs.com/ipfs';
export const BAKERS_HTTP = 'https://services.tzkt.io/v1/avatars';
export const IPFS = 'ipfs';

export const DONATION_ADDRESS = 'tz1LpP5zU73ivpXwHnKYBDRBL3F7aoNsaGWu';

export const FACTORIES: Record<QSNets, { fa1_2Factory: string[]; fa2Factory: string[] }> = {
  [QSNets.mainnet]: {
    fa1_2Factory: ['KT1FWHLMk5tHbwuSsp31S4Jum4dTVmkXpfJw', 'KT1Lw8hCoaBrHeTeMXbqHPG4sS4K1xn7yKcD'],
    fa2Factory: ['KT1PvEyN1xCFCgorN92QCfYjw3axS6jawCiJ', 'KT1SwH9P1Tx8a58Mm6qBExQFTcy2rwZyZiXS']
  },
  [QSNets.hangzhounet]: {
    fa1_2Factory: ['KT1HrQWkSFe7ugihjoMWwQ7p8ja9e18LdUFn'],
    fa2Factory: ['KT1Dx3SZ6r4h2BZNQM8xri1CtsdNcAoXLGZB']
  },
  [QSNets.ithacanet]: {
    fa1_2Factory: ['KT1ED1G5UEnetTfV8yG7Q8M5vtGrP4JPiLfm'],
    fa2Factory: ['KT1NQ77PLLEofaJJGiwguoMJhZBebnJruXRQ']
  }
};

const TTDEX_CONTRACTS: Record<QSNets, string> = {
  [QSNets.hangzhounet]: 'KT1Ni6JpXqGyZKXhJCPQJZ9x5x5bd7tXPNPC',
  [QSNets.mainnet]: 'KT1VNEzpf631BLsdPJjt2ZhgUitR392x6cSi',
  [QSNets.ithacanet]: 'KT1PnmpVWmA5CBUsA5ZAx1HoDW67mPYurAL5'
};

const tzktExplorerUrls: Record<QSNets, string> = {
  [QSNets.mainnet]: 'https://tzkt.io',
  [QSNets.hangzhounet]: 'https://hangzhounet.tzkt.io',
  [QSNets.ithacanet]: 'https://ithacanet.tzkt.io'
};
export const TZKT_EXPLORER_URL = tzktExplorerUrls[NETWORK_ID];

const MAINNET_NETWORK: QSNetwork = {
  id: QSNets.mainnet,
  connectType: ConnectType.DEFAULT,
  name: 'Mainnet',
  type: QSNetworkType.MAIN,
  rpcBaseURL: RPC_URLS[QSNets.mainnet],
  metadata: METADATA_API[QSNets.mainnet],
  disabled: false
};

const HANGZHOUNET_NETWORK: QSNetwork = {
  ...MAINNET_NETWORK,
  id: QSNets.hangzhounet,
  name: 'Hangzhounet',
  type: QSNetworkType.TEST,
  rpcBaseURL: RPC_URLS[QSNets.hangzhounet],
  metadata: METADATA_API[QSNets.hangzhounet]
};

const ITHACANET_NETWORK: QSNetwork = {
  ...HANGZHOUNET_NETWORK,
  id: QSNets.ithacanet,
  name: 'Ithacanet',
  type: QSNetworkType.TEST,
  rpcBaseURL: RPC_URLS[QSNets.ithacanet],
  metadata: METADATA_API[QSNets.ithacanet]
};

const networks: Record<QSNets, QSNetwork> = {
  [QSNets.mainnet]: MAINNET_NETWORK,
  [QSNets.hangzhounet]: HANGZHOUNET_NETWORK,
  [QSNets.ithacanet]: ITHACANET_NETWORK
};
export const NETWORK = networks[NETWORK_ID];

export const IS_NETWORK_MAINNET = NETWORK_ID === QSNets.mainnet;

export const ALL_NETWORKS = [MAINNET_NETWORK, HANGZHOUNET_NETWORK, ITHACANET_NETWORK];

export const TOKEN_TO_TOKEN_DEX = TTDEX_CONTRACTS[NETWORK_ID];

export const HIDE_ANALYTICS = true;
