import BigNumber from 'bignumber.js';

import { Nullable, Undefined } from '@shared/types';
import { i18n } from '@translation';

export const validateUserInputAmount = (
  accountPkh: Nullable<string>,
  inputValue: BigNumber,
  userBalance: Nullable<BigNumber>
): Undefined<string> => {
  if (!accountPkh) {
    return undefined;
  }

  if (!userBalance || inputValue.gt(userBalance)) {
    return i18n?.t('common|Insufficient funds') || 'Insufficient funds';
  }

  return undefined;
};
