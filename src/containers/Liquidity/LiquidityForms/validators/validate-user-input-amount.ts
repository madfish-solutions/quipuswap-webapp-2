import BigNumber from 'bignumber.js';

import { appi18n } from '@app.i18n';
import { Undefined } from '@utils/types';

export const validateUserInputAmount = (inputValue: BigNumber, userBalance: BigNumber): Undefined<string> => {
  if (inputValue.gt(userBalance)) {
    return appi18n.t('common|Insufficient funds') || 'Insufficient funds';
  }

  return undefined;
};
