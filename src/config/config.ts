import { NetworkType } from '@airgap/beacon-sdk';

import { ConnectType, QSNetwork, QSNetworkType, SupportedNetworks } from '@shared/types';

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

export const FACTORIES: Record<SupportedNetworks, { fa1_2Factory: string[]; fa2Factory: string[] }> = {
  [NetworkType.MAINNET]: {
    fa1_2Factory: ['KT1FWHLMk5tHbwuSsp31S4Jum4dTVmkXpfJw', 'KT1Lw8hCoaBrHeTeMXbqHPG4sS4K1xn7yKcD'],
    fa2Factory: ['KT1PvEyN1xCFCgorN92QCfYjw3axS6jawCiJ', 'KT1SwH9P1Tx8a58Mm6qBExQFTcy2rwZyZiXS']
  },
  [NetworkType.HANGZHOUNET]: {
    fa1_2Factory: ['KT1HrQWkSFe7ugihjoMWwQ7p8ja9e18LdUFn'],
    fa2Factory: ['KT1Dx3SZ6r4h2BZNQM8xri1CtsdNcAoXLGZB']
  },
  [NetworkType.ITHACANET]: {
    fa1_2Factory: ['KT1ED1G5UEnetTfV8yG7Q8M5vtGrP4JPiLfm'],
    fa2Factory: ['KT1NQ77PLLEofaJJGiwguoMJhZBebnJruXRQ']
  }
};

const TTDEX_CONTRACTS: Record<SupportedNetworks, string> = {
  [NetworkType.HANGZHOUNET]: 'KT1Ni6JpXqGyZKXhJCPQJZ9x5x5bd7tXPNPC',
  [NetworkType.MAINNET]: 'KT1VNEzpf631BLsdPJjt2ZhgUitR392x6cSi',
  [NetworkType.ITHACANET]: 'KT1PnmpVWmA5CBUsA5ZAx1HoDW67mPYurAL5'
};

const tzktExplorerUrls: Record<SupportedNetworks, string> = {
  [NetworkType.MAINNET]: 'https://tzkt.io',
  [NetworkType.HANGZHOUNET]: 'https://hangzhounet.tzkt.io',
  [NetworkType.ITHACANET]: 'https://ithacanet.tzkt.io'
};
export const TZKT_EXPLORER_URL = tzktExplorerUrls[NETWORK_ID];

const MAINNET_NETWORK: QSNetwork = {
  id: NetworkType.MAINNET,
  connectType: ConnectType.DEFAULT,
  name: 'Mainnet',
  type: QSNetworkType.MAIN,
  rpcBaseURL: RPC_URLS[NetworkType.MAINNET],
  metadata: METADATA_API[NetworkType.MAINNET],
  disabled: false
};

const HANGZHOUNET_NETWORK: QSNetwork = {
  ...MAINNET_NETWORK,
  id: NetworkType.HANGZHOUNET,
  name: 'Hangzhounet',
  type: QSNetworkType.TEST,
  rpcBaseURL: RPC_URLS[NetworkType.HANGZHOUNET],
  metadata: METADATA_API[NetworkType.HANGZHOUNET]
};

const ITHACANET_NETWORK: QSNetwork = {
  ...HANGZHOUNET_NETWORK,
  id: NetworkType.ITHACANET,
  name: 'Ithacanet',
  type: QSNetworkType.TEST,
  rpcBaseURL: RPC_URLS[NetworkType.ITHACANET],
  metadata: METADATA_API[NetworkType.ITHACANET]
};

const networks: Record<SupportedNetworks, QSNetwork> = {
  [NetworkType.MAINNET]: MAINNET_NETWORK,
  [NetworkType.HANGZHOUNET]: HANGZHOUNET_NETWORK,
  [NetworkType.ITHACANET]: ITHACANET_NETWORK
};
export const NETWORK = networks[NETWORK_ID];

export const IS_NETWORK_MAINNET = NETWORK_ID === NetworkType.MAINNET;

export const ALL_NETWORKS = [MAINNET_NETWORK, HANGZHOUNET_NETWORK, ITHACANET_NETWORK];

export const TOKEN_TO_TOKEN_DEX = TTDEX_CONTRACTS[NETWORK_ID];

export const HIDE_ANALYTICS = true;

// FarmingItems with the "NEW" label
export const NEW_FARMINGS = ['5', '6'];

// FarmingItems with Youves
export const YOUVES_FARMINGS = ['5', '6'];
// Link to the Youves site
export const YOUVES_LINK = 'https://app.youves.com/earn';
