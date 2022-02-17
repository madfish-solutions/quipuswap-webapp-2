import { MichelsonMapKey } from '@taquito/michelson-encoder';
import { MichelsonMap } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { Nullable, RawToken, Undefined } from '@interfaces/types';

// eslint-disable-next-line @typescript-eslint/no-type-alias
export type address = string;
// eslint-disable-next-line @typescript-eslint/no-type-alias
export type timestamp = string;
// eslint-disable-next-line @typescript-eslint/no-type-alias
export type key_hash = string;
// eslint-disable-next-line @typescript-eslint/no-type-alias
export type nat = BigNumber;
// eslint-disable-next-line
export type bytes = any; //VALIDATE!

export type BigMapKeyType = string | number | object;

export interface BigMap<Key extends BigMapKeyType, Value> {
  get(keyToEncode: Key, block?: number): Promise<Value | undefined>;
  getMultipleValues(
    keysToEncode: Array<Key>,
    block?: number,
    batchSize?: number
  ): Promise<MichelsonMap<MichelsonMapKey, Value | undefined>>;
  toJSON(): string;
  toString(): string;
}

export interface ExchangeRateEntry {
  tokenAddress?: string;
  tokenId?: number;
  exchangeRate: string;
}

export interface Token {
  address: string;
  tokenId?: BigNumber;
}

export enum Standard {
  Fa12 = 'FA12',
  Fa2 = 'FA2'
}

export interface TokenMetadata {
  decimals: number;
  symbol: string;
  name: string;
  thumbnailUri: string;
}

export interface TokenMetadataResponse {
  token_id?: string;
  name: string;
  symbol: string;
  decimals: number;
  thumbnailUri: string;
}

export interface FrontendToken {
  type: Standard;
  contractAddress: string;
  fa2TokenId?: string;
  isWhitelisted: Nullable<boolean>;
  metadata: TokenMetadata;
}

export interface RawStakeStats {
  totalValueLocked: string;
  totalDailyReward: string;
  totalPendingReward: string;
  totalClaimedReward: string;
}

export interface StakeStats {
  totalValueLocked: BigNumber;
  totalDailyReward: BigNumber;
  totalPendingReward: BigNumber;
  totalClaimedReward: BigNumber;
}

export enum StakeStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  DISABLED = 'DISABLED'
}

export interface RawStakeItem {
  id: string;
  tokenA: RawToken;
  tokenB: Undefined<RawToken>;
  stakeStatus: StakeStatus;
  rewardToken: RawToken;
  tvl: string;
  apr: Nullable<number>;
  apy: Nullable<number>;
  depositExchangeRate: string;
  earnExchangeRate: string;
  stakeUrl: string;
  depositTokenUrl: string;
}

export interface StakeItem {
  id: string;
  tokenA: RawToken;
  tokenB: Nullable<RawToken>;
  stakeStatus: StakeStatus;
  rewardToken: RawToken;
  tvl: BigNumber;
  apr: Nullable<BigNumber>;
  apy: Nullable<BigNumber>;
  depositExchangeRate: BigNumber;
  earnExchangeRate: BigNumber;
  stakeUrl: string;
  depositTokenUrl: string;
}

export interface FA12DexToken {
  fa12: string;
}
export interface FA2DexToken {
  fa2: {
    token_address: string;
    token_id: BigNumber;
  };
}
export type DexToken = FA12DexToken | FA2DexToken;

export enum StakeType {
  SINGLE_ASSET = 'SINGLE_ASSET',
  TEZ_LP = 'TEZ_LP',
  TOKEN_LP = 'TOKEN_LP'
}

export interface RewardTokenInfo extends TokenMetadataResponse {
  exchangeRate: BigNumber;
}

export interface PartOfTezosTokenDexStorage {
  tez_pool: BigNumber;
  total_supply: BigNumber;
  token_address: address;
  token_id: BigNumber;
}

export interface PartOfTokenTokenDexStorage {
  pairs: BigMap<BigNumber, TokenTokenPool>;
  tokens: BigMap<BigNumber, TokenTokenPair>;
}

export interface TokenTokenPair {
  token_a_type: DexToken;
  token_b_type: DexToken;
}

export interface TokenTokenPool {
  total_supply: BigNumber;
  token_a_pool: BigNumber;
  token_b_pool: BigNumber;
}

export interface TokenTokenDexInfo {
  pool: TokenTokenPool;
  tokenPair: TokenTokenPair;
}

export interface TezosTokenDexInfo {
  tezPool: BigNumber;
  totalLpSupply: BigNumber;
}
