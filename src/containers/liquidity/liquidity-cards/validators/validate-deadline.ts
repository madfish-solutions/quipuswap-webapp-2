import BigNumber from 'bignumber.js';
import { i18n } from 'next-i18next';

const MIN_DEADLINE_MINUTES = 1;
const MAX_DEADLINE_MINUTES = 43200;

export const validateDeadline = (deadline: BigNumber) => {
  if (deadline.lt(MIN_DEADLINE_MINUTES) || deadline.gt(MAX_DEADLINE_MINUTES)) {
    return i18n?.t('common|deadlineOutOfRangeError') || 'Deadline has to be between 1m and 30 days (43200m)';
  }

  return undefined;
};
