import { BigNumber } from 'bignumber.js';
import { useFormik } from 'formik';
import { object, string } from 'yup';

import { Noop, Nullable } from '@shared/types';
import { balanceAmountSchema } from '@shared/validators/balance-amount-schema';

import { CoinSide } from '../../stores';

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
  tokenBalance: Nullable<BigNumber>,
  handleSubmit: Noop,
  onAmountInputChange: (amountInput: string) => void,
  onCoinSideSelect: (coinSide: CoinSide) => void
) => {
  const formik = useFormik({
    initialValues: {
      [FormFields.coinSide]: '',
      [FormFields.inputAmount]: ''
    },
    validationSchema: getValidation(tokenBalance),
    onSubmit: handleSubmit
  });

  const handleInputAmountChange = (value: string) => {
    onAmountInputChange(value);
    formik.setFieldValue(FormFields.inputAmount, value);
  };

  const inputAmountError =
    formik.errors[FormFields.inputAmount] && formik.touched[FormFields.inputAmount]
      ? formik.errors[FormFields.inputAmount]
      : undefined;

  const handleCoinSideSelect = (value: CoinSide) => {
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

  return {
    tokenBalance,
    inputAmountError,
    handleFormSubmit: formik.handleSubmit,
    inputAmount: formik.values[FormFields.inputAmount],
    disabled,
    isSubmitting,
    balance,
    coinSideError,
    handleInputAmountChange,
    handleCoinSideSelect
  };
};
