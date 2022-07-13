import { useEffect } from 'react';

import { BigNumber } from 'bignumber.js';
import { useFormik } from 'formik';

import { useCoinFlip, useGamersStats, useUserLastGame } from '@modules/coinflip/hooks';
import { bigNumberToString, getFormikError, isEqual } from '@shared/helpers';
import { Nullable } from '@shared/types';

import { CoinSide, TokenToPlay } from '../../stores';
import { useCoinflipValidation } from './use-coinflip.validation';

export enum FormFields {
  coinSide = 'coinSide',
  inputAmount = 'inputAmount'
}

export const useCoinflipGameFormViewModel = (
  tokenToPlay: TokenToPlay,
  tokenBalance: Nullable<BigNumber>,
  payout: Nullable<BigNumber>,
  onAmountInputChange: (amountInput: string) => void,
  onCoinSideSelect: (coinSide: Nullable<CoinSide>) => void
) => {
  const { getGamersStats } = useGamersStats();
  const { getUserLastGame } = useUserLastGame();
  const { handleCoinFlip: handleCoinFlipPure } = useCoinFlip();

  const validationSchema = useCoinflipValidation(tokenBalance);

  const handleCoinFlip = async () => {
    await handleCoinFlipPure(new BigNumber(inputAmount), coinSide);
    onCoinSideSelect(null); // TODO: Remove when fix problem connection between store and validation
    formik.resetForm();
    await getGamersStats();
    await getUserLastGame();
  };

  const formik = useFormik({
    initialValues: {
      [FormFields.coinSide]: '',
      [FormFields.inputAmount]: ''
    },
    validationSchema: validationSchema,
    onSubmit: handleCoinFlip
  });

  const inputAmount = formik.values[FormFields.inputAmount];
  const coinSide = formik.values[FormFields.coinSide];

  // TODO: find better way
  useEffect(() => {
    formik.resetForm();
    // Skip formik dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenToPlay]);

  const handleInputAmountChange = (value: string) => {
    onAmountInputChange(value); // TODO: Remove when fix problem connection between store and validation
    formik.setFieldValue(FormFields.inputAmount, value);
  };

  const inputAmountError = getFormikError(formik, FormFields.inputAmount);

  const handleCoinSideSelect = (value: CoinSide) => {
    if (isEqual(coinSide, value)) {
      onCoinSideSelect(null); // TODO: Remove when fix problem connection between store and validation
      formik.setFieldValue(FormFields.coinSide, '');

      return;
    }
    onCoinSideSelect(value); // TODO: Remove when fix problem connection between store and validation
    formik.setFieldValue(FormFields.coinSide, value);
  };

  const coinSideError = getFormikError(formik, FormFields.coinSide);

  const balance = tokenBalance ? tokenBalance.toFixed() : null;
  const disabled = false;

  const payoutAmount = inputAmount && payout ? bigNumberToString(payout) : '';

  return {
    tokenBalance,
    payoutAmount,
    inputAmountError,
    handleFormSubmit: formik.handleSubmit,
    inputAmount,
    disabled,
    isSubmitting: formik.isSubmitting,
    balance,
    coinSideError,
    handleInputAmountChange,
    handleCoinSideSelect
  };
};
