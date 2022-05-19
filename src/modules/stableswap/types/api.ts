import { BlockInfoWrap, RawToken } from '@shared/types';

export interface StableswapListResponse extends RawStableswapList, BlockInfoWrap {}
export interface StableswapItemResponse extends IRawStableswapItem, BlockInfoWrap {}
export interface StableswapStatsResponse extends RawStableswapStats, BlockInfoWrap {}

export interface RawStableswapStats {
  totalTvlInUsd: string;
}

export interface RawStableswapList {
  list: Array<RawStableswapItem>;
}

export interface IRawStableswapItem {
  item: RawStableswapItem;
}

export interface RawStableswapItem {
  id: string;
  contractAddress: string;
  tokensInfo: Array<RawStableswapTokensInfo>;
  fees: RawStableswapFees;
  totalLpSupply: string;
  tvlInUsd: string;
  poolContractUrl: string;
  isWhitelisted: boolean;
  lpToken: RawToken;
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
