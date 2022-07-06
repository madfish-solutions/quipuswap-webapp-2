import { useEffect } from 'react';

import { BigNumber } from 'bignumber.js';
import { useFormik } from 'formik';
import { object, string } from 'yup';

import { useCoinFlip } from '@modules/coinflip/hooks';
import { bigNumberToString, isEqual } from '@shared/helpers';
import { Noop, Nullable } from '@shared/types';
import { balanceAmountSchema } from '@shared/validators';

import { CoinSide, TokenToPlay } from '../../stores';

export enum FormFields {
  coinSide = 'coinSide',
  inputAmount = 'inputAmount'
}

const getValidation = (balance: Nullable<BigNumber>) =>
  object().shape({
    [FormFields.coinSide]: string().required('Coin Side is required'),
    [FormFields.inputAmount]: balanceAmountSchema(balance).required('Amount is required')
  });

export const useCoinflipGameFormViewModel = (
  tokenToPlay: TokenToPlay,
  tokenBalance: Nullable<BigNumber>,
  payout: Nullable<BigNumber>,
  handleSubmit: Noop,
  onAmountInputChange: (amountInput: string) => void,
  onCoinSideSelect: (coinSide: Nullable<CoinSide>) => void
) => {
  const { handleCoinFlip: handleCoinFlipPure } = useCoinFlip();
  const formik = useFormik({
    initialValues: {
      [FormFields.coinSide]: '',
      [FormFields.inputAmount]: ''
    },
    validationSchema: getValidation(tokenBalance),
    onSubmit: handleSubmit
  });

  const inputAmount = formik.values[FormFields.inputAmount];
  const coinSide = formik.values[FormFields.coinSide];

  useEffect(() => {
    formik.resetForm();
    // Skip formik dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenToPlay]);

  const handleInputAmountChange = (value: string) => {
    onAmountInputChange(value);
    formik.setFieldValue(FormFields.inputAmount, value);
  };

  const inputAmountError =
    formik.errors[FormFields.inputAmount] && formik.touched[FormFields.inputAmount]
      ? formik.errors[FormFields.inputAmount]
      : undefined;

  const handleCoinSideSelect = (value: CoinSide) => {
    if (isEqual(coinSide, value)) {
      onCoinSideSelect(null);
      formik.setFieldValue(FormFields.coinSide, '');

      return;
    }
    onCoinSideSelect(value);
    formik.setFieldValue(FormFields.coinSide, value);
  };

  const coinSideError =
    formik.errors[FormFields.coinSide] && formik.touched[FormFields.coinSide]
      ? formik.errors[FormFields.coinSide]
      : undefined;

  const balance = tokenBalance ? tokenBalance.toFixed() : null;
  const disabled = false;
  const isSubmitting = false;

  const payoutAmount = inputAmount && payout ? bigNumberToString(payout) : '';

  const handleCoinFlip = async () => {
    if (inputAmount && coinSide) {
      await handleCoinFlipPure(new BigNumber(inputAmount), coinSide);
      onCoinSideSelect(null);
      formik.resetForm();
    }
  };

  return {
    tokenBalance,
    payoutAmount,
    inputAmountError,
    handleFormSubmit: formik.handleSubmit,
    inputAmount,
    disabled,
    isSubmitting,
    balance,
    coinSideError,
    handleInputAmountChange,
    handleCoinSideSelect,
    handleCoinFlip
  };
};
