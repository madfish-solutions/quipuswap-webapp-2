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

export interface WhitelistedTokenPair {
  balance?: Nullable<string>;
  frozenBalance?: Nullable<string>;
  token1: WhitelistedToken;
  token2: WhitelistedToken;
  dex?: FoundDex;
}

export interface WhitelistedToken {
  type: Standard;
  contractAddress: string;
  // TODO: change the type to BigNumber
  fa2TokenId?: number;
  metadata: WhitelistedTokenMetadata;
}

export interface WhitelistedTokenWithQSNetworkType extends WhitelistedToken {
  network?: QSNets;
}

export type TokenId = Pick<WhitelistedToken, 'contractAddress' | 'fa2TokenId' | 'type'>;
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

export interface TTDexPairProps extends CommonDexPairProps {
  id: number;
  type: 'ttdex';
}

export interface TokenXtzDexPairProps extends CommonDexPairProps {
  id: string;
  type: 'tokenxtz';
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
