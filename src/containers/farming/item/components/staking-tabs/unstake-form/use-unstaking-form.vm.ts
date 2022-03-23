import { useFormik } from 'formik';
import { FormikHelpers } from 'formik/dist/types';

import { DEFAULT_DECIMALS } from '@app.config';
import { useFarmingItemStore } from '@hooks/stores/use-farming-item-store';
import { getFormikError } from '@utils/forms/get-formik-error';
import { bigNumberToString, defined, isExist, prepareNumberAsString, toDecimals } from '@utils/helpers';

import { useDoUnstake } from '../../../../hooks/use-do-unstake';
import { useGetFarmingItem } from '../../../../hooks/use-get-farming-item';
import { UnstakingFormFields, UnstakingFormValues } from './unstaking-form.interface';
import { useUnstakingFormValidation } from './use-unstaking-form.validation';

export const useUnstakingFormViewModel = () => {
  const farmingItemStore = useFarmingItemStore();
  const { delayedGetFarmingItem } = useGetFarmingItem();
  const { doUnstake } = useDoUnstake();
  const { inputAmount, farmingItem } = farmingItemStore;

  const userTokenBalance = farmingItem?.depositBalance ? bigNumberToString(farmingItem?.depositBalance) : undefined;

  const validationSchema = useUnstakingFormValidation(farmingItem?.depositBalance ?? null);

  const handleUnstakeSubmit = async (_: UnstakingFormValues, actions: FormikHelpers<UnstakingFormValues>) => {
    actions.setSubmitting(true);
    const token = defined(farmingItem).stakedToken;
    const inputAmountWithDecimals = toDecimals(inputAmount, token);
    await doUnstake(defined(farmingItem), inputAmountWithDecimals);

    formik.resetForm();
    actions.setSubmitting(false);
  };

  const handleUnstakeSubmitAndUpdateData = async (
    values: UnstakingFormValues,
    actions: FormikHelpers<UnstakingFormValues>
  ) => {
    await handleUnstakeSubmit(values, actions);

    await delayedGetFarmingItem(defined(farmingItem).id);
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
    farmingItemStore.setInputAmount(prepareNumberAsString(value));
    formik.setFieldValue(UnstakingFormFields.inputAmount, value);
  };

  return {
    handleSubmit: formik.handleSubmit,
    inputAmount: formik.values[UnstakingFormFields.inputAmount],
    isSubmitting: formik.isSubmitting,
    userTokenBalance,
    inputAmountError,
    farmingItem,
    stakedTokenDecimals: farmingItem?.stakedToken.metadata.decimals ?? DEFAULT_DECIMALS,
    disabled,
    handleInputAmountChange
  };
};
