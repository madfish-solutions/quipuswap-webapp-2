import { useEffect, useMemo, useRef } from 'react';

import { useFormik } from 'formik';
import { FormikHelpers } from 'formik/dist/types';

import { DUMMY_BAKER, TEZOS_TOKEN } from '@app.config';
import { useStakingItemStore } from '@hooks/stores/use-staking-item-store';
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
import { useGetStakingItem } from '../../../../hooks/use-get-staking-item';
import { canDelegate } from '../../../helpers';
import { StakingFormFields, StakingFormValues } from './staking-form.interface';
import { useStakingFormValidation } from './use-staking-form.validation';

export const useStakingFormViewModel = () => {
  const stakingItemStore = useStakingItemStore();
  const { delayedGetStakingItem } = useGetStakingItem();
  const { doStake } = useDoStake();
  const { itemStore, inputAmount, selectedBaker, availableBalanceStore } = stakingItemStore;
  const { data: stakeItem } = itemStore;
  const { data: availableBalance } = availableBalanceStore;

  const userTokenBalance = availableBalance ? bigNumberToString(availableBalance) : null;

  const shouldShowBakerInput = isNull(stakeItem) || canDelegate(stakeItem);
  const prevShouldShowBakerInputRef = useRef(true);

  const validationSchema = useStakingFormValidation(availableBalance, shouldShowBakerInput);

  const handleStakeSubmit = async (_: StakingFormValues, actions: FormikHelpers<StakingFormValues>) => {
    actions.setSubmitting(true);
    const token = defined(stakeItem).stakedToken;
    const inputAmountWithDecimals = toDecimals(inputAmount, token);
    await doStake(defined(stakeItem), inputAmountWithDecimals, token, defined(selectedBaker));

    formik.resetForm();
    actions.setSubmitting(false);
  };

  const handleStakeSubmitAndUpdateData = async (
    values: StakingFormValues,
    actions: FormikHelpers<StakingFormValues>
  ) => {
    await handleStakeSubmit(values, actions);

    await delayedGetStakingItem(defined(stakeItem).id);
  };

  const formik = useFormik({
    initialValues: {
      [StakingFormFields.inputAmount]: '',
      [StakingFormFields.selectedBaker]: ''
    },
    validationSchema: validationSchema,
    onSubmit: handleStakeSubmitAndUpdateData
  });

  useEffect(() => {
    if (prevShouldShowBakerInputRef.current !== shouldShowBakerInput) {
      formik.setFieldValue(StakingFormFields.selectedBaker, '');
      stakingItemStore.setSelectedBaker(shouldShowBakerInput ? null : { address: DUMMY_BAKER });
    }
    prevShouldShowBakerInputRef.current = shouldShowBakerInput;
  }, [shouldShowBakerInput, formik, stakingItemStore]);

  const inputAmountError = getFormikError(formik, StakingFormFields.inputAmount);
  const bakerError = getFormikError(formik, StakingFormFields.selectedBaker);

  const disabled = formik.isSubmitting || isExist(inputAmountError) || isExist(bakerError);

  const handleInputAmountChange = (value: string) => {
    stakingItemStore.setInputAmount(prepareNumberAsString(value));
    formik.setFieldValue(StakingFormFields.inputAmount, value);
  };

  const handleBakerChange = (baker: WhitelistedBaker) => {
    stakingItemStore.setSelectedBaker(baker);
    formik.setFieldValue(StakingFormFields.selectedBaker, baker.address);
  };

  const { tradeHref, investHref } = useMemo(() => {
    if (isNull(stakeItem)) {
      return {};
    }

    const { tokenA, tokenB } = stakeItem;
    const pairSlug = isExist(tokenB) ? getTokenPairSlug(tokenA, tokenB) : getTokenPairSlug(TEZOS_TOKEN, tokenA);

    return { tradeHref: `/swap/${pairSlug}`, investHref: isExist(tokenB) ? `/liquidity/add/${pairSlug}` : null };
  }, [stakeItem]);

  return {
    shouldShowBakerInput,
    handleSubmit: formik.handleSubmit,
    inputAmount: formik.values[StakingFormFields.inputAmount],
    userTokenBalance,
    inputAmountError,
    stakeItem,
    bakerError,
    disabled,
    tradeHref,
    investHref,
    handleInputAmountChange,
    handleBakerChange
  };
};
