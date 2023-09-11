import { useEffect, useRef } from 'react';

import { useFormik } from 'formik';
import { FormikHelpers } from 'formik/dist/types';

import { DUMMY_BAKER } from '@config/bakers';
import { DEFAULT_DECIMALS } from '@config/constants';
import { useFarmingItemStore } from '@modules/farming/hooks';
import { useDoStake } from '@modules/farming/hooks/blockchain/use-do-stake';
import { useGetFarmingItem } from '@modules/farming/hooks/loaders/use-get-farming-item';
import {
  bigNumberToString,
  toAtomic,
  defined,
  isNull,
  isExist,
  getFormikError,
  numberAsString,
  executeAsyncSteps
} from '@shared/helpers';
import { useMount } from '@shared/hooks';
import { ActiveStatus, WhitelistedBaker } from '@shared/types';

import { StakeFormFields, StakeFormValues } from './stake-form.interface';
import { useStakeConfirmationPopup } from './use-stake-confirmation-popup';
import { useStakeFormValidation } from './use-stake-form.validation';
import { canDelegate } from '../../../helpers';

const getDummyBaker = (condition: boolean) => (condition ? null : { address: DUMMY_BAKER });

export const useStakeFormViewModel = () => {
  const confirmationPopup = useStakeConfirmationPopup();
  const farmingItemStore = useFarmingItemStore();
  const { delayedGetFarmingItem } = useGetFarmingItem();
  const { doStake } = useDoStake();
  const { isNextStepsRelevant } = useMount();
  const { farmingItem, inputAmount, selectedBaker } = farmingItemStore;

  const availableBalance = farmingItemStore.availableBalance;

  const userTokenBalance = availableBalance ? bigNumberToString(availableBalance) : null;

  const shouldShowBakerInput = isNull(farmingItem) || canDelegate(farmingItem);
  const prevShouldShowBakerInputRef = useRef(true);

  const validationSchema = useStakeFormValidation(availableBalance, shouldShowBakerInput, farmingItem?.stakeStatus);
  const isStakingAvailable = farmingItem?.stakeStatus === ActiveStatus.ACTIVE;

  const handleStakeSubmit = async (_: StakeFormValues, actions: FormikHelpers<StakeFormValues>) => {
    actions.setSubmitting(true);

    if (isStakingAvailable) {
      const token = defined(farmingItem).stakedToken;
      // TODO: Move to model
      const atomicInputAmount = toAtomic(defined(inputAmount), token);

      await doStake(defined(farmingItem), atomicInputAmount, token, defined(selectedBaker));
    }

    formik.resetForm();
    actions.setSubmitting(false);
  };

  const handleStakeSubmitAndUpdateData = async (values: StakeFormValues, actions: FormikHelpers<StakeFormValues>) => {
    confirmationPopup(async () => {
      await executeAsyncSteps(
        [
          async () => await handleStakeSubmit(values, actions),
          async () =>
            await delayedGetFarmingItem(defined(farmingItem).id, defined(farmingItem).version, defined(farmingItem).old)
        ],
        isNextStepsRelevant
      );
    });
  };

  const formik = useFormik({
    validationSchema,
    initialValues: {
      [StakeFormFields.inputAmount]: '',
      [StakeFormFields.selectedBaker]: '',
      [StakeFormFields.farmStatus]: ''
    },
    onSubmit: handleStakeSubmitAndUpdateData
  });

  useEffect(() => {
    if (prevShouldShowBakerInputRef.current !== shouldShowBakerInput) {
      formik.setFieldValue(StakeFormFields.selectedBaker, '');
      farmingItemStore.setSelectedBaker(getDummyBaker(shouldShowBakerInput));
    }
    prevShouldShowBakerInputRef.current = shouldShowBakerInput;
  }, [shouldShowBakerInput, formik, farmingItemStore]);

  const inputAmountError = getFormikError(formik, StakeFormFields.inputAmount);
  const bakerError = getFormikError(formik, StakeFormFields.selectedBaker);
  const farmStatusError = getFormikError(formik, StakeFormFields.farmStatus);

  const disabled = formik.isSubmitting || isExist(inputAmountError) || isExist(bakerError) || isExist(farmStatusError);

  const handleInputAmountChange = (value: string) => {
    const decimals = defined(farmingItem).stakedToken.metadata.decimals;
    const { fixedValue, realValue } = numberAsString(value, decimals);
    farmingItemStore.setInputAmount(fixedValue);
    formik.setFieldValue(StakeFormFields.inputAmount, realValue);
  };

  const handleBakerChange = (baker: WhitelistedBaker) => {
    farmingItemStore.setSelectedBaker(baker);
    formik.setFieldValue(StakeFormFields.selectedBaker, baker.address);
  };

  return {
    bakerInputValue: formik.values[StakeFormFields.selectedBaker],
    shouldShowBakerInput,
    handleSubmit: formik.handleSubmit,
    inputAmount: formik.values[StakeFormFields.inputAmount],
    isSubmitting: formik.isSubmitting,
    userTokenBalance,
    inputAmountError,
    farmingItem,
    stakedTokenDecimals: farmingItem?.stakedToken.metadata.decimals ?? DEFAULT_DECIMALS,
    bakerError,
    farmStatusError,
    disabled,
    handleInputAmountChange,
    handleBakerChange
  };
};
