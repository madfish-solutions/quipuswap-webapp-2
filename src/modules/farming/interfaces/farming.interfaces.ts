import BigNumber from 'bignumber.js';

import { BlockInfoWrap, Nullable, RawToken, Token, Undefined } from '@shared/types';
import { ActiveStatus } from '@shared/types/active-statuts-enum';

export interface RawFarmingStats {
  totalValueLocked: string;
  totalDailyReward: string;
  totalPendingReward: string;
  totalClaimedReward: string;
}

export interface FarmingStatsResponse extends BlockInfoWrap {
  stats: RawFarmingStats;
}

export interface FarmingStats {
  totalValueLocked: BigNumber;
  totalDailyReward: BigNumber;
  totalPendingReward: BigNumber;
  totalClaimedReward: BigNumber;
}

export interface RawFarmingItem {
  apr: Nullable<number>;
  apy: Nullable<number>;

  currentDelegate: string;

  depositExchangeRate: Nullable<string>;
  depositTokenUrl: string;

  earnExchangeRate: Nullable<string>;
  endTime: string;

  harvestFee: string;
  id: string;
  nextDelegate: string;

  rewardPerSecond: string;
  rewardPerShare: string;
  rewardToken: RawToken;

  stakeStatus: ActiveStatus;
  stakeUrl: string;
  stakedToken: RawToken;
  staked: string;

  timelock: string;
  tokenA: RawToken;
  tokenB: Undefined<RawToken>;
  tvlInStakedToken: string;
  tvlInUsd: Nullable<string>;

  udp: string;
  withdrawalFee: string;

  myBalance?: string;
  depositBalance?: string;
  earnBalance?: string;
}

export interface FarmingListResponse extends BlockInfoWrap {
  list: Array<RawFarmingItem>;
}

export interface FarmingItemResponse extends BlockInfoWrap {
  item: RawFarmingItem;
}

export interface UserBalances {
  myBalance: Nullable<BigNumber>;
  earnBalance: Nullable<BigNumber>;
  depositBalance: Nullable<BigNumber>;
}

export interface FarmingItem extends UserBalances {
  apr: Nullable<BigNumber>;
  apy: Nullable<BigNumber>;

  currentDelegate: string;

  depositExchangeRate: Nullable<BigNumber>;
  depositTokenUrl: string;

  earnExchangeRate: Nullable<BigNumber>;
  endTime: string;

  harvestFee: BigNumber;
  id: BigNumber;
  nextDelegate: string;

  rewardPerSecond: BigNumber;
  rewardPerShare: BigNumber;
  rewardToken: Token;

  stakeStatus: ActiveStatus;
  stakeUrl: string;
  stakedToken: Token;
  staked: BigNumber;

  timelock: string;
  tokenA: Token;
  tokenB: Undefined<Token>;
  tvlInUsd: Nullable<BigNumber>;
  tvlInStakedToken: BigNumber;

  udp: string;
  withdrawalFee: BigNumber;
}
