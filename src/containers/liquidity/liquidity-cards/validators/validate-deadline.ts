import BigNumber from 'bignumber.js';
import { i18n } from 'next-i18next';

import { MIN_DEADLINE_MINS, MAX_DEADLINE_MINS } from '@app.config';

export const validateDeadline = (deadline: BigNumber) => {
  if (deadline.lt(MIN_DEADLINE_MINS) || deadline.gt(MAX_DEADLINE_MINS)) {
    return i18n?.t('common|deadlineOutOfRangeError') || 'Deadline has to be between 1m and 30 days (43200m)';
  }

  return undefined;
};
