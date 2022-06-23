import { useEffect } from 'react';

import { BigNumber } from 'bignumber.js';
import { FormikHelpers, useFormik } from 'formik';

import { isNull, numberAsString, placeDecimals, saveBigNumber, toFixed } from '@shared/helpers';

import {
  calculateOutputWithToken,
  calculateShares,
  extractTokens,
  getFormikInitialValues,
  getInputSlugByIndex
} from '../../../../../../helpers';
import {
  useAddStableswapLiquidity,
  useStableswapItemFormStore,
  useStableswapItemStore,
  useStableswapTokensBalances
} from '../../../../../../hooks';
import { useAddLiqFormValidation } from './use-add-liq-form-validation';
import { useAddLiqFormHelper } from './use-add-liq-form.helper';
import { useZeroInputsError } from './use-zero-inputs-error';

const DEFAULT_LENGTH = 0;

export interface AddLiqFormValues {
  [key: string]: string;
}

export const useAddLiqFormViewModel = () => {
  const { addStableswapLiquidity } = useAddStableswapLiquidity();

  const { item } = useStableswapItemStore();
  const formStore = useStableswapItemFormStore();
  const userBalances = useStableswapTokensBalances(item);

  const validationSchema = useAddLiqFormValidation(userBalances, formStore.isBalancedProportion);

  const isZeroInputsError = useZeroInputsError();
  const handleSubmit = async (_: AddLiqFormValues, actions: FormikHelpers<AddLiqFormValues>) => {
    if (isZeroInputsError) {
      return;
    }

    actions.setSubmitting(true);

    await addStableswapLiquidity();
    formStore.clearStore();

    formik.resetForm();
    actions.setSubmitting(false);
  };

  const formik = useFormik({
    validationSchema,
    initialValues: getFormikInitialValues(item?.tokensInfo.length ?? DEFAULT_LENGTH),
    onSubmit: handleSubmit
  });

  const { label, tooltip, disabled, isSubmitting, shouldShowZeroInputsAlert } = useAddLiqFormHelper(formik);

  useEffect(() => {
    return () => formStore.clearStore();
  }, [formStore]);

  if (isNull(item)) {
    return null;
  }

  const { tokensInfo, totalLpSupply, lpToken } = item;

  const formikValues = getFormikInitialValues(tokensInfo.length);

  const handleImbalancedInputChange = (index: number) => async (inputAmount: string) => {
    const formikKey = getInputSlugByIndex(index);
    const inputAmountBN = new BigNumber(inputAmount);

    formik.setFieldValue(formikKey, inputAmount);
    formStore.setInputAmount(inputAmountBN, index);
  };

  const handleBalancedInputChange = (reserves: BigNumber, index: number) => {
    const localToken = extractTokens(item.tokensInfo)[index];
    const localTokenDecimals = localToken.metadata.decimals;

    return (inputAmount: string) => {
      const { realValue, fixedValue } = numberAsString(inputAmount, localTokenDecimals);
      const inputAmountBN = saveBigNumber(fixedValue, null);
      formikValues[getInputSlugByIndex(index)] = realValue;

      const shares = calculateShares(inputAmountBN, reserves, totalLpSupply);
      const fixedShares = shares && placeDecimals(shares, lpToken);

      const calculatedValues = tokensInfo.map(({ reserves: calculatedReserve, token }, indexOfCalculatedInput) => {
        if (index === indexOfCalculatedInput) {
          return inputAmountBN;
        }

        return calculateOutputWithToken(fixedShares, totalLpSupply, calculatedReserve, token);
      });

      calculatedValues.forEach((calculatedValue, indexOfCalculatedInput) => {
        if (indexOfCalculatedInput !== index) {
          formikValues[getInputSlugByIndex(indexOfCalculatedInput)] = toFixed(calculatedValue);
        }
      });

      formik.setValues(formikValues);
      formStore.setInputAmounts(calculatedValues);
    };
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
    isZeroInputsError,
    shouldShowZeroInputsAlert,
    switcherValue: formStore.isBalancedProportion,
    handleSwitcherClick,
    handleSubmit: formik.handleSubmit
  };
};
