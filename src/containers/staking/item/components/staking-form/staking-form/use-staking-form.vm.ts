import { useFormik } from 'formik';
import { FormikHelpers } from 'formik/dist/types';

import { StakingFormValues } from '@containers/staking/item/components/staking-form/staking-form/staking-form-values.interface';
import { useStakingFormValidation } from '@containers/staking/item/components/staking-form/staking-form/use-staking-form.validation';
import { useStakingItemStore } from '@hooks/stores/use-staking-item-store';
import { bigNumberToString, isEmptyArray } from '@utils/helpers';
import { WhitelistedBaker } from '@utils/types';

export const useStakingFormViewModel = () => {
  const stakingItemStore = useStakingItemStore();
  const { stakeItem, isLoading, isLpToken, availableBalance } = stakingItemStore;

  const userTokenBalance = availableBalance ? bigNumberToString(availableBalance) : null;

  const validationSchema = useStakingFormValidation(availableBalance);

  const handleStakeSubmit = async (values: StakingFormValues, actions: FormikHelpers<StakingFormValues>) => {
    await stakingItemStore.stake();
    actions.setSubmitting(false);
  };

  const formik = useFormik({
    initialValues: {
      balance: '',
      selectedBaker: ''
    },
    validationSchema: validationSchema,
    onSubmit: handleStakeSubmit
  });

  // TODO
  // eslint-disable-next-line no-console
  console.log('isLpToken', isLpToken, formik.errors, formik.touched);

  const disabled = isLoading || formik.isSubmitting || !isEmptyArray(Object.keys(formik.errors));
  const balanceError = formik.errors.balance && formik.touched.balance ? formik.errors.balance : undefined;

  const bakerError =
    formik.errors.selectedBaker && formik.touched.selectedBaker ? formik.errors.selectedBaker : undefined;

  const handleBalanceChange = (value: string) => {
    stakingItemStore.setBalance(value);
    formik.setFieldValue('balance', value);
  };

  const handleBakerChange = (baker: WhitelistedBaker) => {
    stakingItemStore.setSelectedBaker(baker);
    formik.setFieldValue('selectedBaker', baker.address);
  };

  return {
    formik,
    userTokenBalance,
    balanceError,
    stakeItem,
    bakerError,
    disabled,
    handleBalanceChange,
    handleBakerChange
  };
};
