import { useEffect, useMemo, useRef } from 'react';

import { useFormik } from 'formik';
import { FormikHelpers } from 'formik/dist/types';

import { FALLBACK_BAKER, TEZOS_TOKEN } from '@app.config';
import { useLoadTokenBalance } from '@containers/liquidity/liquidity-cards/hooks';
import { useStakingItemStore } from '@hooks/stores/use-staking-item-store';
import { bigNumberToString, defined, isEmptyArray, isNull, isExist, getTokenPairSlug } from '@utils/helpers';
import { WhitelistedBaker } from '@utils/types';

import { useDoStake } from '../../../../hooks/use-do-stake';
import { canDelegate } from '../../../helpers';
import { StakingFormFields, StakingFormValues } from './staking-form.interface';
import { useStakingFormValidation } from './use-staking-form.validation';

// eslint-disable-next-line sonarjs/cognitive-complexity
export const useStakingFormViewModel = () => {
  const stakingItemStore = useStakingItemStore();
  const { doStake } = useDoStake();
  const { itemStore, isLpToken, inputAmount, selectedBaker, setSelectedBaker } = stakingItemStore;
  const { data: stakeItem } = itemStore;
  const { tokenBalance } = useLoadTokenBalance(stakeItem?.stakedToken ?? null);

  const userTokenBalance = tokenBalance ? bigNumberToString(tokenBalance) : null;

  const shouldShowBakerInput = isNull(stakeItem) || canDelegate(stakeItem);
  const prevShouldShowBakerInputRef = useRef(true);

  const validationSchema = useStakingFormValidation(tokenBalance, shouldShowBakerInput);

  const handleStakeSubmit = async (_values: StakingFormValues, actions: FormikHelpers<StakingFormValues>) => {
    actions.setSubmitting(true);
    const token = defined(stakeItem).stakedToken;
    await doStake(defined(stakeItem), inputAmount, token, defined(selectedBaker));
    actions.setSubmitting(false);
  };

  const formik = useFormik({
    initialValues: {
      [StakingFormFields.inputAmount]: '',
      [StakingFormFields.selectedBaker]: ''
    },
    validationSchema: validationSchema,
    onSubmit: handleStakeSubmit
  });

  useEffect(() => {
    if (prevShouldShowBakerInputRef.current !== shouldShowBakerInput) {
      formik.setFieldValue(StakingFormFields.selectedBaker, '');
      setSelectedBaker(shouldShowBakerInput ? null : { address: FALLBACK_BAKER });
    }
    prevShouldShowBakerInputRef.current = shouldShowBakerInput;
  }, [shouldShowBakerInput, formik, setSelectedBaker]);

  // TODO
  // eslint-disable-next-line no-console
  console.log('isLpToken', isLpToken);

  const disabled = formik.isSubmitting || !isEmptyArray(Object.keys(formik.errors));
  const inputAmountError =
    formik.errors[StakingFormFields.inputAmount] && formik.touched[StakingFormFields.inputAmount]
      ? formik.errors[StakingFormFields.inputAmount]
      : undefined;

  const bakerError =
    formik.errors[StakingFormFields.selectedBaker] && formik.touched[StakingFormFields.selectedBaker]
      ? formik.errors[StakingFormFields.selectedBaker]
      : undefined;

  const handleInputAmountChange = (value: string) => {
    stakingItemStore.setInputAmount(value);
    formik.setFieldValue(StakingFormFields.inputAmount, value);
  };

  const handleBakerChange = (baker: WhitelistedBaker) => {
    setSelectedBaker(baker);
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
