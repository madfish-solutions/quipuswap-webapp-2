import { BigNumber } from 'bignumber.js';

import { MS_IN_SECOND } from '@config/constants';
import { useFarmingItemStore } from '@modules/farming/hooks';
import { isExist, isUndefined, parseTimelock } from '@shared/helpers';
import { Nullable, Undefined } from '@shared/types';
import { useConfirmationModal } from '@shared/utils';
import { TFunction, useTranslation } from '@translation';

const TIME_LOCK_ENDS = 0;

const getTimeout = (lastStaked: Undefined<Date>, timelock: Undefined<string>) => {
  if (isUndefined(lastStaked) || isUndefined(timelock)) {
    return null;
  }

  const lastStakedTime = lastStaked.getTime();
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
  const { t } = useTranslation();
  const { farmingItem, userInfoStore } = useFarmingItemStore();
  const timelock = farmingItem?.timelock;
  const lastStaked = userInfoStore.data?.last_staked;

  const timeout = getTimeout(lastStaked, timelock);

  if (timeout === TIME_LOCK_ENDS) {
    return async (callback: () => Promise<void>) => callback();
  }

  const withdrawalFee = farmingItem?.withdrawalFee;

  const message = getConfirmationMessage(timeout, withdrawalFee, t);

  return (yesCallback: () => Promise<void>) => openConfirmationModal({ message, yesCallback });
};
