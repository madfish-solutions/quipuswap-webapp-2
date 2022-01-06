import BigNumber from 'bignumber.js';
import { i18n } from 'next-i18next';

import { Nullable, Undefined } from '@utils/types';

export const validateUserInputAmount = (
  accountPkh: Nullable<string>,
  inputValue: BigNumber,
  userBalance: Nullable<BigNumber>
): Undefined<string> => {
  const isWalletConnectedAndBalanceLoaded = userBalance && accountPkh;
  if (isWalletConnectedAndBalanceLoaded && userBalance && inputValue.gt(userBalance)) {
    return i18n?.t('common|Insufficient funds') || 'Insufficient funds';
  }

  return undefined;
};
