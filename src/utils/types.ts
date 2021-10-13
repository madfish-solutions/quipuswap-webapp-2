import { FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';
import { BigMapAbstraction } from '@taquito/taquito';

export type QSMainNet = 'mainnet' | 'granadanet';

type QSNetworkType =
  | 'mainnet'
  | 'florencenet'
  | 'edo2net'
  | 'edonet'
  | 'delphinet'
  | 'carthagenet'
  | 'granadanet';

export interface QSNetwork {
  id: QSNetworkType
  connectType: 'default' | 'custom'
  name: string
  type: 'main' | 'test'
  rpcBaseURL: string
  metadata: string
  description: string
  disabled: boolean
}

export enum WalletType {
  BEACON = 'beacon',
  TEMPLE = 'temple',
}

export interface WhitelistedTokenPair {
  balance?: string,
  frozenBalance?: string,
  token1: WhitelistedToken,
  token2: WhitelistedToken,
  dex: FoundDex
}

export interface WhitelistedToken {
  type: 'fa1.2' | 'fa2'
  contractAddress: string
  fa2TokenId?: number
  metadata: WhitelistedTokenMetadata
}

export interface WhitelistedBaker {
  name: string,
  address: string,
  logo: string,
  votes: number,
  fee: number,
  freeSpace: BigNumber
}

export type WhitelistedTokenMetadata = {
  decimals: number
  symbol: string
  name: string
  thumbnailUri: string
};

export type VoterType = {
  vote: string,
  veto: string,
  candidate: string
};

export type TokenDataType = {
  token: {
    address: string,
    type: 'fa1.2' | 'fa2',
    id?: number | null
    decimals: number,
  },
  balance: string,
  exchangeRate?: string
};

export type TokenDataMap = {
  first: TokenDataType,
  second: TokenDataType
};

export type SwapFormValues = {
  lastChange: 'balance1' | 'balance2'
  balance1: BigNumber
  balance2: BigNumber
  recipient: string
  slippage: string
};

export type LiquidityFormValues = {
  switcher: boolean
  balance1: BigNumber
  balance2: BigNumber
  balance3: BigNumber
  balanceA: BigNumber
  balanceB: BigNumber
  balanceTotalA: BigNumber
  balanceTotalB: BigNumber
  lpBalance: BigNumber
  frozenBalance: BigNumber
  lastChange: string
  estimateLP: BigNumber
  slippage: string
};

export type FarmingFormValues = {
  switcher: boolean
  balance3: BigNumber
  selectedBaker: string
};

export type PoolShare = {
  unfrozen:BigNumber,
  frozen:BigNumber,
  total:BigNumber
};

export interface Farms {
  farmId: string
  totalValueLocked: string
  startTime: string
  claimed: string
  rewardPerSecond: string
  stakedToken: {
    contractAddress: string
    decimals: number
    fa2TokenId: string
    isLp: boolean
    name: string
    symbol: string
    thumbnailUri: string
  },
  fees: {
    burn_reward: string
    harvest_fee: string
    withdrawal_fee: string
  }
  upd: string
  timelock: string
  currentDelegated: string
  nextCandidate: string
  paused: boolean
  rewardPerShare: string
  rewardToken: {
    decimals: number
    name: string
    symbol: string
    thumbnailUri: string
    contractAddress: string
    fa2TokenId: string
  },
  dex: string
}

export interface FarmsFromServer extends Farms {
  tokenPair: {
    token1: {
      contractAddress: string
      decimals: number
      name: string
      symbol: string
      thumbnailUri: string
      fa2TokenId?: string
    },
    token2: {
      contractAddress: string
      decimals: number
      name: string
      symbol: string
      thumbnailUri: string
      fa2TokenId?: string
    }
  }
}

export interface FarmsFromServerWithWhitelistedPair extends Farms {
  tokenPair: {
    token1: WhitelistedToken
    token2: WhitelistedToken
  }
}

export interface WhitelistedFarm extends FarmsFromServerWithWhitelistedPair {
  apr: BigNumber
  apyDaily: BigNumber
  tokenContract: string
  farmContract: string
  analyticsLink: string
  deposit: BigNumber
  earned: BigNumber
  startTime: string
  timelock: string
  dexStorage: FoundDex
}

export interface WhitelistedStake extends FarmsFromServerWithWhitelistedPair {
  apr: BigNumber
  apyDaily: BigNumber
  tokenContract: string
  farmContract: string
  analyticsLink: string
  deposit: BigNumber
  earned: BigNumber
  startTime: string
  timelock: string
  dexStorage: FoundDex
}

export type VoteFormValues = {
  balance1: number
  selectedBaker: string
  method:'first' | 'second'
};

export interface FarmingStorageInfo extends BigMapAbstraction {
  storage: {
    farms: BigMapAbstraction
    referrers: BigMapAbstraction
    users_info: BigMapAbstraction
    votes: BigMapAbstraction
    candidates: BigMapAbstraction
    qsgov_lp: string
    admin: string
    pending_admin: string
    burner: string
    proxy_minter: string
    baker_registry: string
    farms_count: BigNumber
    deposit?: BigNumber
    earned?: BigNumber
  }
}

export type FarmingUsersInfo = {
  earned: BigNumber
  last_staked: Date
  prev_earned: BigNumber
  staked: BigNumber
  used_votes: BigNumber
  claimed: BigNumber
  farmId?: number
};

export type PoolTableType = {
  id: number,
  xtzUsdQuote: string,
  token1: WhitelistedToken,
  token2: WhitelistedToken,
  pair: {
    name: string,
    token1: {
      icon: string,
      symbol: string,
    },
    token2: {
      icon: string,
      symbol: string,
    },
  },
  data: {
    tvl: number,
    volume24h: number,
  },
  buttons: {
    first: {
      label: string,
      href: string,
      external: boolean,
    },
    second: {
      label: string,
      href: string,
    },
  },
};

export type SubmitType = {
  accountPkh: string
  farmContract: any
  farmId: BigNumber
  handleErrorToast: (error:any) => void
};
