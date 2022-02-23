import { useFormik } from 'formik';
import { FormikHelpers } from 'formik/dist/types';

import { useDoStake } from '@containers/staking/hooks/use-do-stake';
import { useStakingItemStore } from '@hooks/stores/use-staking-item-store';
import { bigNumberToString, defined, isEmptyArray } from '@utils/helpers';
import { WhitelistedBaker } from '@utils/types';

import { StakingFormValues } from './staking-form-values.interface';
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
    const tokenAddress = stakeItem?.stakedToken;
    await doStake(defined(stakeItem), balance, tokenAddress, defined(selectedBaker));

    actions.setSubmitting(false);
  };

  const formik = useFormik({
    initialValues: {
      inputAmount: '',
      selectedBaker: ''
    },
    validationSchema: validationSchema,
    onSubmit: handleStakeSubmit
  });

  // TODO
  // eslint-disable-next-line no-console
  console.log('isLpToken', isLpToken);

  const disabled = formik.isSubmitting || !isEmptyArray(Object.keys(formik.errors));
  const inputAmountError =
    formik.errors.inputAmount && formik.touched.inputAmount ? formik.errors.inputAmount : undefined;

  const bakerError =
    formik.errors.selectedBaker && formik.touched.selectedBaker ? formik.errors.selectedBaker : undefined;

  const handleInputAmountChange = (value: string) => {
    stakingItemStore.setInputAmount(value);
    formik.setFieldValue('inputAmount', value);
  };

  const handleBakerChange = (baker: WhitelistedBaker) => {
    stakingItemStore.setSelectedBaker(baker);
    formik.setFieldValue('selectedBaker', baker.address);
  };

  return {
    handleSubmit: formik.handleSubmit,
    inputAmount: formik.values.inputAmount,
    userTokenBalance,
    inputAmountError,
    stakeItem,
    bakerError,
    disabled,
    handleInputAmountChange,
    handleBakerChange
  };
};
