import BigNumber from 'bignumber.js';
import { i18n } from 'next-i18next';

const MAX_SLIPPAGE = 100;

export const validateSlippage = (slippage: BigNumber) => {
  if (slippage.gt(MAX_SLIPPAGE)) {
    return i18n?.t('common|Maximal value is {{max}}', { max: MAX_SLIPPAGE }) || `Maximal value is ${MAX_SLIPPAGE}`;
  }

  return undefined;
};
