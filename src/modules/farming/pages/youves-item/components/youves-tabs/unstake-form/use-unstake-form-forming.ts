import BigNumber from 'bignumber.js';
import { useFormik } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import { noop } from 'rxjs';
import * as yup from 'yup';

import { defined, getFormikError } from '@shared/helpers';

import { useDoYouvesFarmingWithdraw } from '../../../../../hooks';

enum FormFields {
  inputAmount = 'inputAmount'
}

interface FormValues {
  [FormFields.inputAmount]: string;
}

const getValidationSchema = () => yup.object().shape({});

export const useUnstakeFormForming = (
  contractAddress: Nullable<string>,
  stakeId: BigNumber,
  balance: Nullable<BigNumber>
) => {
  const { doWithdraw } = useDoYouvesFarmingWithdraw();

  const handleSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    actions.setSubmitting(true);
    await doWithdraw(defined(contractAddress, 'Contract address'), stakeId, defined(balance, 'Balance'));
    actions.resetForm();
    actions.setSubmitting(false);
  };

  const formik = useFormik({
    validationSchema: getValidationSchema(),
    initialValues: {
      [FormFields.inputAmount]: ''
    },
    onSubmit: handleSubmit
  });

  const inputAmountChange = noop;

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
