import { FoundDex, Token } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';
import { BigMapAbstraction, TezosToolkit } from '@taquito/taquito';

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

export type PoolShare = {
  unfrozen:BigNumber,
  frozen:BigNumber,
  total:BigNumber
};

export type WhitelistedFarm = {
  id: number
  remaining: Date
  tokenPair: WhitelistedTokenPair
  totalValueLocked: string
  apy: string
  daily: string
  multiplier: string
  tokenContract: string
  farmContract: string
  projectLink: string
  analyticsLink: string
  claimed?: string
  isLpTokenStaked: boolean
  stakedToken: { fA2?: FA2, fA12?: string }
};

export type WhitelistedFarmOptional = {
  id: number
  remaining: Date
  tokenPair: {
    token1: WhitelistedToken,
    token2?: WhitelistedToken,
  }
  totalValueLocked: string
  apy: string
  daily: string
  multiplier: string
  tokenContract: string
  farmContract: string
  projectLink: string
  analyticsLink: string
  claimed?: string
  isLpTokenStaked: boolean
  stakedToken: { fA2?: FA2, fA12?: string }
  deposit?: string
  earned?: string
  startTime: Date
  rewardPerSecond: BigNumber
};

export type WhitelistedStake = {
  id: number,
  remaining: Date
  tokenPair: WhitelistedTokenPair
  totalValueLocked: string
  apy: string
  daily: string
  balance: string
  deposit: string
  earned: string
  earn: string
  tokenContract: string
  farmContract: string
  projectLink: string
  analyticsLink: string
};

export type VoteFormValues = {
  balance1: number
  selectedBaker: string
  method:'first' | 'second'
};

type FA2 = {
  id: BigNumber
  token: string
};

export type FarmingInfoType = {
  current_candidate: string
  current_delegated: string
  fees: {
    harvest_fee: BigNumber,
    withdrawal_fee: BigNumber,
    burn_reward: BigNumber,
  }
  fid: BigNumber
  paused: boolean
  reward_per_second: BigNumber
  reward_per_share: BigNumber
  reward_token: FA2
  stake_params: {
    is_lp_staked_token: boolean,
    qs_pool: string
    staked_token: { fA2?: FA2, fA12?: string }
    token: { fA2: FA2 }
  }
  staked: BigNumber
  start_time: Date
  timelock: BigNumber
  upd: Date
  claimed: BigNumber
};

export type FarmingStorageInfo = {
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
};

export type FarmingUsersInfo = {
  earned?: BigNumber
  last_staked?: Date
  prev_earned?: BigNumber
  staked?: BigNumber
  used_votes?: BigNumber
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
  tezos: TezosToolkit
  fromAsset: Token
  accountPkh: string
  farmContract: any
  farmId: BigNumber
  handleErrorToast: (error:any) => void
};
