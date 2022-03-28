import { useEffect, useMemo, useRef } from 'react';

import BigNumber from 'bignumber.js';
import { useFormik } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import { TFunction, useTranslation } from 'next-i18next';

import { DEFAULT_DECIMALS, DUMMY_BAKER, NO_TIMELOCK_VALUE, TEZOS_TOKEN } from '@app.config';
import { useConfirmationModal } from '@components/modals/confirmation-modal';
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
  prepareNumberAsString,
  parseTimelock
} from '@utils/helpers';
import { Optional, Undefined, WhitelistedBaker } from '@utils/types';

import { useDoStake } from '../../../../hooks/use-do-stake';
import { useGetFarmingItem } from '../../../../hooks/use-get-farming-item';
import { canDelegate } from '../../../helpers';
import { StakeFormFields, StakeFormValues } from './stake-form.interface';
import { useStakeFormValidation } from './use-stake-form.validation';

const getDummyBaker = (condition: boolean) => (condition ? null : { address: DUMMY_BAKER });

const getConfirmationMessage = (
  depositBalance: Optional<BigNumber>,
  timelock: Undefined<string>,
  withdrawalFee: Undefined<BigNumber>,
  translation: TFunction
) => {
  if (!isExist(depositBalance) || !isExist(timelock) || !isExist(withdrawalFee)) {
    return null;
  }

  const { days, hours, minutes } = parseTimelock(timelock);
  const persent = withdrawalFee.toFixed();

  if (depositBalance.isZero()) {
    return translation('farm|confirmationFirstStake', { days, hours, persent });
  } else {
    return translation('farm|confirmationUpdateStake', { days, hours, minutes });
  }
};

const useStakeConfirmationPopup = () => {
  const { openConfirmationModal } = useConfirmationModal();
  const { t } = useTranslation('farm');
  const farmingItemStore = useFarmingItemStore();
  const timelock = farmingItemStore.farmingItem?.timelock;

  if (timelock === NO_TIMELOCK_VALUE) {
    return async (callback: () => Promise<void>) => callback();
  }

  const depositBalance = farmingItemStore.farmingItem?.depositBalance;
  const withdrawalFee = farmingItemStore.farmingItem?.withdrawalFee;

  const confirmationMessage = getConfirmationMessage(depositBalance, timelock, withdrawalFee, t);

  return (callback: () => Promise<void>) => openConfirmationModal(confirmationMessage, callback);
};

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
