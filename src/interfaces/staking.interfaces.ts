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
  tokenA: Token;
  tokenB: Undefined<Token>;
  stakeStatus: StakingStatus;
  rewardToken: Token;
  tvl: string;
  apr: Nullable<number>;
  apy: Nullable<number>;
  depositExchangeRate: string;
  earnExchangeRate: string;
  stakeUrl: string;
  depositTokenUrl: string;
}

interface AbstractStakingItem {
  id: BigNumber;
  tokenA: Token;
  tokenB: Undefined<Token>;
  stakeStatus: StakingStatus;
  rewardToken: Token;
  tvl: BigNumber;
  apr: Nullable<BigNumber>;
  apy: Nullable<BigNumber>;
  depositExchangeRate: BigNumber;
  earnExchangeRate: BigNumber;
  stakeUrl: string;
  depositTokenUrl: string;
}

interface UserStakingData {
  myBalance: BigNumber;
  depositBalance: BigNumber;
  earnBalance: BigNumber;
  myDelegate: string;
  myLastStaked: number;
}

interface NoUserStakingItem extends AbstractStakingItem {
  myBalance: null;
  depositBalance: null;
  earnBalance: null;
  myDelegate: null;
  myLastStaked: null;
}

interface UserStakingItem extends AbstractStakingItem, UserStakingData {}

export type StakingItem = NoUserStakingItem | UserStakingItem;
