import { BigNumber } from 'bignumber.js';
import { i18n } from 'next-i18next';
import { string as stringSchema } from 'yup';

import { Optional } from '@utils/types';

export const makeNumberAsStringTestFn = (testFn: (value: BigNumber) => boolean) => {
  return (value: Optional<string>) => typeof value !== 'string' || testFn(new BigNumber(value));
};

export const numberAsStringSchema = (
  min?: Optional<BigNumber.Value>,
  max?: Optional<BigNumber.Value>,
  message?: string
) => {
  const schema = stringSchema().test(
    'is-valid',
    'Must be a number',
    makeNumberAsStringTestFn(value => !value.isNaN())
  );
  const actualMin = min && new BigNumber(min).isFinite() ? new BigNumber(min) : null;
  const actualMax = max && new BigNumber(max).isFinite() ? new BigNumber(max) : null;

  if (actualMin && actualMax) {
    return schema.test(
      'min-max-value',
      () =>
        message ??
        i18n?.t('common|Value has to be a number between {{min}} and {{max}}', {
          min: actualMin.toFixed(),
          max: actualMax.toFixed()
        }) ??
        '',
      makeNumberAsStringTestFn(value => value.gte(actualMin) && value.lte(actualMax))
    );
  }
  if (actualMin) {
    return schema.test(
      'min-value',
      () => message ?? i18n?.t('common|Minimal value is {{min}}', { min: actualMin.toFixed() }) ?? '',
      makeNumberAsStringTestFn(value => value.gte(actualMin))
    );
  }
  if (actualMax) {
    return schema.test(
      'max-value',
      () => message ?? i18n?.t('common|Maximal value is {{max}}', { max: actualMax.toFixed() }) ?? '',
      makeNumberAsStringTestFn(value => value.lte(actualMax))
    );
  }

  return schema;
};
