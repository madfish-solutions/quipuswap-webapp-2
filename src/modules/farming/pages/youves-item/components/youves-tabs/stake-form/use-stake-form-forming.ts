import BigNumber from 'bignumber.js';
import { useFormik } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import * as yup from 'yup';

import { defined, getFormikError, toAtomic } from '@shared/helpers';
import { Optional, Token } from '@shared/types';
import { balanceAmountSchema } from '@shared/validators';

import { useDoYouvesFarmingDeposit } from '../../../../../hooks';
import { StakeFormFields } from '../../../../item/components/farming-tabs/stake-form/stake-form.interface';

enum FormFields {
  inputAmount = 'inputAmount'
}

interface FormValues {
  [FormFields.inputAmount]: string;
}

const getValidationSchema = (userBalance: Optional<BigNumber>) =>
  yup.object().shape({
    [StakeFormFields.inputAmount]: balanceAmountSchema(userBalance).required('Value is required')
  });

export const useStakeFormForming = (
  contractAddress: string,
  lpFullToken: Nullable<Token>,
  userLpTokenBalance: Optional<BigNumber>
) => {
  const { doDeposit } = useDoYouvesFarmingDeposit();

  const handleSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    actions.setSubmitting(true);
    await doDeposit(
      contractAddress,
      0,
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

  const inputAmountChange = async (value: string) => await formik.setFieldValue(FormFields.inputAmount, value);

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
