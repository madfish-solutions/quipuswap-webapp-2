import BigNumber from 'bignumber.js';
import { i18n } from 'next-i18next';

const MAX_TRANSACTION_DURATION = 43200;
const MAX_TRANSACTION_DURATION_BN = new BigNumber(MAX_TRANSACTION_DURATION);

export const validateTransactionDuration = (transactionDuration: BigNumber) => {
  if (transactionDuration.gt(MAX_TRANSACTION_DURATION_BN)) {
    return i18n?.t('common|deadlineOutOfRangeError') || 'Deadline has to be between 1m and 30 days (43200m)';
  }

  return undefined;
};
