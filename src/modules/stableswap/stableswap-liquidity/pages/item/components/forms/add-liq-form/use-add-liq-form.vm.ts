import { useEffect } from 'react';

import { BigNumber } from 'bignumber.js';
import { FormikHelpers, useFormik } from 'formik';

import { useAccountPkh } from '@providers/use-dapp';
import { isNull } from '@shared/helpers';
import { useTranslation } from '@translation';

import {
  calculateTokensInputs,
  getFormikInitialValues,
  getInputSlugByIndex,
  prepareFormikValue,
  prepareInputAmountAsBN
} from '../../../../../../helpers';
import { useStableswapItemFormStore, useStableswapItemStore } from '../../../../../../hooks';
import { useAddLiqFormValidation } from './use-add-liq-form-validation';

const DEFAULT_LENGTH = 0;

interface AddLiqFormValues {
  [key: string]: string;
}

export const useAddLiqFormViewModel = () => {
  const accountPkh = useAccountPkh();
  const { t } = useTranslation();

  const stableswapItemStore = useStableswapItemStore();
  const stableswapItemFormStore = useStableswapItemFormStore();
  const item = stableswapItemStore.item;

  //#region mock data
  //TODO: remove mockdata implement real one
  const label = t('common|Input');
  const disabled = false;
  const isSubmitting = false;
  const balance = '100000';
  //#endregion mock data

  const shouldShowBalanceButtons = !isNull(accountPkh);

  const validationSchema = useAddLiqFormValidation(
    Array(item?.tokensInfo.length ?? DEFAULT_LENGTH).fill(new BigNumber(balance))
  );

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
    return {
      data: [],
      disabled,
      isSubmitting,
      handleSubmit: formik.handleSubmit
    };
  }

  const { tokensInfo, totalLpSupply } = item;

  const data = tokensInfo.map(({ token, exchangeRate, reserves: currentReserve }, indexOfCurrentInput) => {
    const decimals = token.metadata.decimals;
    const currentInputSlug = getInputSlugByIndex(indexOfCurrentInput);

    const handleInputChange = (inputAmount: string) => {
      const inputAmountBN = prepareInputAmountAsBN(inputAmount);
      const formikValues = getFormikInitialValues(tokensInfo.length);

      tokensInfo.forEach(({ reserves: calculatedtReserve }, indexOfCalculatedInput) => {
        if (indexOfCurrentInput !== indexOfCalculatedInput) {
          const amount = calculateTokensInputs(inputAmountBN, currentReserve, totalLpSupply, calculatedtReserve);

          formikValues[getInputSlugByIndex(indexOfCalculatedInput)] = prepareFormikValue(amount);
          stableswapItemFormStore.setInputAmount(amount, indexOfCalculatedInput);
        }
      });

      formikValues[currentInputSlug] = inputAmount;

      formik.setValues(formikValues);
    };

    return {
      label,
      balance,
      decimals,
      shouldShowBalanceButtons,
      tokenA: token,
      id: currentInputSlug,
      exchangeRate: exchangeRate.toFixed(),
      value: formik.values[currentInputSlug],
      error: formik.errors[currentInputSlug],
      onInputChange: handleInputChange
    };
  });

  return {
    data,
    disabled,
    isSubmitting,
    handleSubmit: formik.handleSubmit
  };
};
