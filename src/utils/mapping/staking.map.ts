import BigNumber from 'bignumber.js';

import { RawStakingItem, RawStakeStats, StakingItem, StakeStats, UserBalances } from '@interfaces/staking.interfaces';
import { getTokensName, isExist } from '@utils/helpers';
import { Token } from '@utils/types';

import { balanceMap } from './balance.map';

const mapStakingToken = (raw: Token, newSymbol?: string): Token => ({
  ...raw,
  fa2TokenId: raw.fa2TokenId === undefined ? undefined : Number(raw.fa2TokenId),
  metadata: { ...raw.metadata, symbol: newSymbol ?? raw.metadata.symbol }
});

const mapRawBigNumber = <T extends null | undefined>(raw: BigNumber.Value | T): BigNumber | T =>
  isExist(raw) ? new BigNumber(raw) : raw;

export const mapStakeItem = (raw: RawStakingItem): StakingItem => {
  const balances: UserBalances = {
    myBalance: null,
    depositBalance: null,
    earnBalance: null
  };
  const stakedToken = mapStakingToken(raw.stakedToken, getTokensName(raw.tokenA, raw.tokenB));
  const rewardToken = mapStakingToken(raw.rewardToken);

  if (isExist(raw.myBalance)) {
    balances.myBalance = balanceMap(new BigNumber(raw.myBalance), stakedToken);
  }

  if (isExist(raw.depositBalance)) {
    balances.depositBalance = balanceMap(new BigNumber(raw.depositBalance), stakedToken);
  }

  if (isExist(raw.earnBalance)) {
    balances.earnBalance = balanceMap(new BigNumber(raw.earnBalance), rewardToken);
  }

  return {
    ...raw,
    ...balances,
    id: new BigNumber(raw.id),
    tokenA: mapStakingToken(raw.tokenA),
    tokenB: raw.tokenB ? mapStakingToken(raw.tokenB) : undefined,
    stakedToken,
    rewardToken,
    tvlInUsd: new BigNumber(raw.tvlInUsd),
    tvlInStakedToken: new BigNumber(raw.tvlInStakedToken),
    apr: mapRawBigNumber(raw.apr),
    apy: mapRawBigNumber(raw.apy),
    depositExchangeRate: new BigNumber(raw.depositExchangeRate),
    earnExchangeRate: new BigNumber(raw.earnExchangeRate),
    rewardPerShare: new BigNumber(raw.rewardPerShare)
  };
};

export const mapStakesItems = (rawList: RawStakingItem[]): StakingItem[] => rawList.map(mapStakeItem);

export const mapStakeStats = (raw: RawStakeStats): StakeStats => ({
  totalValueLocked: new BigNumber(raw.totalValueLocked),
  totalDailyReward: new BigNumber(raw.totalDailyReward),
  totalPendingReward: new BigNumber(raw.totalPendingReward),
  totalClaimedReward: new BigNumber(raw.totalClaimedReward)
});
