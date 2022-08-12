import BigNumber from 'bignumber.js';

import { MS_IN_SECOND, NO_TIMELOCK_VALUE } from '@config/constants';
import { getMinEndTime } from '@modules/farming/helpers';
import { useFarmingItemStore } from '@modules/farming/hooks';
import { isExist, parseTimelock } from '@shared/helpers';
import { Optional, Undefined } from '@shared/types';
import { useConfirmationModal } from '@shared/utils';
import { i18n } from '@translation';

const IS_TIMELOCK_IN_SECONDS = true;
const TIME_LOCK_ENDS = 0;

const getConfirmationMessage = (
  depositBalance: Optional<BigNumber>,
  timelock: Undefined<string>,
  withdrawalFee: Undefined<BigNumber>,
  itemEndTime: Undefined<string>,
  lastStaked: Undefined<Date>
) => {
  if (
    !isExist(depositBalance) ||
    !isExist(timelock) ||
    !isExist(withdrawalFee) ||
    !isExist(itemEndTime) ||
    !isExist(lastStaked)
  ) {
    return null;
  }

  const lastStakedTime = lastStaked.getTime();
  const endTimestamp = lastStakedTime + Number(timelock) * MS_IN_SECOND;
  const minEndTime = getMinEndTime(itemEndTime, endTimestamp) ?? TIME_LOCK_ENDS;
  const timeout = Math.max(minEndTime - Date.now(), TIME_LOCK_ENDS) / MS_IN_SECOND;

  const { days, hours, minutes } = parseTimelock(timeout, IS_TIMELOCK_IN_SECONDS);
  const persent = withdrawalFee.toFixed();

  if (depositBalance.isZero()) {
    return i18n.t('farm|confirmationFirstStake', { days, hours, persent });
  } else {
    return i18n.t('farm|confirmationUpdateStake', { days, hours, minutes });
  }
};

export const useStakeConfirmationPopup = () => {
  const { openConfirmationModal } = useConfirmationModal();
  const farmingItemStore = useFarmingItemStore();
  const { userInfoStore } = farmingItemStore;
  const timelock = farmingItemStore.farmingItem?.timelock;
  const endTime = farmingItemStore.farmingItem?.endTime;
  const lastStaked = userInfoStore.data?.last_staked;

  if (timelock === NO_TIMELOCK_VALUE) {
    return async (callback: () => Promise<void>) => callback();
  }

  const depositBalance = farmingItemStore.farmingItem?.depositBalance;
  const withdrawalFee = farmingItemStore.farmingItem?.withdrawalFee;

  const message = getConfirmationMessage(depositBalance, timelock, withdrawalFee, endTime, lastStaked);

  return (yesCallback: () => Promise<void>) => openConfirmationModal({ message, yesCallback });
};
