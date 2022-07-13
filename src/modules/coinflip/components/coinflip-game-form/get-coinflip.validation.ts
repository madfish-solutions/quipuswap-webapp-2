import { BigNumber } from 'bignumber.js';
import { string } from 'yup';

import { isEqual, isExist, onlyDigitsAndSeparator } from '@shared/helpers';
import { Token } from '@shared/types';
import { i18n } from '@translation';

const DECIMAL_INDEX = 1;
const INPUT_ZERO_AMOUNT = 0;

export const getCoinflipValidation = (token: Token, balance: BigNumber, bidSize: BigNumber) => {
  const { decimals, symbol } = token.metadata;

  return string()
    .test(
      'value-type',
      () => i18n.t('common|mustBeANumber'),
      value => onlyDigitsAndSeparator(value ?? '') === value || value === undefined
    )
    .test(
      'zero-amount',
      () => i18n.t('common|cantBeZeroAmount'),
      value => !isEqual(Number(value), INPUT_ZERO_AMOUNT)
    )
    .test(
      'amount-required',
      () => i18n.t('common|amountRequired'),
      value => Boolean(Number(value)) === true
    )
    .test(
      'value-less-balance',
      () => i18n.t('common|Insufficient funds'),
      value => isExist(value) && balance.isGreaterThanOrEqualTo(new BigNumber(value))
    )
    .test(
      'bid-too-high',
      () =>
        i18n.t('common|amountShouldBeSmallerThanBid', {
          amount: Number(bidSize),
          tokenSymbol: symbol
        }),
      value => isExist(value) && bidSize.isGreaterThanOrEqualTo(new BigNumber(value))
    )
    .test(
      'input-decimals-amount',
      () =>
        i18n.t('common|tokenDecimalsOverflowError', {
          tokenSymbol: symbol,
          decimalPlaces: decimals
        }),
      value => isExist(value) && (value.includes('.') ? value.split('.')[DECIMAL_INDEX].length <= decimals : true)
    );
};
