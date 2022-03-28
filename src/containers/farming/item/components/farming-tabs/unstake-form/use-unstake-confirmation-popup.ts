import BigNumber from 'bignumber.js';
import { TFunction, useTranslation } from 'next-i18next';

import { MS_IN_SECOND } from '@app.config';
import { useConfirmationModal } from '@components/modals/confirmation-modal';
import { useFarmingItemStore } from '@hooks/stores/use-farming-item-store';
import { isExist, isUndefined, parseTimelock } from '@utils/helpers';
import { Nullable, Undefined } from '@utils/types';

const TIME_LOCK_ENDS = 0;

const getTimeout = (lastStaked: Undefined<string>, timelock: Undefined<string>) => {
  if (isUndefined(lastStaked) || isUndefined(timelock)) {
    return null;
  }

  const lastStakedTime = new Date(lastStaked).getTime();
  const endTimestamp = lastStakedTime + Number(timelock) * MS_IN_SECOND;

  return Math.max(endTimestamp - Date.now(), TIME_LOCK_ENDS);
};

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
  const { farmingItem, userInfoStore } = useFarmingItemStore();
  const timelock = farmingItem?.timelock;
  const lastStaked = userInfoStore.data?.last_staked;

  const timeout = getTimeout(lastStaked, timelock);

  if (timeout === TIME_LOCK_ENDS) {
    return async (callback: () => Promise<void>) => callback();
  }

  const withdrawalFee = farmingItem?.withdrawalFee;

  const confirmationMessage = getConfirmationMessage(timeout, withdrawalFee, t);

  return (callback: () => Promise<void>) => openConfirmationModal(confirmationMessage, callback);
};
