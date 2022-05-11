import { SVGProps } from 'react';

import { FoundDex } from '@quipuswap/sdk';
import { BigNumber } from 'bignumber.js';

export interface IconProps extends SVGProps<SVGSVGElement> {
  id?: string;
  className?: string;
}

export type Undefined<T> = T | undefined;
export type Nullable<T> = T | null;
export type Optional<T> = T | null | undefined;

export enum QSNets {
  mainnet = 'mainnet',
  hangzhounet = 'hangzhounet',
  ithacanet = 'ithacanet'
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

export enum Standard {
  Null = 'Null',
  Fa12 = 'FA12',
  Fa2 = 'FA2'
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
  token1: Token;
  token2: Token;
  dex?: Nullable<FoundDex>;
}

export interface Token {
  type: Standard;
  contractAddress: string;
  fa2TokenId?: number;
  isWhitelisted: Nullable<boolean>;
  metadata: TokenMetadata;
}

export interface RawToken extends Omit<Token, 'fa2TokenId'> {
  fa2TokenId?: string;
}

export interface TokenWithQSNetworkType extends Token {
  network?: QSNets;
}

export type TokenId = Pick<Token, 'contractAddress' | 'fa2TokenId' | 'type'>;
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
  token1: Token;
  token2: Token;
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
  token1: Token;
  token2: Token;
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

export interface BlockInfoWrap {
  blockInfo: BlockInfo;
}
export interface BlockInfo {
  level: number;
  hash: string;
  timestamp: string;
}
