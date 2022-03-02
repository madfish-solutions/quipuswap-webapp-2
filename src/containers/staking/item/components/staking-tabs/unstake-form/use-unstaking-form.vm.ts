import { useFormik } from 'formik';
import { FormikHelpers } from 'formik/dist/types';

import { useStakingItemStore } from '@hooks/stores/use-staking-item-store';
import { bigNumberToString, defined, fromDecimals, isEmptyArray } from '@utils/helpers';

import { useDoUnstake } from '../../../../hooks/use-do-unstake';
import { UnstakingFormFields, UnstakingFormValues } from './unstaking-form.interface';
import { useUnstakingFormValidation } from './use-unstaking-form.validation';

export const useUnstakingFormViewModel = () => {
  const stakingItemStore = useStakingItemStore();
  const { doUnstake } = useDoUnstake();
  const { itemStore, isLpToken, userStakingStatsStore, inputAmount } = stakingItemStore;
  const { data: stakeItem } = itemStore;
  const { data: stakingStats } = userStakingStatsStore;
  const rawAvailableBalance = stakingStats?.staked ?? null;
  const availableBalance = rawAvailableBalance ? fromDecimals(rawAvailableBalance, stakeItem?.stakedToken ?? 0) : null;

  const userTokenBalance = availableBalance ? bigNumberToString(availableBalance) : null;

  const validationSchema = useUnstakingFormValidation(availableBalance);

  const handleStakeSubmit = async (values: UnstakingFormValues, actions: FormikHelpers<UnstakingFormValues>) => {
    actions.setSubmitting(true);
    await doUnstake(defined(stakeItem), inputAmount);
    actions.setSubmitting(false);
  };

  const formik = useFormik({
    initialValues: {
      [UnstakingFormFields.inputAmount]: ''
    },
    validationSchema: validationSchema,
    onSubmit: handleStakeSubmit
  });

  // TODO
  // eslint-disable-next-line no-console
  console.log('isLpToken', isLpToken);

  const disabled = formik.isSubmitting || !isEmptyArray(Object.keys(formik.errors));
  const inputAmountError =
    formik.errors[UnstakingFormFields.inputAmount] && formik.touched[UnstakingFormFields.inputAmount]
      ? formik.errors[UnstakingFormFields.inputAmount]
      : undefined;

  const handleInputAmountChange = (value: string) => {
    stakingItemStore.setInputAmount(value);
    formik.setFieldValue(UnstakingFormFields.inputAmount, value);
  };

  return {
    handleSubmit: formik.handleSubmit,
    inputAmount: formik.values[UnstakingFormFields.inputAmount],
    userTokenBalance,
    inputAmountError,
    stakeItem,
    disabled,
    handleInputAmountChange
  };
};
