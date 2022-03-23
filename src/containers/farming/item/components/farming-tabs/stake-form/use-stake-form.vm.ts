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
import { StakeFormFields, StakeFormValues } from './stake-form.interface';
import { useStakeFormValidation } from './use-stake-form.validation';

const getDummyBaker = (condition: boolean) => (condition ? null : { address: DUMMY_BAKER });

export const useStakeFormViewModel = () => {
  const farmingItemStore = useFarmingItemStore();
  const { delayedGetFarmingItem } = useGetFarmingItem();
  const { doStake } = useDoStake();
  const { itemStore, inputAmount, selectedBaker, availableBalanceStore } = farmingItemStore;
  const { data: farmingItem } = itemStore;
  const { data: availableBalance } = availableBalanceStore;

  const userTokenBalance = availableBalance ? bigNumberToString(availableBalance) : null;

  const shouldShowBakerInput = isNull(farmingItem) || canDelegate(farmingItem);
  const prevShouldShowBakerInputRef = useRef(true);

  const validationSchema = useStakeFormValidation(availableBalance, shouldShowBakerInput, farmingItem?.stakeStatus);
  const isStakingAvailable = farmingItem?.stakeStatus === ActiveStatus.ACTIVE;

  const handleStakeSubmit = async (_: StakeFormValues, actions: FormikHelpers<StakeFormValues>) => {
    actions.setSubmitting(true);

    if (isStakingAvailable) {
      const token = defined(farmingItem).stakedToken;
      const inputAmountWithDecimals = toDecimals(inputAmount, token);
      await doStake(defined(farmingItem), inputAmountWithDecimals, token, defined(selectedBaker));
    }

    formik.resetForm();
    actions.setSubmitting(false);
  };

  const handleStakeSubmitAndUpdateData = async (values: StakeFormValues, actions: FormikHelpers<StakeFormValues>) => {
    await handleStakeSubmit(values, actions);

    await delayedGetFarmingItem(defined(farmingItem).id);
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

  const disabled =
    formik.isSubmitting || isExist(inputAmountError) || isExist(bakerError) || isExist(farmStatusError);

  const handleInputAmountChange = (value: string) => {
    farmingItemStore.setInputAmount(prepareNumberAsString(value));
    formik.setFieldValue(StakeFormFields.inputAmount, value);
  };

  const handleBakerChange = (baker: WhitelistedBaker) => {
    farmingItemStore.setSelectedBaker(baker);
    formik.setFieldValue(StakeFormFields.selectedBaker, baker.address);
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
    tradeHref,
    investHref,
    handleInputAmountChange,
    handleBakerChange
  };
};
