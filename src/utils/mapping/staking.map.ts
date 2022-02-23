import BigNumber from 'bignumber.js';

import { ZERO_ADDRESS } from '@app.config';
import { RawStakingItem, RawStakeStats, StakingItem, StakeStats } from '@interfaces/staking.interfaces';
import { getStakingDepositTokenSymbol, mapRawBigNumber, mapStakingToken } from '@utils/helpers';

const mapStakeItem = ({
  id,
  tokenA,
  tokenB,
  rewardToken,
  tvl,
  apr,
  apy,
  depositExchangeRate,
  earnExchangeRate,
  stakedToken,
  rewardPerSecond,
  currentDelegate,
  nextDelegate,
  timelock,
  endTime,
  harvestFee,
  withdrawalFee,
  earnBalance,
  depositBalance,
  ...rest
}: RawStakingItem): StakingItem => {
  const stakedTokenBase = mapStakingToken(stakedToken);

  return {
    ...rest,
    id: new BigNumber(id),
    stakedToken: {
      ...stakedTokenBase,
      metadata: {
        ...stakedTokenBase.metadata,
        symbol: getStakingDepositTokenSymbol({ tokenA, tokenB })
      }
    },
    tokenA: mapStakingToken(tokenA),
    tokenB: tokenB ? mapStakingToken(tokenB) : undefined,
    rewardToken: mapStakingToken(rewardToken),
    tvl: new BigNumber(tvl),
    apr: mapRawBigNumber(apr),
    apy: mapRawBigNumber(apy),
    depositExchangeRate: new BigNumber(depositExchangeRate),
    earnExchangeRate: new BigNumber(earnExchangeRate),
    rewardPerSecond: new BigNumber(rewardPerSecond),
    depositBalance: mapRawBigNumber(depositBalance),
    earnBalance: mapRawBigNumber(earnBalance),
    currentDelegate: currentDelegate === ZERO_ADDRESS ? null : currentDelegate,
    nextDelegate: nextDelegate === ZERO_ADDRESS ? null : nextDelegate,
    timelock: Number(timelock),
    endTime: new Date(endTime).getTime(),
    harvestFee: mapRawBigNumber(harvestFee),
    withdrawalFee: mapRawBigNumber(withdrawalFee),
    myBalance: null,
    myDelegate: null,
    myLastStaked: null
  };
};

export const mapStakesItems = (rawList: RawStakingItem[]): StakingItem[] => rawList.map(mapStakeItem);

export const mapStakeStats = (raw: RawStakeStats): StakeStats => ({
  totalValueLocked: new BigNumber(raw.totalValueLocked),
  totalDailyReward: new BigNumber(raw.totalDailyReward),
  totalPendingReward: new BigNumber(raw.totalPendingReward),
  totalClaimedReward: new BigNumber(raw.totalClaimedReward)
});
