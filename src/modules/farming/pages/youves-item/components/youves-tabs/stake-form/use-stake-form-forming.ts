import BigNumber from 'bignumber.js';
import { useFormik } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import * as yup from 'yup';

import { defined, getFormikError, numberAsString, toAtomic } from '@shared/helpers';
import { Nullable, Optional, Token } from '@shared/types';
import { balanceAmountSchema } from '@shared/validators';

import { useDoYouvesFarmingDeposit, useFarmingYouvesItemStore } from '../../../../../hooks';
import { ConfirmationMessageParams, useYouvesStakeConfirmationPopup } from './use-stake-confirmation-popup';

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
  contractAddress: Nullable<string>,
  stakeId: BigNumber,
  lpFullToken: Nullable<Token>,
  userLpTokenBalance: Optional<BigNumber>,
  getConfirmationMessageParams: (amountToStake: BigNumber) => ConfirmationMessageParams
) => {
  const farmingYouvesItemStore = useFarmingYouvesItemStore();
  const confirmationPopup = useYouvesStakeConfirmationPopup(getConfirmationMessageParams);
  const { doDeposit } = useDoYouvesFarmingDeposit();
  const farmingItem = farmingYouvesItemStore.item;

  const handleSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    const lpTokenDecimals = defined(lpFullToken, 'LP Full Token').metadata.decimals;
    const atomicInputAmount = toAtomic(new BigNumber(values.inputAmount), lpTokenDecimals);

    confirmationPopup(async () => {
      actions.setSubmitting(true);
      await doDeposit(defined(contractAddress, 'Contract address'), stakeId, atomicInputAmount);
      actions.resetForm();
      actions.setSubmitting(false);
    }, atomicInputAmount);
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
    const { realValue } = numberAsString(value, decimals);
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
