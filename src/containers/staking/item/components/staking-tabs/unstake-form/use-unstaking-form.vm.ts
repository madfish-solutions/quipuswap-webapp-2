import { useFormik } from 'formik';
import { FormikHelpers } from 'formik/dist/types';

import { useStakingItemStore } from '@hooks/stores/use-staking-item-store';
import { bigNumberToString, defined, isEmptyArray, toDecimals } from '@utils/helpers';

import { useDoUnstake } from '../../../../hooks/use-do-unstake';
import { UnstakingFormFields, UnstakingFormValues } from './unstaking-form.interface';
import { useUnstakingFormValidation } from './use-unstaking-form.validation';

export const useUnstakingFormViewModel = () => {
  const stakingItemStore = useStakingItemStore();
  const { doUnstake } = useDoUnstake();
  const { itemStore, inputAmount } = stakingItemStore;
  const { data: stakeItem } = itemStore;

  const userTokenBalance = stakeItem?.depositBalance ? bigNumberToString(stakeItem?.depositBalance) : undefined;

  const validationSchema = useUnstakingFormValidation(stakeItem?.depositBalance ?? null);

  const handleUnstakeSubmit = async (_: UnstakingFormValues, actions: FormikHelpers<UnstakingFormValues>) => {
    actions.setSubmitting(true);
    const token = defined(stakeItem).stakedToken;
    const inputAmountWithDecimals = toDecimals(inputAmount, token);
    await doUnstake(defined(stakeItem), inputAmountWithDecimals);
    actions.setSubmitting(false);
  };

  const formik = useFormik({
    initialValues: {
      [UnstakingFormFields.inputAmount]: ''
    },
    validationSchema: validationSchema,
    onSubmit: handleUnstakeSubmit
  });

  const disabled = formik.isSubmitting || !isEmptyArray(Object.keys(formik.errors));
  const inputAmountError =
    formik.errors[UnstakingFormFields.inputAmount] && formik.touched[UnstakingFormFields.inputAmount]
      ? formik.errors[UnstakingFormFields.inputAmount]
      : undefined;

  const handleInputAmountChange = (value: string) => {
    stakingItemStore.setInputAmount(value);
    formik.setFieldValue(UnstakingFormFields.inputAmount, value);
  };

  return {
    handleSubmit: formik.handleSubmit,
    inputAmount: formik.values[UnstakingFormFields.inputAmount],
    userTokenBalance,
    inputAmountError,
    stakeItem,
    disabled,
    handleInputAmountChange
  };
};
