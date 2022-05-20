import { useEffect } from 'react';

import { BigNumber } from 'bignumber.js';
import { FormikHelpers, useFormik } from 'formik';

import { isNull } from '@shared/helpers';

import { getFormikInitialValuesRemoveForm } from '../../../../../../helpers';
import { useStableswapItemFormStore, useStableswapItemStore } from '../../../../../../hooks';
import { useRemoveLiqFormValidation } from './use-remove-liq-form-validation';

const DEFAULT_LENGTH = 0;

export interface RemoveLiqFormValues {
  [key: string]: string;
}

// MOCKED BALANCES
const BALANCE = '1000';
const LP_BALANCE = '1000';
const BALANCE_BN = new BigNumber(BALANCE);
const LP_BALANCE_BN = new BigNumber(LP_BALANCE);

export const useRemoveLiqFormViewModel = () => {
  const stableswapItemStore = useStableswapItemStore();
  const stableswapItemFormStore = useStableswapItemFormStore();
  const item = stableswapItemStore.item;

  //#region mock data
  //TODO: remove mockdata implement real one
  const disabled = false;
  const isSubmitting = false;
  //#endregion mock data

  const inputsCount = (item && item.tokensInfo.length) ?? DEFAULT_LENGTH;
  const userBalances = Array(inputsCount ?? DEFAULT_LENGTH).fill(BALANCE_BN);

  const validationSchema = useRemoveLiqFormValidation(LP_BALANCE_BN, userBalances);

  const handleSubmit = async (_: RemoveLiqFormValues, actions: FormikHelpers<RemoveLiqFormValues>) => {
    actions.setSubmitting(true);

    formik.resetForm();
    actions.setSubmitting(false);
  };

  const formik = useFormik({
    validationSchema,
    initialValues: getFormikInitialValuesRemoveForm(inputsCount),
    onSubmit: handleSubmit
  });

  useEffect(() => {
    return () => stableswapItemFormStore.clearStore();
  }, [stableswapItemFormStore]);

  if (isNull(item)) {
    return null;
  }

  const { tokensInfo } = item;

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
    formik,
    lpBalance: LP_BALANCE,
    handleSubmit: formik.handleSubmit
  };
};
