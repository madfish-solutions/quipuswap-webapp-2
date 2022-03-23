import { useEffect, useMemo, useRef } from 'react';

import { useFormik } from 'formik';
import { FormikHelpers } from 'formik/dist/types';

import { DEFAULT_DECIMALS, DUMMY_BAKER, TEZOS_TOKEN } from '@app.config';
import { useFarmingItemStore } from '@hooks/stores/use-farming-item-store';
import { ActiveStatus } from '@interfaces/active-statuts-enum';
import { getFormikError } from '@utils/forms/get-formik-error';
import {
  bigNumberToString,
  toDecimals,
  defined,
  isNull,
  isExist,
  getTokenPairSlug,
  prepareNumberAsString
} from '@utils/helpers';
import { WhitelistedBaker } from '@utils/types';

import { useDoStake } from '../../../../hooks/use-do-stake';
import { useGetFarmingItem } from '../../../../hooks/use-get-farming-item';
import { canDelegate } from '../../../helpers';
import { StakingFormFields, StakingFormValues } from './staking-form.interface';
import { useStakingFormValidation } from './use-staking-form.validation';

const getDummyBaker = (condition: boolean) => (condition ? null : { address: DUMMY_BAKER });

export const useStakingFormViewModel = () => {
  const farmingItemStore = useFarmingItemStore();
  const { delayedGetFarmingItem } = useGetFarmingItem();
  const { doStake } = useDoStake();
  const { itemStore, inputAmount, selectedBaker, availableBalanceStore } = farmingItemStore;
  const { data: farmingItem } = itemStore;
  const { data: availableBalance } = availableBalanceStore;

  const userTokenBalance = availableBalance ? bigNumberToString(availableBalance) : null;

  const shouldShowBakerInput = isNull(farmingItem) || canDelegate(farmingItem);
  const prevShouldShowBakerInputRef = useRef(true);

  const validationSchema = useStakingFormValidation(availableBalance, shouldShowBakerInput, farmingItem?.stakeStatus);
  const isStakingAvailable = farmingItem?.stakeStatus === ActiveStatus.ACTIVE;

  const handleStakeSubmit = async (_: StakingFormValues, actions: FormikHelpers<StakingFormValues>) => {
    actions.setSubmitting(true);

    if (isStakingAvailable) {
      const token = defined(farmingItem).stakedToken;
      const inputAmountWithDecimals = toDecimals(inputAmount, token);
      await doStake(defined(farmingItem), inputAmountWithDecimals, token, defined(selectedBaker));
    }

    formik.resetForm();
    actions.setSubmitting(false);
  };

  const handleStakeSubmitAndUpdateData = async (
    values: StakingFormValues,
    actions: FormikHelpers<StakingFormValues>
  ) => {
    await handleStakeSubmit(values, actions);

    await delayedGetFarmingItem(defined(farmingItem).id);
  };

  const formik = useFormik({
    validationSchema,
    initialValues: {
      [StakingFormFields.inputAmount]: '',
      [StakingFormFields.selectedBaker]: '',
      [StakingFormFields.stakingStatus]: ''
    },
    onSubmit: handleStakeSubmitAndUpdateData
  });

  useEffect(() => {
    if (prevShouldShowBakerInputRef.current !== shouldShowBakerInput) {
      formik.setFieldValue(StakingFormFields.selectedBaker, '');
      farmingItemStore.setSelectedBaker(getDummyBaker(shouldShowBakerInput));
    }
    prevShouldShowBakerInputRef.current = shouldShowBakerInput;
  }, [shouldShowBakerInput, formik, farmingItemStore]);

  const inputAmountError = getFormikError(formik, StakingFormFields.inputAmount);
  const bakerError = getFormikError(formik, StakingFormFields.selectedBaker);
  const stakingStatusError = getFormikError(formik, StakingFormFields.stakingStatus);

  const disabled =
    formik.isSubmitting || isExist(inputAmountError) || isExist(bakerError) || isExist(stakingStatusError);

  const handleInputAmountChange = (value: string) => {
    farmingItemStore.setInputAmount(prepareNumberAsString(value));
    formik.setFieldValue(StakingFormFields.inputAmount, value);
  };

  const handleBakerChange = (baker: WhitelistedBaker) => {
    farmingItemStore.setSelectedBaker(baker);
    formik.setFieldValue(StakingFormFields.selectedBaker, baker.address);
  };

  const { tradeHref, investHref } = useMemo(() => {
    if (isNull(farmingItem)) {
      return {};
    }

    const { tokenA, tokenB } = farmingItem;
    const pairSlug = isExist(tokenB) ? getTokenPairSlug(tokenA, tokenB) : getTokenPairSlug(TEZOS_TOKEN, tokenA);

    return { tradeHref: `/swap/${pairSlug}`, investHref: isExist(tokenB) ? `/liquidity/add/${pairSlug}` : null };
  }, [farmingItem]);

  return {
    bakerInputValue: formik.values[StakingFormFields.selectedBaker],
    shouldShowBakerInput,
    handleSubmit: formik.handleSubmit,
    inputAmount: formik.values[StakingFormFields.inputAmount],
    isSubmitting: formik.isSubmitting,
    userTokenBalance,
    inputAmountError,
    farmingItem,
    stakedTokenDecimals: farmingItem?.stakedToken.metadata.decimals ?? DEFAULT_DECIMALS,
    bakerError,
    stakingStatusError,
    disabled,
    tradeHref,
    investHref,
    handleInputAmountChange,
    handleBakerChange
  };
};
