import BigNumber from 'bignumber.js';
import { object, string } from 'yup';

import { useCoinflipStore } from '@modules/coinflip/hooks';
import { isExist } from '@shared/helpers';

import { getCoinflipValidation } from './get-coinflip.validation';
import { FormFields } from './use-coinflip-game-form.vm';

export const useCoinflipValidation = (balance: Nullable<BigNumber>) => {
  const { token, maxBetSize } = useCoinflipStore();

  if (!isExist(maxBetSize) || !isExist(balance)) {
    return;
  }

  const inputAmountValidationSchema = getCoinflipValidation(token, balance, maxBetSize);

  return object().shape({
    [FormFields.coinSide]: string().required('Coin Side is required'),
    [FormFields.inputAmount]: inputAmountValidationSchema
  });
};
