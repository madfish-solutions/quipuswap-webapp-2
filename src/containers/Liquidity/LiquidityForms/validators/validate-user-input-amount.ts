import BigNumber from 'bignumber.js';
import { i18n } from 'next-i18next';

import { Undefined } from '@utils/types';

export const validateUserInputAmount = (inputValue: BigNumber, userBalance: BigNumber): Undefined<string> => {
  if (inputValue.gt(userBalance)) {
    return i18n?.t('common|Insufficient funds') || 'Insufficient funds';
  }

  return undefined;
};
