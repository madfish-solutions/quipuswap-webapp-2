import { FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

export type QSMainNet = 'mainnet' | 'florencenet' | 'granadanet';

type QSNetworkType =
  | 'mainnet'
  | 'florencenet'
  | 'granadanet'
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

export type TokenId = Pick<
WhitelistedToken,
'contractAddress' | 'fa2TokenId' | 'type'
>;

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

export interface DexPair {
  token1Pool: BigNumber;
  token2Pool: BigNumber;
  totalSupply: BigNumber;
  token1: WhitelistedToken;
  token2: WhitelistedToken;
  id: string | number;
}

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

export type NewTokenDataType = {
  token: WhitelistedToken;
  balance?: BigNumber;
  exchangeRate?: BigNumber;
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

export type NewSwapFormValues = {
  token1: WhitelistedToken;
  token2: WhitelistedToken;
  amount1: BigNumber;
  amount2: BigNumber;
  recipient: string;
  slippage: string;
  action: 'swap' | 'send';
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
