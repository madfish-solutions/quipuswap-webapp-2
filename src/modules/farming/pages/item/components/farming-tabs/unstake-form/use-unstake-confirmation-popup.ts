import { BigNumber } from 'bignumber.js';

import { useFarmingItemStore } from '@modules/farming/hooks';
import { isExist, parseTimelock } from '@shared/helpers';
import { Nullable, Undefined } from '@shared/types';
import { useConfirmationModal } from '@shared/utils';
import { TFunction, useTranslation } from '@translation';

import { useFarmingTimeout } from '../../../../../hooks/blockchain/use-farming-timeout';

const getConfirmationMessage = (
  timelock: Nullable<number>,
  withdrawalFee: Undefined<BigNumber>,
  translation: TFunction
) => {
  if (!isExist(timelock) || !isExist(withdrawalFee)) {
    return null;
  }

  const { days, hours } = parseTimelock(timelock);
  const persent = withdrawalFee.toFixed();

  return translation('farm|confirmationUnstake', { days, hours, persent });
};

export const useUnstakeConfirmationPopup = () => {
  const { openConfirmationModal } = useConfirmationModal();
  const { t } = useTranslation('farm');
  const { farmingItem } = useFarmingItemStore();
  const { timeout, isUnlocked } = useFarmingTimeout();

  if (isUnlocked) {
    return async (callback: () => Promise<void>) => callback();
  }

  const withdrawalFee = farmingItem?.withdrawalFee;

  const confirmationMessage = getConfirmationMessage(timeout, withdrawalFee, t);

  return (callback: () => Promise<void>) => openConfirmationModal(confirmationMessage, callback);
};
