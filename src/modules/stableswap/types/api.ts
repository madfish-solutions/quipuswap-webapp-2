import { BlockInfoWrap, RawToken } from '@shared/types';

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
