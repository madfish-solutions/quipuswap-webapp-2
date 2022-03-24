import { useFormik } from 'formik';
import { FormikHelpers } from 'formik/dist/types';

import { DEFAULT_DECIMALS } from '@app.config';
import { useFarmingItemStore } from '@hooks/stores/use-farming-item-store';
import { getFormikError } from '@utils/forms/get-formik-error';
import { bigNumberToString, defined, isExist, prepareNumberAsString, toDecimals } from '@utils/helpers';

import { useDoUnstake } from '../../../../hooks/use-do-unstake';
import { useGetFarmingItem } from '../../../../hooks/use-get-farming-item';
import { UnstakeFormFields, UnstakeFormValues } from './unstake-form.interface';
import { useUnstakeFormValidation } from './use-unstake-form.validation';

export const useUnstakeFormViewModel = () => {
  const farmingItemStore = useFarmingItemStore();
  const { delayedGetFarmingItem } = useGetFarmingItem();
  const { doUnstake } = useDoUnstake();
  const { inputAmount, farmingItem } = farmingItemStore;

  const userTokenBalance = farmingItem?.depositBalance ? bigNumberToString(farmingItem?.depositBalance) : undefined;

  const validationSchema = useUnstakeFormValidation(farmingItem?.depositBalance ?? null);

  const handleUnstakeSubmit = async (_: UnstakeFormValues, actions: FormikHelpers<UnstakeFormValues>) => {
    actions.setSubmitting(true);
    const token = defined(farmingItem).stakedToken;
    const inputAmountWithDecimals = toDecimals(inputAmount, token);
    await doUnstake(defined(farmingItem), inputAmountWithDecimals);

    formik.resetForm();
    actions.setSubmitting(false);
  };

  const handleUnstakeSubmitAndUpdateData = async (
    values: UnstakeFormValues,
    actions: FormikHelpers<UnstakeFormValues>
  ) => {
    await handleUnstakeSubmit(values, actions);

    await delayedGetFarmingItem(defined(farmingItem).id);
  };

  const formik = useFormik({
    initialValues: {
      [UnstakeFormFields.inputAmount]: ''
    },
    validationSchema: validationSchema,
    onSubmit: handleUnstakeSubmitAndUpdateData
  });

  const unstakeAmountError = getFormikError(formik, UnstakeFormFields.inputAmount);

  const disabled = formik.isSubmitting || isExist(unstakeAmountError);
  const inputAmountError =
    formik.errors[UnstakeFormFields.inputAmount] && formik.touched[UnstakeFormFields.inputAmount]
      ? formik.errors[UnstakeFormFields.inputAmount]
      : undefined;

  const handleInputAmountChange = (value: string) => {
    farmingItemStore.setInputAmount(prepareNumberAsString(value));
    formik.setFieldValue(UnstakeFormFields.inputAmount, value);
  };

  return {
    handleSubmit: formik.handleSubmit,
    inputAmount: formik.values[UnstakeFormFields.inputAmount],
    isSubmitting: formik.isSubmitting,
    userTokenBalance,
    inputAmountError,
    farmingItem,
    stakedTokenDecimals: farmingItem?.stakedToken.metadata.decimals ?? DEFAULT_DECIMALS,
    disabled,
    handleInputAmountChange
  };
};
