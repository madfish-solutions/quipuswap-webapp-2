import { useEffect } from 'react';

import { BigNumber } from 'bignumber.js';
import { FormikHelpers, useFormik } from 'formik';

import { isNull, hasFormikError, toFixed, placeDecimals } from '@shared/helpers';
import { useTokensBalances } from '@shared/hooks';
import { useTranslation } from '@translation';

import {
  calculateLpValue,
  calculateOutputWithToken,
  extractTokens,
  getFormikInitialValues,
  getInputSlugByIndex
} from '../../../../../../helpers';
import { useAddStableswapLiquidity, useStableswapItemFormStore, useStableswapItemStore } from '../../../../../../hooks';
import { StableswapItem } from './../../../../../../types/mapped-api';
import { useAddLiqFormValidation } from './use-add-liq-form-validation';

const DEFAULT_LENGTH = 0;

export interface AddLiqFormValues {
  [key: string]: string;
}

const useAddLiqFormBalances = (item: Nullable<StableswapItem>) => {
  const tokens = extractTokens(item?.tokensInfo ?? []);

  const tokensAndBalances = useTokensBalances(tokens);

  return tokensAndBalances.map(tokenAndBalance => tokenAndBalance.balance ?? null);
};

export const useAddLiqFormViewModel = () => {
  const { t } = useTranslation();
  const { addStableswapLiquidity } = useAddStableswapLiquidity();

  const { item } = useStableswapItemStore();
  const formStore = useStableswapItemFormStore();
  const userBalances = useAddLiqFormBalances(item);

  const validationSchema = useAddLiqFormValidation(userBalances, formStore.isBalancedProportion);

  const handleSubmit = async (_: AddLiqFormValues, actions: FormikHelpers<AddLiqFormValues>) => {
    actions.setSubmitting(true);

    await addStableswapLiquidity();

    formik.resetForm();
    actions.setSubmitting(false);
  };

  const formik = useFormik({
    validationSchema,
    initialValues: getFormikInitialValues(item?.tokensInfo.length ?? DEFAULT_LENGTH),
    onSubmit: handleSubmit
  });

  useEffect(() => {
    return () => formStore.clearStore();
  }, [formStore]);

  if (isNull(item)) {
    return null;
  }

  const label = t('common|Input');
  const tooltip = t('common|Success');
  const isSubmitting = formik.isSubmitting;
  const disabled = isSubmitting || hasFormikError(formik.errors);

  const { tokensInfo, totalLpSupply, lpToken } = item;

  const formikValues = getFormikInitialValues(tokensInfo.length);

  const handleImbalancedInputChange = (index: number) => async (inputAmount: string) => {
    const formikKey = getInputSlugByIndex(index);
    const inputAmountBN = new BigNumber(inputAmount);

    formik.setFieldValue(formikKey, inputAmount);
    formStore.setInputAmount(inputAmountBN, index);
  };

  const handleBalancedInputChange = (reserves: BigNumber, index: number) => (inputAmount: string) => {
    formikValues[getInputSlugByIndex(index)] = inputAmount;
    const inputAmountBN = new BigNumber(inputAmount);

    const shares = calculateLpValue(inputAmountBN, reserves, totalLpSupply);
    const fixedShares = placeDecimals(shares, lpToken);

    const calculatedValues = tokensInfo.map(({ reserves: calculatedReserve, token }, indexOfCalculatedInput) => {
      if (index === indexOfCalculatedInput) {
        return inputAmountBN;
      }

      const result = calculateOutputWithToken(fixedShares, totalLpSupply, calculatedReserve);

      return placeDecimals(result, token, BigNumber.ROUND_UP);
    });

    calculatedValues.forEach((calculatedValue, indexOfCalculatedInput) => {
      if (indexOfCalculatedInput !== index) {
        formikValues[getInputSlugByIndex(indexOfCalculatedInput)] = toFixed(calculatedValue);
      }
    });

    formStore.setInputAmounts(calculatedValues);

    formik.setValues(formikValues);
  };

  const handleInputChange = (reserves: BigNumber, index: number) =>
    formStore.isBalancedProportion ? handleBalancedInputChange(reserves, index) : handleImbalancedInputChange(index);

  const data = tokensInfo.map(({ reserves }, index) => ({
    index,
    label,
    formik,
    balance: userBalances[index],
    onInputChange: handleInputChange(reserves, index)
  }));

  const handleSwitcherClick = (state: boolean) => formStore.setIsBalancedProportion(state);

  return {
    data,
    tooltip,
    disabled,
    isSubmitting,
    switcherValue: formStore.isBalancedProportion,
    handleSwitcherClick,
    handleSubmit: formik.handleSubmit
  };
};
