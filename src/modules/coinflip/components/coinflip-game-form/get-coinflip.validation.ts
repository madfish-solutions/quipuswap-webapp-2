import { BigNumber } from 'bignumber.js';
import { string } from 'yup';

import { isEqual, leaveAllNumbers, onlyDigitsAndSeparator } from '@shared/helpers';
import { Token } from '@shared/types';
import { i18n } from '@translation';

import { amountGreaterThanValue } from './amount-greater-than-value.helper';

const INPUT_ZERO_AMOUNT = 0;
const REQUIRE_FIELD_MESSAGE = 'common|This field is required';

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
      value => amountGreaterThanValue(balance, value ?? '')
    )
    .required(i18n.t(REQUIRE_FIELD_MESSAGE))
    .test(
      'bid-too-high',
      () =>
        i18n.t('common|amountShouldBeSmallerThanBid', {
          amount: Number(bidSize),
          tokenSymbol: symbol
        }),
      value => amountGreaterThanValue(bidSize, value ?? '')
    )
    .test(
      'input-decimals-amount',
      () =>
        i18n.t('common|tokenDecimalsOverflowError', {
          tokenSymbol: symbol,
          decimalPlaces: decimals
        }),
      value => leaveAllNumbers(value ?? '').length <= decimals
    )
    .required(i18n.t(REQUIRE_FIELD_MESSAGE));
};
