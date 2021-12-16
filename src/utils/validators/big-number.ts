import { BigNumber } from 'bignumber.js';
import { i18n } from 'next-i18next';
import { object, SchemaOf } from 'yup';

const basicBigNumberSchema: SchemaOf<BigNumber> = object()
  .shape({})
  .test(
    'value-type',
    () => 'Must be a number',
    value => !value || value instanceof BigNumber
  ) as SchemaOf<BigNumber>;

export const bigNumberSchema = (min?: BigNumber.Value, max?: BigNumber.Value) => {
  const schema = basicBigNumberSchema.clone();
  const actualMin = min && new BigNumber(min).isFinite() ? new BigNumber(min) : undefined;
  const actualMax = max && new BigNumber(max).isFinite() ? new BigNumber(max) : undefined;

  if (actualMin && actualMax) {
    return schema.test(
      'min-max-value',
      () =>
        i18n?.t('common|Value has to be a number between {{min}} and {{max}}', {
          min: actualMin.toFixed(),
          max: actualMax.toFixed()
        }) ?? '',
      value => !(value instanceof BigNumber) || (value.gte(actualMin) && value.lte(actualMax))
    );
  }
  if (actualMin) {
    return schema.test(
      'min-value',
      () => i18n?.t('common|Minimal value is {{min}}', { min: actualMin.toFixed() }) ?? '',
      value => !(value instanceof BigNumber) || value.gte(actualMin)
    );
  }
  if (actualMax) {
    return schema.test(
      'max-value',
      () => i18n?.t('common|Maximal value is {{max}}', { max: actualMax.toFixed() }) ?? '',
      value => !(value instanceof BigNumber) || value.lte(actualMax)
    );
  }

  return schema;
};
