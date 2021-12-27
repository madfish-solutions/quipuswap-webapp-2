import BigNumber from 'bignumber.js';
import { i18n } from 'next-i18next';

export const validateUserInputAmount = (inputValue: BigNumber, userBalance: BigNumber): string | undefined => {
  if (inputValue.gt(userBalance)) {
    return i18n?.t('common|Insufficient funds') || 'Insufficient funds';
  }

  return undefined;
};
