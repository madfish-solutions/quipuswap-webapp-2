import BigNumber from 'bignumber.js';

import {
  RawStakingItem,
  RawStakeStats,
  StakingItem,
  StakeStats,
  NoUserStakingItem,
  UserStakingItem
} from '@interfaces/staking.interfaces';
import { getTokensName, isExist, isUndefined } from '@utils/helpers';
import { Token } from '@utils/types';

const mapStakingToken = (raw: Token, newSymbol?: string): Token => ({
  ...raw,
  fa2TokenId: raw.fa2TokenId === undefined ? undefined : Number(raw.fa2TokenId),
  metadata: { ...raw.metadata, symbol: newSymbol ?? raw.metadata.symbol }
});

const mapRawBigNumber = <T extends null | undefined>(raw: BigNumber.Value | T): BigNumber | T =>
  isExist(raw) ? new BigNumber(raw) : raw;

export const mapStakeItem = (raw: RawStakingItem): StakingItem => {
  let balances: NoUserStakingItem | UserStakingItem;

  if (!isUndefined(raw.myBalance) && !isUndefined(raw.depositBalance) && !isUndefined(raw.earnBalance)) {
    balances = {
      myBalance: new BigNumber(raw.myBalance),
      depositBalance: new BigNumber(raw.depositBalance),
      earnBalance: new BigNumber(raw.earnBalance)
    } as UserStakingItem;
  } else {
    balances = {
      myBalance: null,
      depositBalance: null,
      earnBalance: null
    } as NoUserStakingItem;
  }

  return {
    ...raw,
    ...balances,
    id: new BigNumber(raw.id),
    tokenA: mapStakingToken(raw.tokenA),
    tokenB: raw.tokenB ? mapStakingToken(raw.tokenB) : undefined,
    stakedToken: mapStakingToken(raw.stakedToken, getTokensName(raw.tokenA, raw.tokenB)),
    rewardToken: mapStakingToken(raw.rewardToken),
    tvl: new BigNumber(raw.tvl),
    apr: mapRawBigNumber(raw.apr),
    apy: mapRawBigNumber(raw.apy),
    depositExchangeRate: new BigNumber(raw.depositExchangeRate),
    earnExchangeRate: new BigNumber(raw.earnExchangeRate)
  };
};

export const mapStakesItems = (rawList: RawStakingItem[]): StakingItem[] => rawList.map(mapStakeItem);

export const mapStakeStats = (raw: RawStakeStats): StakeStats => ({
  totalValueLocked: new BigNumber(raw.totalValueLocked),
  totalDailyReward: new BigNumber(raw.totalDailyReward),
  totalPendingReward: new BigNumber(raw.totalPendingReward),
  totalClaimedReward: new BigNumber(raw.totalClaimedReward)
});
