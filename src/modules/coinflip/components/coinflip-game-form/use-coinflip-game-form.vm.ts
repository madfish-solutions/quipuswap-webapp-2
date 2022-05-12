import { BigNumber } from 'bignumber.js';
import { useFormik } from 'formik';
import { object } from 'yup';

import { Noop, Nullable } from '@shared/types';
import { balanceAmountSchema } from '@shared/validators/balance-amount-schema';

export enum FormFields {
  inputAmount = 'inputAmount'
}

const getValidation = (balance: Nullable<BigNumber>) =>
  object().shape({
    [FormFields.inputAmount]: balanceAmountSchema(balance).required('Value is required')
  });

export const useCoinflipGameFormViewModel = (
  tokenBalance: Nullable<BigNumber>,
  handleSubmit: Noop,
  onAmountInputChange: (amountInput: string) => void
) => {
  const formik = useFormik({
    initialValues: {
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
    handleInputAmountChange
  };
};
