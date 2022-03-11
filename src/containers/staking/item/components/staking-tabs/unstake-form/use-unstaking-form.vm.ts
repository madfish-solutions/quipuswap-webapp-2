import { useFormik } from 'formik';
import { FormikHelpers } from 'formik/dist/types';

import { useStakingItemStore } from '@hooks/stores/use-staking-item-store';
import { StakingStatus } from '@interfaces/staking.interfaces';
import { defined, isEmptyArray, toDecimals, bigNumberToString } from '@utils/helpers';

import { useDoUnstake } from '../../../../hooks/use-do-unstake';
import { UnstakingFormFields, UnstakingFormValues } from './unstaking-form.interface';
import { useUnstakingFormValidation } from './use-unstaking-form.validation';

export const useUnstakingFormViewModel = () => {
  const stakingItemStore = useStakingItemStore();
  const { doUnstake } = useDoUnstake();
  const { itemStore, inputAmount, depositBalanceStore } = stakingItemStore;
  const { data: stakeItem } = itemStore;
  const { data: depositBalance } = depositBalanceStore;

  const isStakingAlertVisible = stakeItem?.stakeStatus !== StakingStatus.ACTIVE;
  const userTokenBalance = depositBalance ? bigNumberToString(depositBalance) : null;

  const validationSchema = useUnstakingFormValidation(depositBalanceStore.data);

  const handleUnstakeSubmit = async (values: UnstakingFormValues, actions: FormikHelpers<UnstakingFormValues>) => {
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
    isStakingAlertVisible,
    handleSubmit: formik.handleSubmit,
    inputAmount: formik.values[UnstakingFormFields.inputAmount],
    userTokenBalance,
    inputAmountError,
    stakeItem,
    disabled,
    handleInputAmountChange
  };
};
