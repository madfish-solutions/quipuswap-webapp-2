import { BigNumber } from 'bignumber.js';
import { i18n } from 'next-i18next';
import { object, SchemaOf } from 'yup';

const basicBigNumberSchema: SchemaOf<BigNumber> = object().shape({}) as SchemaOf<BigNumber>;

export const bigNumberSchema = (
  min?: BigNumber.Value,
  max?: BigNumber.Value,
) => {
  let schema = basicBigNumberSchema.test(
    'value-type',
    () => 'Must be a number',
    (value) => !value || (value instanceof BigNumber),
  );

  if (min && max) {
    schema = schema.test(
      'min-max-value',
      () => i18n?.t(
        'common|Value has to be a number between {{min}} and {{max}}',
        { min: new BigNumber(min).toFixed(), max: new BigNumber(max).toFixed() },
      ) ?? '',
      (value) => !(value instanceof BigNumber) || (value.gte(min) && value.lte(max)),
    );
  } else if (min) {
    schema = schema.test(
      'min-value',
      () => i18n?.t(
        'common|Minimal value is {{min}}',
        { min: new BigNumber(min).toFixed() },
      ) ?? '',
      (value) => !(value instanceof BigNumber) || value.gte(min),
    );
  } else if (max) {
    schema = schema.test(
      'max-value',
      () => i18n?.t(
        'common|Maximal value is {{max}}',
        { max: new BigNumber(max).toFixed() },
      ) ?? '',
      (value) => !(value instanceof BigNumber) || value.lte(max),
    );
  }

  return schema;
};
