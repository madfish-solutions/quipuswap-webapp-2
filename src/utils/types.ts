import { FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import { Standard } from '@graphql';

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
  type: Standard;
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
    type: Standard;
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

export interface VoteFormValues {
  balance1: number;
  selectedBaker: string;
  currentBacker?: string;
}

export interface PoolShare {
  unfrozen: BigNumber;
  frozen: BigNumber;
  total: BigNumber;
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
