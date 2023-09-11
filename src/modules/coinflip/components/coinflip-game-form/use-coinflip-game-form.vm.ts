import { useEffect } from 'react';

import { BigNumber } from 'bignumber.js';
import { useFormik } from 'formik';

import { bigNumberToString, getFormikError, isEqual, stringToBigNumber } from '@shared/helpers';
import { useAmplitudeService } from '@shared/hooks';
import { Nullable, Token } from '@shared/types';

import { useCoinflipValidation } from './use-coinflip.validation';
import { CoinSide, TokenToPlay } from '../../stores';

export enum FormFields {
  coinSide = 'coinSide',
  inputAmount = 'inputAmount'
}

export const useCoinflipGameFormViewModel = (
  tokenToPlay: TokenToPlay,
  token: Token,
  tokenBalance: Nullable<BigNumber>,
  payout: Nullable<BigNumber>,
  onAmountInputChange: (amountInput: string) => void,
  onCoinSideSelect: (coinSide: Nullable<CoinSide>) => void,
  onSubmit: (coinSide: string, input: BigNumber) => void
) => {
  const { log } = useAmplitudeService();

  const { decimals } = token.metadata;

  const validationSchema = useCoinflipValidation(tokenBalance);

  const handleSubmit = async () => {
    const input = stringToBigNumber(formik.values[FormFields.inputAmount]);

    onSubmit(formik.values[FormFields.coinSide], input);

    onCoinSideSelect(null); // TODO: Remove when fix problem connection between store and validation
    formik.resetForm();
  };

  const formik = useFormik({
    initialValues: {
      [FormFields.coinSide]: '',
      [FormFields.inputAmount]: ''
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit
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

    log('CLICK_FLIP_COIN_SIDE_SELECT', {
      coinSide: value
    });
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
    decimals,
    coinSideError,
    handleInputAmountChange,
    handleCoinSideSelect
  };
};
