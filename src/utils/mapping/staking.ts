import BigNumber from 'bignumber.js';

import { RawStakeItem, RawStakeStats, StakeItem, StakeStats } from '@interfaces/staking';
import { Token } from '@utils/types';

const mapToken = (raw: Token): Token => ({
  ...raw,
  fa2TokenId: raw.fa2TokenId === undefined ? undefined : Number(raw.fa2TokenId)
});

const mapStakeItem = (raw: RawStakeItem): StakeItem => ({
  ...raw,
  tokenA: mapToken(raw.tokenA),
  tokenB: raw.tokenB ? mapToken(raw.tokenB) : undefined,
  rewardToken: mapToken(raw.rewardToken),
  tvl: new BigNumber(raw.tvl),
  apr: raw.apr ? new BigNumber(raw.apr) : null,
  apy: raw.apy ? new BigNumber(raw.apy) : null,
  depositExchangeRate: new BigNumber(raw.depositExchangeRate),
  earnExchangeRate: new BigNumber(raw.earnExchangeRate),
  myBalance: null,
  depositBalance: null,
  earnBalance: null
});

export const mapStakesItems = (rawList: RawStakeItem[]): StakeItem[] => rawList.map(mapStakeItem);

export const mapStakeStats = (raw: RawStakeStats): StakeStats => ({
  totalValueLocked: new BigNumber(raw.totalValueLocked),
  totalDailyReward: new BigNumber(raw.totalDailyReward),
  totalPendingReward: new BigNumber(raw.totalPendingReward),
  totalClaimedReward: new BigNumber(raw.totalClaimedReward)
});
