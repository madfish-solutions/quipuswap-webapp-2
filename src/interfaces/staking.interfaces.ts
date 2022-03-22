import BigNumber from 'bignumber.js';

import { Nullable, Token, Undefined } from '@utils/types';

import { ActiveStatus } from './active-statuts-enum';
export interface BlockInfo {
  level: number;
  hash: string;
  timestamp: string;
}

export interface RawStakeStats {
  totalValueLocked: string;
  totalDailyReward: string;
  totalPendingReward: string;
  totalClaimedReward: string;
}

export interface StakeStatsResponse {
  stats: RawStakeStats;
  blockInfo: BlockInfo;
}

export interface StakeStats {
  totalValueLocked: BigNumber;
  totalDailyReward: BigNumber;
  totalPendingReward: BigNumber;
  totalClaimedReward: BigNumber;
}

export interface RawStakingItem {
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
  rewardToken: Token;

  stakeStatus: ActiveStatus;
  stakeUrl: string;
  stakedToken: Token;
  staked: string;

  timelock: string;
  tokenA: Token;
  tokenB: Undefined<Token>;
  tvlInStakedToken: string;
  tvlInUsd: Nullable<string>;

  udp: string;
  withdrawalFee: string;

  myBalance?: string;
  depositBalance?: string;
  earnBalance?: string;
}

export interface StakeListResponse {
  list: Array<RawStakingItem>;
  blockInfo: BlockInfo;
}

export interface StakeItemResponse {
  item: RawStakingItem;
  blockInfo: BlockInfo;
}

export interface UserBalances {
  myBalance: Nullable<BigNumber>;
  earnBalance: Nullable<BigNumber>;
  depositBalance: Nullable<BigNumber>;
}

export interface StakingItem extends UserBalances {
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
