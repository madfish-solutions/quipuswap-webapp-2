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

interface AbstractStakeItem {
  id: string;
  tokenA: Token;
  tokenB: Undefined<Token>;
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

export interface UserStakeData {
  myBalance: BigNumber;
  depositBalance: BigNumber;
  earnBalance: BigNumber;
}

interface NoUserStakeItem extends AbstractStakeItem {
  myBalance: null;
  depositBalance: null;
  earnBalance: null;
}

interface UserStakeItem extends AbstractStakeItem, UserStakeData {}

export type StakeItem = NoUserStakeItem | UserStakeItem;
