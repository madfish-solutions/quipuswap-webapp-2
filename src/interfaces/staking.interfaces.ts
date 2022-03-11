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
  apr: Nullable<number>;
  apy: Nullable<number>;

  currentDelegate: string;

  depositBalance?: string;
  depositExchangeRate: Nullable<string>;
  depositTokenUrl: string;

  earnBalance?: string;
  earnExchangeRate: Nullable<string>;
  endTime: string;

  harvestFee: string;
  id: string;
  nextDelegate: string;

  rewardPerSecond: string;
  rewardPerShare: string;
  rewardToken: Token;

  stakeStatus: StakingStatus;
  stakeUrl: string;
  stakedToken: Token;

  timelock: string;
  tokenA: Token;
  tokenB: Undefined<Token>;
  tvlInStakedToken: string;
  tvlInUsd: Nullable<string>;

  udp: string;
  withdrawalFee: string;

  myBalance?: string;
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

  stakeStatus: StakingStatus;
  stakeUrl: string;
  stakedToken: Token;

  timelock: string;
  tokenA: Token;
  tokenB: Undefined<Token>;
  tvlInUsd: Nullable<BigNumber>;
  tvlInStakedToken: BigNumber;

  udp: string;
  withdrawalFee: BigNumber;
}

export interface UserStakingStats {
  lastStaked: string;
  staked: BigNumber;
  earned: BigNumber;
  claimed: BigNumber;
  prevEarned: BigNumber;
  prevStaked: BigNumber;
}
