import { FarmingItem } from '../interfaces';
import { getPendingRewards } from './get-pending-rewards';

const ZERO_AMOUNT = 0;

export const getUserRewardsLogData = (farmingList: FarmingItem[]) => {
  const userEarnBalancesInUsd = farmingList.map(
    ({ earnBalance, earnExchangeRate }) => earnBalance && earnBalance.multipliedBy(earnExchangeRate ?? ZERO_AMOUNT)
  );

  return getPendingRewards(userEarnBalancesInUsd);
};
