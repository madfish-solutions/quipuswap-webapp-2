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
  DISABLED = 'DISABLED'
}

export interface RawStakingItem {
  id: string;
  stakedToken: Token;
  tokenA: Token;
  tokenB: Undefined<Token>;
  stakeStatus: StakingStatus;
  rewardToken: Token;
  tvlInUsd: Nullable<string>;
  tvlInStakedToken: string;
  apr: Nullable<number>;
  apy: Nullable<number>;
  depositExchangeRate: Nullable<string>;
  earnExchangeRate: Nullable<string>;
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
  tvlInUsd: Nullable<BigNumber>;
  tvlInStakedToken: BigNumber;
  apr: Nullable<BigNumber>;
  apy: Nullable<BigNumber>;
  depositExchangeRate: Nullable<BigNumber>;
  earnExchangeRate: Nullable<BigNumber>;
  stakeUrl: string;
  depositTokenUrl: string;
  rewardPerSecond: BigNumber;
  currentDelegate: string;
  nextDelegate: string;
  timelock: string;
  endTime: string;
  harvestFee: BigNumber;
  withdrawalFee: BigNumber;
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

export interface UserStakingStats {
  lastStaked: string;
  staked: BigNumber;
  earned: BigNumber;
  claimed: BigNumber;
  prevEarned: BigNumber;
  prevStaked: BigNumber;
}

export type StakingItem = NoUserStakingItem | UserStakingItem;
