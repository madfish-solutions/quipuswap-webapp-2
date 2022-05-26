import { useEffect } from 'react';

import { BigNumber } from 'bignumber.js';
import { FormikHelpers, useFormik } from 'formik';

import { LP_INPUT_KEY } from '@config/constants';
import { fromDecimals, isNull, toFixed } from '@shared/helpers';
import { useTranslation } from '@translation';

import {
  calculateLpValue,
  calculateOutputWithLp,
  calculateOutputWithToken,
  extractTokens,
  getFormikInitialValues,
  getFormikInitialValuesRemoveForm,
  getInputSlugByIndex,
  prepareInputAmountAsBN
} from '../../../../../../helpers';
import { useStableswapItemFormStore, useStableswapItemStore } from '../../../../../../hooks';
import { createAmountsMichelsonMap } from './create-amounts-map';
import { useCalcTokenAmountView } from './use-calc-token-amount-view';
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
  const { calcTokenAmountView } = useCalcTokenAmountView();

  const stableswapItemStore = useStableswapItemStore();
  const stableswapItemFormStore = useStableswapItemFormStore();
  const { t } = useTranslation();
  const item = stableswapItemStore.item;

  const inputsCount = (item && item.tokensInfo.length) ?? DEFAULT_LENGTH;
  const userBalances = Array(inputsCount).fill(BALANCE_BN);

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

  const labelInput = t('common|Input');
  const labelOutput = t('common|Output');
  const tooltip = t('common|Success');

  const { tokensInfo, totalLpSupply } = item;

  const formikValues = getFormikInitialValues(tokensInfo.length);

  const setValues = (lpValue: Nullable<BigNumber>, calculatedValues: Array<Nullable<BigNumber>>) => {
    formik.setValues(formikValues);
    stableswapItemFormStore.setLpAndTokenInputAmounts(lpValue, calculatedValues);
  };

  const handleBalancedInputChange = (reserves: BigNumber, index: number) => (inputAmount: string) => {
    formikValues[getInputSlugByIndex(index)] = inputAmount;
    const inputAmountBN = prepareInputAmountAsBN(inputAmount);
    const lpValue = calculateLpValue(inputAmountBN, reserves, totalLpSupply);

    formikValues[LP_INPUT_KEY] = toFixed(lpValue);

    const calculatedValues = tokensInfo.map(({ reserves: calculatedReserve }, indexOfCalculatedInput) => {
      if (index === indexOfCalculatedInput) {
        return inputAmountBN;
      }

      return calculateOutputWithToken(lpValue, totalLpSupply, calculatedReserve);
    });

    calculatedValues.forEach((calculatedValue, indexOfCalculatedInput) => {
      if (indexOfCalculatedInput !== index) {
        formikValues[getInputSlugByIndex(indexOfCalculatedInput)] = toFixed(calculatedValue);
      }
    });

    stableswapItemFormStore.setLpAndTokenInputAmounts(lpValue, calculatedValues);

    formik.setValues(formikValues);
  };

  const calculateShares = async (index: number, inputAmount: string) => {
    const tokens = extractTokens(item.tokensInfo);
    const map = createAmountsMichelsonMap(formik.values, tokens, index, inputAmount);
    const shares = await calcTokenAmountView(map);
    const fixedShares = fromDecimals(shares, item.lpToken);

    return fixedShares.toFixed();
  };

  const handleImbalancedInputChange = (index: number) => async (inputAmount: string) => {
    formik.setFieldValue(getInputSlugByIndex(index), inputAmount);

    const shares = await calculateShares(index, inputAmount);
    formik.setFieldValue(LP_INPUT_KEY, shares);
  };

  const handleInputChange = (reserves: BigNumber, index: number) =>
    stableswapItemFormStore.isBalancedProportion
      ? handleBalancedInputChange(reserves, index)
      : handleImbalancedInputChange(index);

  const data = tokensInfo.map(({ reserves }, index) => {
    return {
      index,
      formik,
      label: labelOutput,
      balance: BALANCE,
      onInputChange: handleInputChange(reserves, index)
    };
  });

  const handleLpInputChange = (inputAmount: string) => {
    formikValues[LP_INPUT_KEY] = inputAmount;

    const inputAmountBN = prepareInputAmountAsBN(inputAmount);
    const tokenOutputs = calculateOutputWithLp(inputAmountBN, totalLpSupply, tokensInfo);

    tokenOutputs.forEach((amount, indexOfTokenInput) => {
      formikValues[getInputSlugByIndex(indexOfTokenInput)] = toFixed(amount);
    });

    setValues(inputAmountBN, tokenOutputs);
  };

  const handleSwitcherClick = (state: boolean) => {
    return stableswapItemFormStore.setIsBalancedProportion(state);
  };

  return {
    data,
    formik,
    tooltip,
    labelInput,
    isSubmitting: formik.isSubmitting,
    lpBalance: LP_BALANCE,
    switcherValue: stableswapItemFormStore.isBalancedProportion,
    isLpInputDisabled: stableswapItemFormStore.isBalancedProportion,
    handleSwitcherClick,
    handleLpInputChange,
    handleSubmit: formik.handleSubmit
  };
};
