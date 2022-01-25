import BigNumber from 'bignumber.js';
import { i18n } from 'next-i18next';

const MAX_TRANSACTION_DURATION_MINUTES = 43200;

export const validateDeadline = (deadline: BigNumber) => {
  if (deadline.gt(MAX_TRANSACTION_DURATION_MINUTES)) {
    return i18n?.t('common|deadlineOutOfRangeError') || 'Deadline has to be between 1m and 30 days (43200m)';
  }

  return undefined;
};
