import { useEffect, useMemo, useRef } from 'react';

import { useFormik } from 'formik';
import { FormikHelpers } from 'formik/dist/types';

import { DUMMY_BAKER } from '@config/bakers';
import { DEFAULT_DECIMALS } from '@config/constants';
import { TEZOS_TOKEN } from '@config/tokens';
import { useFarmingItemStore } from '@modules/farming/hooks';
import { useDoStake } from '@modules/farming/hooks/blockchain/use-do-stake';
import { useGetFarmingItem } from '@modules/farming/hooks/loaders/use-get-farming-item';
import {
  bigNumberToString,
  toDecimals,
  defined,
  isNull,
  isExist,
  getFormikError,
  getTokenPairSlug,
  prepareNumberAsString
} from '@shared/helpers';
import { ActiveStatus, WhitelistedBaker } from '@shared/types';

import { canDelegate } from '../../../helpers';
import { StakeFormFields, StakeFormValues } from './stake-form.interface';
import { useStakeConfirmationPopup } from './use-stake-confirmation-popup';
import { useStakeFormValidation } from './use-stake-form.validation';

const getDummyBaker = (condition: boolean) => (condition ? null : { address: DUMMY_BAKER });

export const useStakeFormViewModel = () => {
  const confirmationPopup = useStakeConfirmationPopup();
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
      // TODO: Move to model
      const inputAmountWithDecimals = toDecimals(inputAmount, token);
      await doStake(defined(farmingItem), inputAmountWithDecimals, token, defined(selectedBaker));
    }

    formik.resetForm();
    actions.setSubmitting(false);
  };

  const handleStakeSubmitAndUpdateData = async (values: StakeFormValues, actions: FormikHelpers<StakeFormValues>) => {
    confirmationPopup(async () => {
      await handleStakeSubmit(values, actions);

      await delayedGetFarmingItem(defined(farmingItem).id);
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
