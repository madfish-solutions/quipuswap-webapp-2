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
  depositExchangeRate: string;
  depositTokenUrl: string;

  earnBalance?: string;
  earnExchangeRate: string;
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
  tvlInUsd: string;

  udp: string;
  withdrawalFee: string;

  myBalance?: string;
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
export interface UserBalances {
  myBalance: Nullable<BigNumber>;
  depositBalance: Nullable<BigNumber>;
  earnBalance: Nullable<BigNumber>;
}

export interface StakingItem extends AbstractStakingItem, UserBalances {}
