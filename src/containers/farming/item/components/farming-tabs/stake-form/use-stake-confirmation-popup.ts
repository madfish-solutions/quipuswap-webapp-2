import BigNumber from 'bignumber.js';
import { TFunction, useTranslation } from 'next-i18next';

import { NO_TIMELOCK_VALUE } from '@app.config';
import { useConfirmationModal } from '@components/modals/confirmation-modal';
import { useFarmingItemStore } from '@hooks/stores/use-farming-item-store';
import { isExist, parseTimelock } from '@utils/helpers';
import { Optional, Undefined } from '@utils/types';

const getConfirmationMessage = (
  depositBalance: Optional<BigNumber>,
  timelock: Undefined<string>,
  withdrawalFee: Undefined<BigNumber>,
  translation: TFunction
) => {
  if (!isExist(depositBalance) || !isExist(timelock) || !isExist(withdrawalFee)) {
    return null;
  }

  const { days, hours, minutes } = parseTimelock(timelock);
  const persent = withdrawalFee.toFixed();

  if (depositBalance.isZero()) {
    return translation('farm|confirmationFirstStake', { days, hours, persent });
  } else {
    return translation('farm|confirmationUpdateStake', { days, hours, minutes });
  }
};

export const useStakeConfirmationPopup = () => {
  const { openConfirmationModal } = useConfirmationModal();
  const { t } = useTranslation('farm');
  const farmingItemStore = useFarmingItemStore();
  const timelock = farmingItemStore.farmingItem?.timelock;

  if (timelock === NO_TIMELOCK_VALUE) {
    return async (callback: () => Promise<void>) => callback();
  }

  const depositBalance = farmingItemStore.farmingItem?.depositBalance;
  const withdrawalFee = farmingItemStore.farmingItem?.withdrawalFee;

  const confirmationMessage = getConfirmationMessage(depositBalance, timelock, withdrawalFee, t);

  return (callback: () => Promise<void>) => openConfirmationModal(confirmationMessage, callback);
};
