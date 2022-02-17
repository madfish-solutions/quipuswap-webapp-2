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

export enum StakeStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  DISABLED = 'DISABLED'
}

export interface RawStakeItem {
  id: string;
  tokenA: Token;
  tokenB: Undefined<Token>;
  stakeStatus: StakeStatus;
  rewardToken: Token;
  tvl: string;
  apr: Nullable<number>;
  apy: Nullable<number>;
  depositExchangeRate: string;
  earnExchangeRate: string;
  stakeUrl: string;
  depositTokenUrl: string;
}

export interface StakeItem {
  id: string;
  tokenA: Token;
  tokenB: Nullable<Token>;
  stakeStatus: StakeStatus;
  rewardToken: Token;
  tvl: BigNumber;
  apr: Nullable<BigNumber>;
  apy: Nullable<BigNumber>;
  depositExchangeRate: BigNumber;
  earnExchangeRate: BigNumber;
  stakeUrl: string;
  depositTokenUrl: string;
}
