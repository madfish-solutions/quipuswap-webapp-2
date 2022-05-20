import { useEffect } from 'react';

import { BigNumber } from 'bignumber.js';
import { FormikHelpers, useFormik } from 'formik';

import { hasFormikError, isNull } from '@shared/helpers';

import { getFormikInitialValues } from '../../../../../../helpers';
import { useStableswapItemFormStore, useStableswapItemStore } from '../../../../../../hooks';
import { useAddLiqFormValidation } from './use-add-liq-form-validation';

const DEFAULT_LENGTH = 0;
const BALANCE = '100000';
const BALANCE_BN = new BigNumber(BALANCE);

interface AddLiqFormValues {
  [key: string]: string;
}

export const useAddLiqFormViewModel = () => {
  const stableswapItemStore = useStableswapItemStore();
  const stableswapItemFormStore = useStableswapItemFormStore();
  const item = stableswapItemStore.item;

  const validationSchema = useAddLiqFormValidation(Array(item?.tokensInfo.length ?? DEFAULT_LENGTH).fill(BALANCE_BN));

  const handleSubmit = async (_: AddLiqFormValues, actions: FormikHelpers<AddLiqFormValues>) => {
    actions.setSubmitting(true);

    formik.resetForm();
    actions.setSubmitting(false);
  };

  const formik = useFormik({
    validationSchema,
    initialValues: getFormikInitialValues(item?.tokensInfo.length ?? DEFAULT_LENGTH),
    onSubmit: handleSubmit
  });

  useEffect(() => {
    return () => stableswapItemFormStore.clearStore();
  }, [stableswapItemFormStore]);

  if (isNull(item)) {
    return null;
  }

  const { tokensInfo } = item;

  const isSubmitting = formik.isSubmitting;
  const disabled = isSubmitting || hasFormikError(formik.errors);

  const data = tokensInfo.map((_, index) => {
    return {
      index,
      formik,
      balance: BALANCE
    };
  });

  return {
    data,
    disabled,
    isSubmitting,
    handleSubmit: formik.handleSubmit
  };
};
