import BigNumber from 'bignumber.js';

import { ZERO_AMOUNT } from '@config/constants';
import { Nullable } from '@shared/types';
import { makeNumberAsStringTestFn, numberAsStringSchema } from '@shared/validators';
import { i18n } from '@translation';

import { isExist } from './type-checks';

const ZERO = 0;

export const operationAmountSchema = (
  value: Nullable<BigNumber>,
  isZeroInclusive = false,
  maxDecimals?: Nullable<number>,
  decimalsOverflowError?: string
) => {
  const baseSchema = value
    ? numberAsStringSchema(
        { value: ZERO, isInclusive: isZeroInclusive },
        { value, isInclusive: true },
        isZeroInclusive ? i18n.t('common|valueShouldBeNonNegative') : i18n.t('common|valueShouldBePositive'),
        i18n.t('common|maxAvailableValueError', { value: value.toFixed() })
      )
    : numberAsStringSchema(
        { value: ZERO, isInclusive: isZeroInclusive },
        null,
        isZeroInclusive ? i18n.t('common|valueShouldBeNonNegative') : i18n.t('common|valueShouldBePositive')
      );

  if (isExist(maxDecimals) && isExist(decimalsOverflowError)) {
    return baseSchema.test(
      'input-decimals-amount',
      () => decimalsOverflowError,
      makeNumberAsStringTestFn(_value => (_value.decimalPlaces() ?? ZERO_AMOUNT) <= maxDecimals)
    );
  }

  return baseSchema;
};
