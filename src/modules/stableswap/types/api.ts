import { MichelsonMap } from '@taquito/taquito';

import { address, BigMap, BlockInfoWrap, nat, RawToken, timestamp } from '@shared/types';

export interface StableswapListResponse extends RawStableswapList, BlockInfoWrap {}
export interface StableswapItemResponse extends IRawStableswapItem, BlockInfoWrap {}
export interface StableswapStatsResponse extends IRawStableswapStats, BlockInfoWrap {}

export interface StableFarmListResponse extends RawStableFarmList, BlockInfoWrap {}
export interface StableFarmItemResponse extends IRawStableFarmItem, BlockInfoWrap {}
export interface StableFarmStatsResponse extends IRawStableFarmStats, BlockInfoWrap {}

export interface IRawStableswapStats {
  stats: RawStableswapStats;
}

export interface RawStableswapStats {
  totalTvlInUsd: string;
}

export interface IRawStableFarmStats {
  stats: RawStableFarmStats;
}

export interface RawStableFarmStats {
  totalTvlInUsd: string;
}

export interface RawStableswapList {
  list: Array<RawStableswapItem>;
}
export interface RawStableFarmList {
  list: Array<RawStableFarmItem>;
}

export interface IRawStableswapItem {
  item: RawStableswapItem;
}

export interface IRawStableFarmItem {
  item: RawStableFarmItem;
}

interface AbstractRawStableItem {
  id: string;
  contractAddress: string;
  tokensInfo: Array<RawStableswapTokensInfo>;
  isWhitelisted: boolean;
}

export interface RawStableswapItem extends AbstractRawStableItem {
  tvlInUsd: string;
  lpToken: RawToken;
  totalLpSupply: string;
  poolContractUrl: string;
  fees: RawStableswapFees;
}
export interface RawStableFarmItem extends AbstractRawStableItem {
  apr: string;
  apy: string;
  atomicTvl: string;
  stakedToken: RawToken;
  farmContractUrl: string;
  stakedTokenExchangeRate: string;
}

export interface RawStableswapFees {
  liquidityProvidersFee: string;
  stakersFee: string;
  interfaceFee: string;
  devFee: string;
}

export interface RawStableswapTokensInfo {
  reserves: string;
  token: RawToken;
  exchangeRate: string;
}

interface FA12Token {
  fa12: address;
}

interface FA2Token {
  fa2: {
    token_address: address;
    token_id: nat;
  };
}

export type TokensValue = FA12Token | FA2Token;

interface TokensInfoValue {
  rate_f: nat;
  precision_multiplier_f: nat;
  reserves: nat;
}

interface Fee {
  lp_f: nat;
  stakers_f: nat;
  ref_f: nat;
}

export interface StakerAccumulator {
  accumulator_f: MichelsonMap<nat, nat>;
  total_fees: MichelsonMap<nat, nat>;
  total_staked: nat;
}

interface StableswapPoolValue {
  initial_A_f: nat;
  initial_A_time: timestamp;
  future_A_f: nat;
  future_A_time: timestamp;
  tokens_info: MichelsonMap<nat, TokensInfoValue>;
  fee: Fee;
  staker_accumulator: StakerAccumulator;
  total_supply: nat;
}

export interface EarningsValue {
  reward_f: nat;
  former_f: nat;
}

export interface StakersBalanceValue {
  balance: nat;
  earnings: MichelsonMap<nat, EarningsValue>;
}

export interface StableswapStorage {
  storage: {
    pools_count: nat;
    tokens: BigMap<nat, MichelsonMap<nat, TokensValue>>;
    pools: BigMap<nat, StableswapPoolValue>;
    stakers_balance: BigMap<[address, nat], StakersBalanceValue>;
    quipu_token: {
      token_address: address;
      token_id: nat;
    };
  };
}
