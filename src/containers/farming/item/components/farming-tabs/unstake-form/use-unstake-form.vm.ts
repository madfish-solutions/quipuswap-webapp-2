import { BigNumber } from 'bignumber.js';
import { useFormik } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import { TFunction, useTranslation } from 'next-i18next';

import { DEFAULT_DECIMALS, MS_IN_SECOND } from '@app.config';
import { useConfirmationModal } from '@components/modals/confirmation-modal';
import { useFarmingItemStore } from '@hooks/stores/use-farming-item-store';
import { getFormikError } from '@utils/forms/get-formik-error';
import {
  bigNumberToString,
  defined,
  isExist,
  isUndefined,
  parseTimelock,
  prepareNumberAsString,
  toDecimals
} from '@utils/helpers';
import { Nullable, Undefined } from '@utils/types';

import { useDoUnstake } from '../../../../hooks/use-do-unstake';
import { useGetFarmingItem } from '../../../../hooks/use-get-farming-item';
import { UnstakeFormFields, UnstakeFormValues } from './unstake-form.interface';
import { useUnstakeFormValidation } from './use-unstake-form.validation';

const TIME_LOCK_ENDS = 0;

const getTimeout = (lastStaked: Undefined<string>, timelock: Undefined<string>) => {
  if (isUndefined(lastStaked) || isUndefined(timelock)) {
    return null;
  }

  const lastStakedTime = new Date(lastStaked).getTime();
  const endTimestamp = lastStakedTime + Number(timelock) * MS_IN_SECOND;

  return Math.max(endTimestamp - Date.now(), TIME_LOCK_ENDS);
};

const getConfirmationMessage = (
  timelock: Nullable<number>,
  withdrawalFee: Undefined<BigNumber>,
  translation: TFunction
) => {
  if (!isExist(timelock) || !isExist(withdrawalFee)) {
    return null;
  }

  const { days, hours } = parseTimelock(timelock);
  const persent = withdrawalFee.toFixed();

  return translation('farm|confirmationUnstake', { days, hours, persent });
};

const useStakeConfirmationPopup = () => {
  const { openConfirmationModal } = useConfirmationModal();
  const { t } = useTranslation('farm');
  const { farmingItem, userInfoStore } = useFarmingItemStore();
  const timelock = farmingItem?.timelock;
  const lastStaked = userInfoStore.data?.last_staked;

  const timeout = getTimeout(lastStaked, timelock);

  if (timeout === TIME_LOCK_ENDS) {
    return async (callback: () => Promise<void>) => callback();
  }

  const withdrawalFee = farmingItem?.withdrawalFee;

  const confirmationMessage = getConfirmationMessage(timeout, withdrawalFee, t);

  return (callback: () => Promise<void>) => openConfirmationModal(confirmationMessage, callback);
};

export const useUnstakeFormViewModel = () => {
  const confirmationPopup = useStakeConfirmationPopup();
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
