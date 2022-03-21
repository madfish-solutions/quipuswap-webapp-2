import { useFormik } from 'formik';
import { FormikHelpers } from 'formik/dist/types';

import { DEFAULT_DECIMALS } from '@app.config';
import { useStakingItemStore } from '@hooks/stores/use-staking-item-store';
import { getFormikError } from '@utils/forms/get-formik-error';
import { bigNumberToString, defined, isExist, prepareNumberAsString, toDecimals } from '@utils/helpers';

import { useDoUnstake } from '../../../../hooks/use-do-unstake';
import { useGetStakingItem } from '../../../../hooks/use-get-staking-item';
import { UnstakingFormFields, UnstakingFormValues } from './unstaking-form.interface';
import { useUnstakingFormValidation } from './use-unstaking-form.validation';

export const useUnstakingFormViewModel = () => {
  const stakingItemStore = useStakingItemStore();
  const { delayedGetStakingItem } = useGetStakingItem();
  const { doUnstake } = useDoUnstake();
  const { inputAmount } = stakingItemStore;
  const stakeItem = stakingItemStore.stakeItem;

  const userTokenBalance = stakeItem?.depositBalance ? bigNumberToString(stakeItem?.depositBalance) : undefined;

  const validationSchema = useUnstakingFormValidation(stakeItem?.depositBalance ?? null);

  const handleUnstakeSubmit = async (_: UnstakingFormValues, actions: FormikHelpers<UnstakingFormValues>) => {
    actions.setSubmitting(true);
    const token = defined(stakeItem).stakedToken;
    const inputAmountWithDecimals = toDecimals(inputAmount, token);
    await doUnstake(defined(stakeItem), inputAmountWithDecimals);

    formik.resetForm();
    actions.setSubmitting(false);
  };

  const handleUnstakeSubmitAndUpdateData = async (
    values: UnstakingFormValues,
    actions: FormikHelpers<UnstakingFormValues>
  ) => {
    await handleUnstakeSubmit(values, actions);

    await delayedGetStakingItem(defined(stakeItem).id);
  };

  const formik = useFormik({
    initialValues: {
      [UnstakingFormFields.inputAmount]: ''
    },
    validationSchema: validationSchema,
    onSubmit: handleUnstakeSubmitAndUpdateData
  });

  const ustakingAmountError = getFormikError(formik, UnstakingFormFields.inputAmount);

  const disabled = formik.isSubmitting || isExist(ustakingAmountError);
  const inputAmountError =
    formik.errors[UnstakingFormFields.inputAmount] && formik.touched[UnstakingFormFields.inputAmount]
      ? formik.errors[UnstakingFormFields.inputAmount]
      : undefined;

  const handleInputAmountChange = (value: string) => {
    stakingItemStore.setInputAmount(prepareNumberAsString(value));
    formik.setFieldValue(UnstakingFormFields.inputAmount, value);
  };

  return {
    handleSubmit: formik.handleSubmit,
    inputAmount: formik.values[UnstakingFormFields.inputAmount],
    userTokenBalance,
    inputAmountError,
    stakeItem,
    stakedTokenDecimals: stakeItem?.stakedToken.metadata.decimals ?? DEFAULT_DECIMALS,
    disabled,
    handleInputAmountChange
  };
};
