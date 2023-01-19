import { BlockInfoWrap, RawToken } from '@shared/types';

export enum Version {
  v1 = 'v1',
  v2 = 'v2'
}

export interface StableswapListResponse extends RawStableswapList, BlockInfoWrap {}
export interface StableswapItemResponse extends IRawStableswapItem, BlockInfoWrap {}
export interface StableswapStatsResponse extends IRawStableswapStats, BlockInfoWrap {}

export interface StableDividendsListResponse extends RawStableDividendsList, BlockInfoWrap {}
export interface StableDividendsItemResponse extends IRawStableDividendsItem, BlockInfoWrap {}
export interface StableDividendsStatsResponse extends IRawStableDividendsStats, BlockInfoWrap {}

export interface IRawStableswapStats {
  stats: RawStableswapStats;
}

export interface RawStableswapStats {
  totalTvlInUsd: string;
}

export interface IRawStableDividendsStats {
  stats: RawStableDividendsStats;
}

export interface RawStableDividendsStats {
  totalTvlInUsd: string;
}

export interface RawStableswapList {
  list: Array<RawStableswapItem>;
}
export interface RawStableDividendsList {
  list: Array<RawStableDividendsItem>;
}

export interface IRawStableswapItem {
  item: RawStableswapItem;
}

export interface IRawStableDividendsItem {
  item: RawStableDividendsItem;
}

interface AbstractRawStableItem {
  id: string;
  poolId: string;
  contractAddress: string;
  tokensInfo: Array<RawStableswapTokensInfo>;
  isWhitelisted: boolean;
  version: Version;
}

export interface RawStableswapItem extends AbstractRawStableItem {
  tvlInUsd: string;
  lpToken: RawToken;
  totalLpSupply: string;
  poolContractUrl: string;
  fees: RawStableswapFees;
}
export interface RawStableDividendsItem extends AbstractRawStableItem {
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
