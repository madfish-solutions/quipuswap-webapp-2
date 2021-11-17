import { BigNumber } from 'bignumber.js';
import { object, SchemaOf } from 'yup';

const basicBigNumberSchema: SchemaOf<BigNumber> = object().shape({}) as SchemaOf<BigNumber>;

export const bigNumberSchema = (
  min?: BigNumber.Value,
  max?: BigNumber.Value,
) => basicBigNumberSchema.test(
  (value) => !value || (
    value instanceof BigNumber && (
      (min === undefined) || value.gte(min)
    ) && ((max === undefined) || value.lte(max))
  ),
);
