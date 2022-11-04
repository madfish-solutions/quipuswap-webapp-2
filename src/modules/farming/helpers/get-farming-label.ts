import { NO_TIMELOCK_VALUE, NO_WITHDRAWAL_FEE_VALUE } from '@config/constants';
import { LabelComponentProps } from '@shared/components';
import { getTimeLockDescription, isUndefined } from '@shared/helpers';
import { i18n } from '@translation';

import { FarmingItemCommonModel, FarmingItemModel } from '../models';

export const getFarmingLabel = (item: FarmingItemModel | FarmingItemCommonModel): Array<LabelComponentProps> => {
  const { timelock, withdrawalFee } = item;

  // TODO: https://madfish.atlassian.net/browse/QUIPU-636
  if (!item.old && item.id.toFixed() === '4') {
    return [
      {
        status: item.stakeStatus,
        label: i18n.t('farm|pending')
      }
    ];
  }

  if (isUndefined(timelock) || isUndefined(withdrawalFee)) {
    return [];
  }

  const timeLockLabel = getTimeLockDescription(timelock);

  const shouldShowLockPeriod = timelock !== NO_TIMELOCK_VALUE;
  const shouldShowWithdrawalFee = !withdrawalFee?.isEqualTo(NO_WITHDRAWAL_FEE_VALUE);

  const labels = [];
  if (shouldShowLockPeriod && shouldShowWithdrawalFee) {
    labels.push({
      status: item.stakeStatus,
      label: [
        i18n.t('farm|lock', { timelock: timeLockLabel }),
        i18n.t('farm|unlockFee', { unlockFee: withdrawalFee.toFixed() })
      ] as [string, string],
      DTI: 'timeLockLabel_withdrawalFee'
    });
  } else {
    if (shouldShowLockPeriod) {
      labels.push({
        status: item.stakeStatus,
        label: i18n.t('farm|lock', { timelock: timeLockLabel }),
        DTI: 'timeLockLabel'
      });
    }

    if (shouldShowWithdrawalFee) {
      labels.push({
        status: item.stakeStatus,
        label: i18n.t('farm|unlockFee', { unlockFee: withdrawalFee.toFixed() }),
        DTI: 'withdrawalFee'
      });
    }
  }

  return labels;
};
