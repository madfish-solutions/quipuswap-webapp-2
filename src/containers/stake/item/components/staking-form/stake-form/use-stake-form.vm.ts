import { BigNumber } from 'bignumber.js';
import { useFormik } from 'formik';
import { FormikHelpers } from 'formik/dist/types';

import { StakeFormValues } from '@containers/stake/item/components/staking-form/stake-form/stake-form-values.interface';
import { useStakeFormValidation } from '@containers/stake/item/components/staking-form/stake-form/use-stake-form.validation';
import { useStakingFormStore } from '@hooks/stores/use-staking-form-store';
import { bigNumberToString } from '@utils/helpers';
import { WhitelistedBaker } from '@utils/types';

export const useStakeFormViewModel = () => {
  const stakingFormStore = useStakingFormStore();
  const { stakeItem, isLoading, isLpToken } = stakingFormStore;

  // TODO
  const userTokenBalanceBn = new BigNumber(777);
  const userTokenBalance = bigNumberToString(userTokenBalanceBn);

  const validationSchema = useStakeFormValidation(userTokenBalanceBn);

  const handleStakeSubmit = async (values: StakeFormValues, actions: FormikHelpers<StakeFormValues>) => {
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
