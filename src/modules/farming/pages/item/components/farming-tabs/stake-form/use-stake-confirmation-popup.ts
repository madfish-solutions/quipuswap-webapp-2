import BigNumber from 'bignumber.js';

import { NO_TIMELOCK_VALUE } from '@config/constants';
import { useFarmingItemStore } from '@modules/farming/hooks';
import { isExist, parseTimelock } from '@shared/helpers';
import { Optional, Undefined } from '@shared/types';
import { useConfirmationModal } from '@shared/utils';
import { i18n } from '@translation';

const IS_TIMELOCK_IN_SECONDS = true;

const getConfirmationMessage = (
  depositBalance: Optional<BigNumber>,
  timelock: Undefined<string>,
  withdrawalFee: Undefined<BigNumber>
) => {
  if (!isExist(depositBalance) || !isExist(timelock) || !isExist(withdrawalFee)) {
    return null;
  }

  const { days, hours, minutes } = parseTimelock(timelock, IS_TIMELOCK_IN_SECONDS);
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
  const timelock = farmingItemStore.farmingItem?.timelock;

  if (timelock === NO_TIMELOCK_VALUE) {
    return async (callback: () => Promise<void>) => callback();
  }

  const depositBalance = farmingItemStore.farmingItem?.depositBalance;
  const withdrawalFee = farmingItemStore.farmingItem?.withdrawalFee;

  const message = getConfirmationMessage(depositBalance, timelock, withdrawalFee);

  return (yesCallback: () => Promise<void>) => openConfirmationModal({ message, yesCallback });
};
