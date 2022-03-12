import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useFormik } from 'formik';
import { FormikHelpers } from 'formik/dist/types';

import { DUMMY_BAKER, TEZOS_TOKEN } from '@app.config';
import { useStakingItemStore } from '@hooks/stores/use-staking-item-store';
import { getFormikError } from '@utils/forms/get-formik-error';
import { bigNumberToString, defined, getTokenPairSlug, isExist, isNull, toDecimals } from '@utils/helpers';
import { WhitelistedBaker } from '@utils/types';

import { useDoStake } from '../../../../hooks/use-do-stake';
import { canDelegate } from '../../../helpers';
import { StakingFormFields, StakingFormValues } from './staking-form.interface';
import { useStakingFormValidation } from './use-staking-form.validation';

const EMPTY_AMOUNT = '';
const EMPTY_SELECTED_BAKER = '';

export const useStakingFormViewModel = () => {
  const stakingItemStore = useStakingItemStore();
  const { doStake } = useDoStake();
  const { itemStore, inputAmount, selectedBaker, availableBalanceStore } = stakingItemStore;
  const { data: stakeItem } = itemStore;
  const { data: availableBalance } = availableBalanceStore;

  const userTokenBalance = availableBalance ? bigNumberToString(availableBalance) : null;

  const shouldShowBakerInput = isNull(stakeItem) || canDelegate(stakeItem);
  const prevShouldShowBakerInputRef = useRef(true);

  const validationSchema = useStakingFormValidation(availableBalance, shouldShowBakerInput);

  const handleStakeSubmit = async (_values: StakingFormValues, actions: FormikHelpers<StakingFormValues>) => {
    actions.setSubmitting(true);
    const token = defined(stakeItem).stakedToken;
    const inputAmountWithDecimals = toDecimals(inputAmount, token);
    await doStake(defined(stakeItem), inputAmountWithDecimals, token, defined(selectedBaker));

    cleanForm();
    actions.setSubmitting(false);
  };

  const formik = useFormik({
    initialValues: {
      [StakingFormFields.inputAmount]: EMPTY_AMOUNT,
      [StakingFormFields.selectedBaker]: EMPTY_SELECTED_BAKER
    },
    validationSchema: validationSchema,
    onSubmit: handleStakeSubmit
  });

  const setEmptyBaker = useCallback(() => {
    formik.setFieldValue(StakingFormFields.selectedBaker, EMPTY_SELECTED_BAKER);
    stakingItemStore.setSelectedBaker(shouldShowBakerInput ? null : { address: DUMMY_BAKER });
  }, [shouldShowBakerInput, formik, stakingItemStore]);

  useEffect(() => {
    if (prevShouldShowBakerInputRef.current !== shouldShowBakerInput) {
      setEmptyBaker();
    }
    prevShouldShowBakerInputRef.current = shouldShowBakerInput;
  }, [setEmptyBaker, shouldShowBakerInput]);

  const inputAmountError = getFormikError(formik, StakingFormFields.inputAmount);
  const bakerError = getFormikError(formik, StakingFormFields.selectedBaker);

  const disabled = formik.isSubmitting || isExist(inputAmountError) || isExist(bakerError);

  const handleInputAmountChange = (value: string) => {
    stakingItemStore.setInputAmount(value);
    formik.setFieldValue(StakingFormFields.inputAmount, value);
  };

  const handleBakerChange = (baker: WhitelistedBaker) => {
    stakingItemStore.setSelectedBaker(baker);
    formik.setFieldValue(StakingFormFields.selectedBaker, baker.address);
  };

  const cleanForm = () => {
    handleInputAmountChange(EMPTY_AMOUNT);
    shouldShowBakerInput && setEmptyBaker();
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
