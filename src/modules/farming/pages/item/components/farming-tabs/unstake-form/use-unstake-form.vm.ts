import { useFormik } from 'formik';
import { FormikHelpers } from 'formik/dist/types';

import { DEFAULT_DECIMALS } from '@config/constants';
import { useFarmingItemStore } from '@modules/farming/hooks';
import { useDoUnstake } from '@modules/farming/hooks/blockchain/use-do-unstake';
import { useGetFarmingItem } from '@modules/farming/hooks/loaders/use-get-farming-item';
import { bigNumberToString, defined, getFormikError, isExist, numberAsString, toDecimals } from '@shared/helpers';

import { UnstakeFormFields, UnstakeFormValues } from './unstake-form.interface';
import { useUnstakeConfirmationPopup } from './use-unstake-confirmation-popup';
import { useUnstakeFormValidation } from './use-unstake-form.validation';

export const useUnstakeFormViewModel = () => {
  const confirmationPopup = useUnstakeConfirmationPopup();
  const farmingItemStore = useFarmingItemStore();
  const { delayedGetFarmingItem } = useGetFarmingItem();
  const { doUnstake } = useDoUnstake();
  const { inputAmount, farmingItem } = farmingItemStore;

  const userTokenBalance = farmingItem?.depositBalance ? bigNumberToString(farmingItem?.depositBalance) : undefined;

  const validationSchema = useUnstakeFormValidation(farmingItem?.depositBalance ?? null);

  const handleUnstakeSubmit = async (_: UnstakeFormValues, actions: FormikHelpers<UnstakeFormValues>) => {
    actions.setSubmitting(true);
    const token = defined(farmingItem).stakedToken;
    const inputAmountWithDecimals = toDecimals(defined(inputAmount), token);
    await doUnstake(defined(farmingItem), inputAmountWithDecimals);

    formik.resetForm();
    actions.setSubmitting(false);
  };

  const handleUnstakeSubmitAndUpdateData = async (
    values: UnstakeFormValues,
    actions: FormikHelpers<UnstakeFormValues>
  ) => {
    confirmationPopup(async () => {
      await handleUnstakeSubmit(values, actions);

      await delayedGetFarmingItem(defined(farmingItem).id);
    });
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
    const decimals = defined(farmingItem).stakedToken.metadata.decimals;
    const { fixedValue, realValue } = numberAsString(value, decimals);
    farmingItemStore.setInputAmount(fixedValue);
    formik.setFieldValue(UnstakeFormFields.inputAmount, realValue);
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
