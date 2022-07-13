import BigNumber from 'bignumber.js';
import { object, string } from 'yup';

import { getBidSize } from '@modules/coinflip/helpers';
import { useCoinflipStore } from '@modules/coinflip/hooks';
import { isExist } from '@shared/helpers';

import { getCoinflipValidation } from './get-coinflip.validation';
import { FormFields } from './use-coinflip-game-form.vm';

export const useCoinflipValidation = (balance: Nullable<BigNumber>) => {
  const { token, generalStats } = useCoinflipStore();
  const bank = generalStats?.bank;
  const maxBetPercent = generalStats?.maxBetPercent;

  const bidSize = getBidSize(bank, maxBetPercent);

  if (!isExist(bank) || !isExist(maxBetPercent) || !isExist(balance) || !isExist(bidSize)) {
    return;
  }

  const inputAmountValidationSchema = getCoinflipValidation(token, balance, bidSize);

  return object().shape({
    [FormFields.coinSide]: string().required('Coin Side is required'),
    [FormFields.inputAmount]: inputAmountValidationSchema
  });
};
