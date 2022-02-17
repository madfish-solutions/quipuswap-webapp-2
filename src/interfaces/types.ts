import { FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import { Standard } from '@graphql';

export type Undefined<T> = T | undefined;
export type Nullable<T> = T | null;
export type Optional<T> = T | null | undefined;

export enum QSNets {
  mainnet = 'mainnet',
  hangzhounet = 'hangzhounet'
}

export enum QSNetworkType {
  MAIN = 'MAIN',
  TEST = 'TEST'
}

export enum SwapTabAction {
  SWAP = 'swap',
  SEND = 'send'
}

export enum ConnectType {
  DEFAULT = 'DEFAULT',
  CUSTOM = 'CUSTOM'
}
export interface QSNetwork {
  id: QSNets;
  connectType: ConnectType;
  name: string;
  type: QSNetworkType;
  rpcBaseURL: string;
  metadata: string;
  disabled: boolean;
}

export enum WalletType {
  BEACON = 'beacon',
  TEMPLE = 'temple'
}

export interface TokenPair {
  balance?: Nullable<string>;
  frozenBalance?: Nullable<string>;
  token1: RawToken;
  token2: RawToken;
  dex?: Nullable<FoundDex>;
}

export interface RawToken {
  type: Standard;
  contractAddress: string;
  fa2TokenId?: number;
  isWhitelisted: Nullable<boolean>;
  metadata: TokenMetadata;
}

export interface TokenWithQSNetworkType extends RawToken {
  network?: QSNets;
}

export type TokenId = Pick<RawToken, 'contractAddress' | 'fa2TokenId' | 'type'>;
export type TokenIdFa2 = Required<TokenId>;

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

export interface TokenMetadata {
  decimals: number;
  symbol: string;
  name: string;
  thumbnailUri: string;
}

export enum DexPairType {
  TokenToToken = 'TokenToToken',
  TokenToXtz = 'TokenToXtz'
}

interface CommonDexPairProps {
  token1Pool: BigNumber;
  token2Pool: BigNumber;
  token1: RawToken;
  token2: RawToken;
  id: string | number;
  type: DexPairType;
}

export interface TTDexPairProps extends CommonDexPairProps {
  id: number;
  type: DexPairType.TokenToToken;
}

export interface TokenXtzDexPairProps extends CommonDexPairProps {
  id: string;
  type: DexPairType.TokenToXtz;
}

export type DexPair = TTDexPairProps | TokenXtzDexPairProps;

export interface VoterType {
  vote: Nullable<BigNumber>;
  veto: Nullable<BigNumber>;
  candidate: Nullable<string>;
}

export interface TokenDataType {
  token: {
    address: string;
    type: Standard;
    id?: number | null;
    decimals: number;
  };
  balance: Nullable<string>;
  exchangeRate?: string;
}

export interface TokenDataMap {
  first: TokenDataType;
  second: TokenDataType;
}

export interface VoteFormValues {
  balance1: number;
  selectedBaker: string;
  currentBacker?: string;
}

export interface PoolTableType {
  id: number;
  xtzUsdQuote: string;
  token1: RawToken;
  token2: RawToken;
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

export enum SortType {
  LeftLeft = 'Left-Left',
  RightRight = 'Right-Right',
  LeftRight = 'Left-Right'
}

export interface SortTokensContractsType {
  addressA: string;
  addressB: string;
  idA: Nullable<number>;
  idB: Nullable<number>;
  isRevert?: boolean;
  type: SortType;
}

export enum LastUsedConnectionKey {
  TEMPLE = 'TEMPLE',
  BEACON = 'BEACON'
}
