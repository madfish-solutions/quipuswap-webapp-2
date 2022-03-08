import BigNumber from 'bignumber.js';

import { Nullable, Token, Undefined } from '@utils/types';

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

export enum StakingStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  DISABLED = 'DISABLED',
  FINISHED = 'FINISHED'
}

export interface RawStakingItem {
  id: string;
  stakedToken: Token;
  tokenA: Token;
  tokenB: Undefined<Token>;
  stakeStatus: StakingStatus;
  rewardToken: Token;
  tvlInUsd: string;
  tvlInStakedToken: string;
  apr: Nullable<number>;
  apy: Nullable<number>;
  depositExchangeRate: string;
  earnExchangeRate: string;
  stakeUrl: string;
  depositTokenUrl: string;
  rewardPerSecond: string;
  currentDelegate: string;
  nextDelegate: string;
  timelock: string;
  endTime: string;
  harvestFee: string;
  withdrawalFee: string;
  rewardPerShare: string;
  udp: string;
  myBalance?: string;
  depositBalance?: string;
  earnBalance?: string;
}

interface AbstractStakingItem {
  id: BigNumber;
  stakedToken: Token;
  tokenA: Token;
  tokenB: Undefined<Token>;
  stakeStatus: StakingStatus;
  rewardToken: Token;
  tvlInUsd: BigNumber;
  tvlInStakedToken: BigNumber;
  apr: Nullable<BigNumber>;
  apy: Nullable<BigNumber>;
  depositExchangeRate: BigNumber;
  earnExchangeRate: BigNumber;
  stakeUrl: string;
  depositTokenUrl: string;
  rewardPerSecond: string;
  currentDelegate: string;
  nextDelegate: string;
  timelock: string;
  endTime: string;
  harvestFee: string;
  withdrawalFee: string;
  rewardPerShare: BigNumber;
  udp: string;
}

export interface UserStakingItem extends AbstractStakingItem {
  myBalance: BigNumber;
  depositBalance: BigNumber;
  earnBalance: BigNumber;
}

export interface NoUserStakingItem extends AbstractStakingItem {
  myBalance: null;
  depositBalance: null;
  earnBalance: null;
}

export interface RawUserStakingStats {
  last_staked: string;
  staked: BigNumber;
  earned: BigNumber;
  claimed: BigNumber;
  prev_earned: BigNumber;
  prev_staked: BigNumber;
}

export interface UserStakingStats {
  lastStaked: string;
  staked: BigNumber;
  earned: BigNumber;
  claimed: BigNumber;
  prevEarned: BigNumber;
  prevStaked: BigNumber;
}

// interface UserStakingItem extends AbstractStakingItem, UserStakingData {}

export type StakingItem = NoUserStakingItem | UserStakingItem;
