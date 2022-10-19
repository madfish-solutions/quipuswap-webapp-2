import BigNumber from 'bignumber.js';
import { useFormik } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import * as yup from 'yup';

import { defined, getFormikError, numberAsString, toAtomic } from '@shared/helpers';
import { Optional, Token } from '@shared/types';
import { balanceAmountSchema } from '@shared/validators';

import { useDoYouvesFarmingDeposit, useFarmingYouvesItemStore } from '../../../../../hooks';

enum FormFields {
  inputAmount = 'inputAmount'
}

interface FormValues {
  [FormFields.inputAmount]: string;
}

const getValidationSchema = (userBalance: Optional<BigNumber>) =>
  yup.object().shape({
    [FormFields.inputAmount]: balanceAmountSchema(userBalance).required('Value is required')
  });

export const useStakeFormForming = (
  contractAddress: string,
  stakeId: BigNumber,
  lpFullToken: Nullable<Token>,
  userLpTokenBalance: Optional<BigNumber>
) => {
  const farmingYouvesItemStore = useFarmingYouvesItemStore();
  const { doDeposit } = useDoYouvesFarmingDeposit();
  const farmingItem = farmingYouvesItemStore.item;

  const handleSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    actions.setSubmitting(true);
    await doDeposit(
      contractAddress,
      stakeId,
      toAtomic(new BigNumber(values.inputAmount), defined(lpFullToken, 'LP Full Token').metadata.decimals)
    );
    actions.resetForm();
    actions.setSubmitting(false);
  };

  const formik = useFormik({
    validationSchema: getValidationSchema(userLpTokenBalance),
    initialValues: {
      [FormFields.inputAmount]: ''
    },
    onSubmit: handleSubmit
  });

  const inputAmountChange = async (value: string) => {
    const decimals = defined(farmingItem).stakedToken.metadata.decimals;
    const { fixedValue, realValue } = numberAsString(value, decimals);
    farmingYouvesItemStore.setInputAmount(fixedValue);
    await formik.setFieldValue(FormFields.inputAmount, realValue);
  };

  const disabled = formik.isSubmitting;

  return {
    handleSubmit: formik.handleSubmit,
    inputAmount: formik.values[FormFields.inputAmount],
    inputAmountError: getFormikError(formik, FormFields.inputAmount),
    handleInputAmountChange: inputAmountChange,
    isSubmitting: formik.isSubmitting,
    disabled
  };
};
