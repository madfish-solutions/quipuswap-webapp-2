import { BigNumber } from 'bignumber.js';
import { mixed, SchemaOf } from 'yup';

import { Optional } from '@shared/types';
import { i18n } from '@translation';

const basicBigNumberSchema: SchemaOf<BigNumber> = mixed().test(
  'value-type',
  () => 'Must be a number',
  value => !value || BigNumber.isBigNumber(value)
) as SchemaOf<BigNumber>;

export const bigNumberSchema = (min?: Optional<BigNumber.Value>, max?: Optional<BigNumber.Value>, message?: string) => {
  const schema = basicBigNumberSchema.clone();
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
      value => !(value instanceof BigNumber) || (value.gte(actualMin) && value.lte(actualMax))
    );
  }
  if (actualMin) {
    return schema.test(
      'min-value',
      () => message ?? i18n?.t('common|Minimal value is {{min}}', { min: actualMin.toFixed() }) ?? '',
      value => !(value instanceof BigNumber) || value.gte(actualMin)
    );
  }
  if (actualMax) {
    return schema.test(
      'max-value',
      () => message ?? i18n?.t('common|Maximal value is {{max}}', { max: actualMax.toFixed() }) ?? '',
      value => !(value instanceof BigNumber) || value.lte(actualMax)
    );
  }

  return schema;
};
