import { useFormik } from 'formik';
import { FormikHelpers } from 'formik/dist/types';

import { useStakingItemStore } from '@hooks/stores/use-staking-item-store';
import { bigNumberToString, defined, isEmptyArray } from '@utils/helpers';
import { WhitelistedBaker } from '@utils/types';

import { useDoStake } from '../../../../hooks/use-do-stake';
import { StakingFormFields, StakingFormValues } from './staking-form.interface';
import { useStakingFormValidation } from './use-staking-form.validation';

export const useStakingFormViewModel = () => {
  const stakingItemStore = useStakingItemStore();
  const { doStake } = useDoStake();
  const { itemStore, isLpToken, availableBalanceStore, inputAmount, selectedBaker } = stakingItemStore;
  const { data: stakeItem } = itemStore;
  const { data: availableBalance } = availableBalanceStore;

  const userTokenBalance = availableBalance ? bigNumberToString(availableBalance) : null;

  const validationSchema = useStakingFormValidation(availableBalance);

  const handleStakeSubmit = async (values: StakingFormValues, actions: FormikHelpers<StakingFormValues>) => {
    actions.setSubmitting(true);
    // @ts-ignore
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
    stakingItemStore.setSelectedBaker(baker);
    formik.setFieldValue(StakingFormFields.selectedBaker, baker.address);
  };

  return {
    handleSubmit: formik.handleSubmit,
    inputAmount: formik.values[StakingFormFields.inputAmount],
    userTokenBalance,
    inputAmountError,
    stakeItem,
    bakerError,
    disabled,
    handleInputAmountChange,
    handleBakerChange
  };
};
