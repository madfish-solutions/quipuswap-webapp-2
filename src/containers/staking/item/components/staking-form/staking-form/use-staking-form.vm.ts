import { useFormik } from 'formik';
import { FormikHelpers } from 'formik/dist/types';

import { StakingFormValues } from '@containers/staking/item/components/staking-form/staking-form/staking-form-values.interface';
import { useStakingFormValidation } from '@containers/staking/item/components/staking-form/staking-form/use-staking-form.validation';
import { useStakingFormStore } from '@hooks/stores/use-staking-form-store';
import { bigNumberToString } from '@utils/helpers';
import { WhitelistedBaker } from '@utils/types';

export const useStakingFormViewModel = () => {
  const stakingFormStore = useStakingFormStore();
  const { stakeItem, isLoading, isLpToken, availableBalance } = stakingFormStore;

  const userTokenBalance = availableBalance ? bigNumberToString(availableBalance) : null;

  const validationSchema = useStakingFormValidation(availableBalance);

  const handleStakeSubmit = async (values: StakingFormValues, actions: FormikHelpers<StakingFormValues>) => {
    await stakingFormStore.stake();
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
  console.log('isLpToken', isLpToken);

  const disabled = isLoading || formik.isSubmitting;
  const balanceError = formik.errors.balance && formik.touched.balance ? formik.errors.balance : undefined;

  const bakerError =
    formik.errors.selectedBaker && formik.touched.selectedBaker ? formik.errors.selectedBaker : undefined;

  const handleBalanceChange = (value: string) => {
    stakingFormStore.setBalance(value);
    formik.setFieldValue('balance', value);
  };

  const handleBakerChange = (baker: WhitelistedBaker) => {
    stakingFormStore.setSelectedBaker(baker);
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
