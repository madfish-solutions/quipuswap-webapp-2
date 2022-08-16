import BigNumber from 'bignumber.js';
import { object } from 'yup';

import { Token } from '@shared/types';

import { getDexTwoAddLiqValidation } from './get-dex-two-add-liq-form-validation';
import { Input } from './use-dex-two-add-liq-form.vm';

export const useDexTwoAddLiqValidation = (token: Token, balance: BigNumber) => {
  const inputAmountValidationSchema = getDexTwoAddLiqValidation(token, balance);

  return object().shape({
    [Input.FIRST]: inputAmountValidationSchema,
    [Input.SECOND]: inputAmountValidationSchema
  });
};
