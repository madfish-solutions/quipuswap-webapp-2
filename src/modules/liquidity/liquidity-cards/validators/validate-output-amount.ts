import BigNumber from 'bignumber.js';

import { i18n } from '@translation';

const ZERO = 0;
export const validateOutputAmount = (amount: BigNumber) => {
  if (amount.eq(ZERO)) {
    return i18n?.t('common|Invalid output') || 'Invalid output';
  }

  return undefined;
};
