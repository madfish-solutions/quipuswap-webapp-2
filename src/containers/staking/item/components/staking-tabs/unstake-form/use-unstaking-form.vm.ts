import { useFormik } from 'formik';
import { FormikHelpers } from 'formik/dist/types';

import { useStakingItemStore } from '@hooks/stores/use-staking-item-store';
import { bigNumberToString, defined, isEmptyArray } from '@utils/helpers';

import { useDoUnstake } from '../../../../hooks/use-do-unstake';
import { UnstakingFormValues } from './unstaking-form-values.interface';
import { useUnstakingFormValidation } from './use-unstaking-form.validation';

export const useUnstakingFormViewModel = () => {
  const stakingItemStore = useStakingItemStore();
  const { doUnstake } = useDoUnstake();
  const { itemStore, isLpToken, availableBalanceStore, inputAmount } = stakingItemStore;
  const { data: stakeItem } = itemStore;
  const { data: availableBalance } = availableBalanceStore;

  const userTokenBalance = availableBalance ? bigNumberToString(availableBalance) : null;

  const validationSchema = useUnstakingFormValidation(availableBalance);

  const handleStakeSubmit = async (values: UnstakingFormValues, actions: FormikHelpers<UnstakingFormValues>) => {
    actions.setSubmitting(true);
    await doUnstake(defined(stakeItem), inputAmount);
    actions.setSubmitting(false);
  };

  const formik = useFormik({
    initialValues: {
      inputAmount: ''
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

  const handleInputAmountChange = (value: string) => {
    stakingItemStore.setInputAmount(value);
    formik.setFieldValue('inputAmount', value);
  };

  return {
    handleSubmit: formik.handleSubmit,
    inputAmount: formik.values.inputAmount,
    userTokenBalance,
    inputAmountError,
    stakeItem,
    disabled,
    handleInputAmountChange
  };
};
