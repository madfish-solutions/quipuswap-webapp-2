import { BigNumber } from 'bignumber.js';

import { useFarmingItemStore } from '@modules/farming/hooks';
import { isExist, parseTimelock } from '@shared/helpers';
import { Nullable, Undefined } from '@shared/types';
import { useConfirmationModal } from '@shared/utils';
import { i18n } from '@translation';

import { useFarmingTimeout } from '../../../../../hooks/blockchain/use-farming-timeout';

const getConfirmationMessage = (timelock: Nullable<number>, withdrawalFee: Undefined<BigNumber>) => {
  if (!isExist(timelock) || !isExist(withdrawalFee)) {
    return null;
  }

  const { days, hours } = parseTimelock(timelock);
  const persent = withdrawalFee.toFixed();

  return withdrawalFee.isZero()
    ? i18n.t('farm|confirmationUnstakeZero', { days, hours })
    : i18n.t('farm|confirmationUnstake', { days, hours, persent });
};

export const useUnstakeConfirmationPopup = () => {
  const { openConfirmationModal } = useConfirmationModal();
  const { farmingItem } = useFarmingItemStore();
  const { timeout, isUnlocked } = useFarmingTimeout();

  if (isUnlocked) {
    return async (callback: () => Promise<void>) => callback();
  }

  const withdrawalFee = farmingItem?.withdrawalFee;

  const message = getConfirmationMessage(timeout, withdrawalFee);

  return (yesCallback: () => Promise<void>) => openConfirmationModal({ message, yesCallback });
};
