import { FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

export type Undefined<T> = T | undefined;
export type Nullable<T> = T | null; // MayBe<T>

export type QSMainNet = 'mainnet' | 'hangzhounet';

export enum QSNetworkType {
  MAIN = 'MAIN',
  TEST = 'TEST'
}

export interface QSNetwork {
  id: QSMainNet;
  connectType: 'default' | 'custom';
  name: string;
  type: QSNetworkType;
  rpcBaseURL: string;
  metadata: string;
  description: string;
  disabled: boolean;
}

export enum WalletType {
  BEACON = 'beacon',
  TEMPLE = 'temple'
}

export interface WhitelistedTokenPair {
  balance?: string;
  frozenBalance?: string;
  token1: WhitelistedToken;
  token2: WhitelistedToken;
  dex: FoundDex;
}

export interface WhitelistedToken {
  type: 'fa1.2' | 'fa2';
  contractAddress: string;
  // TODO: change the type to BigNumber
  fa2TokenId?: number;
  metadata: WhitelistedTokenMetadata;
}

export interface WhitelistedTokenWithQSNetworkType extends WhitelistedToken {
  network?: QSMainNet;
}

export type TokenId = Pick<WhitelistedToken, 'contractAddress' | 'fa2TokenId' | 'type'>;

export interface WhitelistedBakerEmpty {
  address: string;
}

export interface WhitelistedBakerFull extends WhitelistedBakerEmpty {
  name: string;
  logo: string;
  votes: number;
  fee: number;
  freeSpace: BigNumber;
}

export type WhitelistedBaker = WhitelistedBakerEmpty | WhitelistedBakerFull;

export const isFullBaker = (baker: WhitelistedBaker): baker is WhitelistedBakerFull => baker && 'name' in baker;

export interface WhitelistedTokenMetadata {
  decimals: number;
  symbol: string;
  name: string;
  thumbnailUri: string;
}

interface CommonDexPairProps {
  token1Pool: BigNumber;
  token2Pool: BigNumber;
  totalSupply: BigNumber;
  token1: WhitelistedToken;
  token2: WhitelistedToken;
  id: string | number;
  type: 'ttdex' | 'tokenxtz';
}

interface TTDexPairProps extends CommonDexPairProps {
  id: number;
  type: 'ttdex';
}

interface TokenXtzDexPairProps extends CommonDexPairProps {
  id: string;
  type: 'tokenxtz';
}

export type DexPair = TTDexPairProps | TokenXtzDexPairProps;

export interface VoterType {
  vote: BigNumber;
  veto: BigNumber;
  candidate: string;
}

export interface TokenDataType {
  token: {
    address: string;
    type: 'fa1.2' | 'fa2';
    id?: number | null;
    decimals: number;
  };
  balance: string;
  exchangeRate?: string;
}

export interface TokenDataMap {
  first: TokenDataType;
  second: TokenDataType;
}

export interface LiquidityFormValues {
  switcher: boolean;
  balance1: BigNumber;
  balance2: BigNumber;
  balance3: BigNumber;
  balanceA: BigNumber;
  balanceB: BigNumber;
  balanceTotalA: BigNumber;
  balanceTotalB: BigNumber;
  lpBalance: BigNumber;
  frozenBalance: BigNumber;
  lastChange: string;
  estimateLP: BigNumber;
  slippage: string;
}

export interface PoolShare {
  unfrozen: BigNumber;
  frozen: BigNumber;
  total: BigNumber;
}

export interface WhitelistedStake {
  id: number;
  remaining: Date;
  tokenPair: WhitelistedTokenPair;
  totalValueLocked: string;
  apy: string;
  daily: string;
  balance: string;
  deposit: string;
  earned: string;
  earn: string;
  tokenContract: string;
  farmContract: string;
  projectLink: string;
  analyticsLink: string;
}

export interface VoteFormValues {
  balance1: number;
  selectedBaker: string;
  currentBacker?: string;
}

export interface PoolTableType {
  id: number;
  xtzUsdQuote: string;
  token1: WhitelistedToken;
  token2: WhitelistedToken;
  pair: {
    name: string;
    token1: {
      icon: string;
      symbol: string;
      id: string;
      tokenId: string;
    };
    token2: {
      icon: string;
      symbol: string;
      id: string;
      tokenId: string;
    };
  };
  data: {
    tvl: number;
    volume24h: number;
  };
  buttons: {
    first: {
      label: string;
      href: string;
      external: boolean;
    };
    second: {
      label: string;
      href: string;
    };
  };
}

export interface SortTokensContractsType {
  addressA: string;
  addressB: string;
  type: 'Left-Left' | 'Right-Right' | 'Left-Right';
}
