import { NetworkType } from '@airgap/beacon-sdk';
import GhostnetWhitelistTokens from '@quipuswap/tokens-whitelist/tokens/quipuswap-ithacanet.whitelist.json';
import MainnetWhitelistTokens from '@quipuswap/tokens-whitelist/tokens/quipuswap.whitelist.json';

import { FarmVersion } from '@modules/farming/interfaces';
import { PoolType } from '@modules/liquidity/interfaces';
import { ConnectType, QSNetwork, QSNetworkType, SupportedNetworks } from '@shared/types';

import { NETWORK_ID, TEMPLEWALLET_API_URL, TZKT_API } from './environment';

export const QUIPUSWAP_DOMAIN_NAME = 'quipuswap.com';

export const QUIPUSWAP_URL = `https://${QUIPUSWAP_DOMAIN_NAME}`;

export const QUIPUSWAP_ANALYTICS_PAIRS = 'https://analytics.quipuswap.com/pairs';
export const TZKT_API_DELEGATE_URL = `${TZKT_API}/delegates`;
export const TZKT_API_CONTRACTS_URL = `${TZKT_API}/contracts`;

export const TEMPLEWALLET_IMG = 'https://img.templewallet.com/insecure/fill/50/50/ce/0/plain';
export const CLOUDFLARE_IPFS = 'https://cloudflare-ipfs.com/ipfs';
export const BAKERS_HTTP = 'https://services.tzkt.io/v1/avatars';
export const IPFS = 'ipfs';

export const DONATION_ADDRESS = 'tz1LpP5zU73ivpXwHnKYBDRBL3F7aoNsaGWu';

export const APP_NAME = 'QuipuSwap';
export const FEE_RATE = 0.3;
export const BAKERS_API = 'https://api.baking-bad.org/v2/bakers';
export const EXCHANGE_RATES_URL = `${TEMPLEWALLET_API_URL}/api/exchange-rates`;
export const IPFS_GATEWAY = 'https://cloudflare-ipfs.com/ipfs';

export const YUPANA_URL = 'https://app.yupana.finance/';

export const STABLESWAP_REFERRAL = 'tz1Sw2mFAUzbkm7dkGCDrbeBsJTTtV7JD8Ey';
export const FARMING_REFERRER_CONTRACT = 'tz1Sw2mFAUzbkm7dkGCDrbeBsJTTtV7JD8Ey';

//#region READ_ONLY_SIGNER
export const READ_ONLY_SIGNER_PK = 'edpkvWbk81uh1DEvdWKR4g1bjyTGhdu1mDvznPUFE2zDwNsLXrEb9K';
export const READ_ONLY_SIGNER_PK_HASH = 'tz1fVQangAfb9J1hRRMP2bSB6LvASD6KpY8A';
//#endregion READ_ONLY_SIGNER

//#region CHANGE TESTNET TOKENS NETWORK VALUE (ithacanet => ghostnet)
for (const item of GhostnetWhitelistTokens.tokens) {
  item['network'] = NetworkType.GHOSTNET;
}
//#endregion

//#region TOKENS
const TOKENS_MAP = {
  [NetworkType.MAINNET]: MainnetWhitelistTokens,
  [NetworkType.GHOSTNET]: GhostnetWhitelistTokens
};

export const TOKENS = TOKENS_MAP[NETWORK_ID];
//#endregion TOKENS

export const FACTORIES: Record<SupportedNetworks, { fa1_2Factory: string[]; fa2Factory: string[] }> = {
  [NetworkType.MAINNET]: {
    fa1_2Factory: ['KT1FWHLMk5tHbwuSsp31S4Jum4dTVmkXpfJw', 'KT1Lw8hCoaBrHeTeMXbqHPG4sS4K1xn7yKcD'],
    fa2Factory: ['KT1PvEyN1xCFCgorN92QCfYjw3axS6jawCiJ', 'KT1SwH9P1Tx8a58Mm6qBExQFTcy2rwZyZiXS']
  },
  [NetworkType.GHOSTNET]: {
    fa1_2Factory: ['KT1ED1G5UEnetTfV8yG7Q8M5vtGrP4JPiLfm'],
    fa2Factory: ['KT1NQ77PLLEofaJJGiwguoMJhZBebnJruXRQ']
  }
};

const MAINNET_NETWORK: QSNetwork = {
  id: NetworkType.MAINNET,
  connectType: ConnectType.DEFAULT,
  name: 'Mainnet',
  type: QSNetworkType.MAIN,
  disabled: false
};

const GHOSTNET_NETWORK: QSNetwork = {
  ...MAINNET_NETWORK,
  id: NetworkType.GHOSTNET,
  name: 'Ghostnet',
  type: QSNetworkType.TEST
};

const networks: Record<SupportedNetworks, QSNetwork> = {
  [NetworkType.MAINNET]: MAINNET_NETWORK,
  [NetworkType.GHOSTNET]: GHOSTNET_NETWORK
};
export const NETWORK = networks[NETWORK_ID];

export const IS_NETWORK_MAINNET = NETWORK_ID === NetworkType.MAINNET;

export const ALL_NETWORKS = [MAINNET_NETWORK, GHOSTNET_NETWORK];

export const HIDE_ANALYTICS = true;

// FarmingItems with the "NEW" label
export const NEW_FARMINGS: Array<{ id: string; version: FarmVersion }> = [
  { id: '1', version: FarmVersion.v3 },
  { id: '2', version: FarmVersion.v3 }
];

// FarmingItems with Youves
export const YOUVES_FARMINGS = ['5', '6'];
// Link to the Youves site
export const YOUVES_LINK = 'https://app.youves.com/earn';

// Hot Pools
export const HOT_POOLS: Array<{ id: string; type: PoolType }> = [
  { id: '0', type: PoolType.UNISWAP },
  { id: '1', type: PoolType.UNISWAP },
  { id: '2', type: PoolType.UNISWAP },
  { id: '3', type: PoolType.UNISWAP },

  { id: '0', type: PoolType.DEX_TWO },
  { id: '1', type: PoolType.DEX_TWO },
  { id: '2', type: PoolType.DEX_TWO },
  { id: '3', type: PoolType.DEX_TWO }
];

// Coinflip
export const COINFLIP_CONTRACT_DECIMALS = 18;
export const COINFLIP_TOKEN_DECIMALS = 6;
