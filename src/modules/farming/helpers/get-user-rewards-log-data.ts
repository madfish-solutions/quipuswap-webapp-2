import { BigNumber } from 'bignumber.js';

import { defined, getSumOfNumbers } from '@shared/helpers';

import { FarmingListStore } from '../store';

const ZERO_AMOUNT = 0;

export const getUserRewardsLogData = (farmingListStore: FarmingListStore, ids: Array<BigNumber>) => {
  const userEarnBalancesInUsd = ids.map(id => {
    const { earnBalance } = defined(
      farmingListStore.getFarmingItemBalancesModelById(id.toFixed()),
      `getUserRewardsLogData, getFarmingItemBalancesModelById, id:${id.toFixed()}`
    );
    const { earnExchangeRate } = defined(
      farmingListStore.getFarmingItemModelById(id.toFixed()),
      `getUserRewardsLogData, getFarmingItemModelById, id:${id.toFixed()}`
    );

    return (earnBalance && earnBalance.multipliedBy(earnExchangeRate ?? ZERO_AMOUNT)) ?? null;
  });

  return getSumOfNumbers(userEarnBalancesInUsd);
};
