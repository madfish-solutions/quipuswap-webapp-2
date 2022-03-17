import { useEffect, useMemo, useRef } from 'react';

import { useFormik } from 'formik';
import { FormikHelpers } from 'formik/dist/types';

import { DEFAULT_DECIMALS, DUMMY_BAKER, TEZOS_TOKEN } from '@app.config';
import { useStakingItemStore } from '@hooks/stores/use-staking-item-store';
import { ActiveStatus } from '@interfaces/active-statuts-enum';
import { getFormikError } from '@utils/forms/get-formik-error';
import { bigNumberToString, toDecimals, defined, isNull, isExist, getTokenPairSlug } from '@utils/helpers';
import { WhitelistedBaker } from '@utils/types';

import { useDoStake } from '../../../../hooks/use-do-stake';
import { useGetStakingItem } from '../../../../hooks/use-get-staking-item';
import { canDelegate } from '../../../helpers';
import { StakingFormFields, StakingFormValues } from './staking-form.interface';
import { useStakingFormValidation } from './use-staking-form.validation';

const getDummyBaker = (condition: boolean) => (condition ? null : { address: DUMMY_BAKER });

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

  const validationSchema = useStakingFormValidation(availableBalance, shouldShowBakerInput, stakeItem?.stakeStatus);
  const isStakingAvailable = stakeItem?.stakeStatus === ActiveStatus.ACTIVE;

  const handleStakeSubmit = async (_: StakingFormValues, actions: FormikHelpers<StakingFormValues>) => {
    actions.setSubmitting(true);

    if (isStakingAvailable) {
      const token = defined(stakeItem).stakedToken;
      const inputAmountWithDecimals = toDecimals(inputAmount, token);
      await doStake(defined(stakeItem), inputAmountWithDecimals, token, defined(selectedBaker));
    }

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
      stakingItemStore.setSelectedBaker(getDummyBaker(shouldShowBakerInput));
    }
    prevShouldShowBakerInputRef.current = shouldShowBakerInput;
  }, [shouldShowBakerInput, formik, stakingItemStore]);

  const inputAmountError = getFormikError(formik, StakingFormFields.inputAmount);
  const bakerError = getFormikError(formik, StakingFormFields.selectedBaker);
  const stakingStatusError = getFormikError(formik, StakingFormFields.stakingStatus);

  const disabled =
    formik.isSubmitting || isExist(inputAmountError) || isExist(bakerError) || isExist(stakingStatusError);

  const handleInputAmountChange = (value: string) => {
    stakingItemStore.setInputAmount(value);
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
    bakerInputValue: formik.values[StakingFormFields.selectedBaker],
    shouldShowBakerInput,
    handleSubmit: formik.handleSubmit,
    inputAmount: formik.values[StakingFormFields.inputAmount],
    userTokenBalance,
    inputAmountError,
    stakeItem,
    stakedTokenDecimals: stakeItem?.stakedToken.metadata.decimals ?? DEFAULT_DECIMALS,
    bakerError,
    stakingStatusError,
    disabled,
    tradeHref,
    investHref,
    handleInputAmountChange,
    handleBakerChange
  };
};
