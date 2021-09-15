import { FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

export type QSMainNet = 'mainnet' | 'florencenet';

type QSNetworkType =
  | 'mainnet'
  | 'florencenet'
  | 'edo2net'
  | 'edonet'
  | 'delphinet'
  | 'carthagenet';

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
  remaining: Date
  tokenPair: WhitelistedTokenPair
  totalValueLocked: string
  apy: string
  daily: string
  balance: string
  deposit: string
  earned: string
  multiplier: string
  tokenContract: string
  farmContract: string
  projectLink: string
  analyticsLink: string
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
