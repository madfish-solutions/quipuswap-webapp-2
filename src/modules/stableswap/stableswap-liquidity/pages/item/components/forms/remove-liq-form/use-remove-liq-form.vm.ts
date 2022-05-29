import { useEffect } from 'react';

import { BigNumber } from 'bignumber.js';
import { FormikHelpers, useFormik } from 'formik';

import { LP_INPUT_KEY } from '@config/constants';
import { StableswapItem } from '@modules/stableswap/types';
import { findBalanceToken, fromDecimals, isNull, numberAsString, placeDecimals, toFixed } from '@shared/helpers';
import { useTokenBalance, useTokensBalances } from '@shared/hooks';
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
import {
  useRemoveStableswapLiquidity,
  useStableswapItemFormStore,
  useStableswapItemStore
} from '../../../../../../hooks';
import { createAmountsMichelsonMap } from './create-amounts-map';
import { useCalcTokenAmountView } from './use-calc-token-amount-view';
import { useRemoveLiqFormValidation } from './use-remove-liq-form-validation';

const DEFAULT_LENGTH = 0;
const ZERO = new BigNumber('0');
export interface RemoveLiqFormValues {
  [key: string]: string;
}

const useHelper = (item: Nullable<StableswapItem>) => {
  const lpBalance = useTokenBalance(item?.lpToken);

  const tokens = item?.tokensInfo ? extractTokens(item.tokensInfo) : null;
  const balanceTokens = useTokensBalances(tokens);

  const lockeds = (item && item.tokensInfo.map(({ reserves }) => reserves)) ?? [];
  const inputsCount = (item && item.tokensInfo.length) ?? DEFAULT_LENGTH;

  return {
    lpBalance,
    balanceTokens,
    lockeds,
    inputsCount
  };
};

export const useRemoveLiqFormViewModel = () => {
  const { calcTokenAmountView } = useCalcTokenAmountView();
  const { removeStableswapLiquidity } = useRemoveStableswapLiquidity();
  const stableswapItemStore = useStableswapItemStore();
  const stableswapItemFormStore = useStableswapItemFormStore();
  const { t } = useTranslation();
  const { item } = stableswapItemStore;

  const { lpBalance, balanceTokens, lockeds, inputsCount } = useHelper(item);

  const validationSchema = useRemoveLiqFormValidation(
    lpBalance ?? ZERO,
    lockeds,
    stableswapItemFormStore.isBalancedProportion
  );

  const handleSubmit = async (_: RemoveLiqFormValues, actions: FormikHelpers<RemoveLiqFormValues>) => {
    actions.setSubmitting(true);
    await removeStableswapLiquidity();
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

  const handleBalancedInputChange = (reserves: BigNumber, index: number) => {
    const localToken = extractTokens(item.tokensInfo)[index];
    const localTokenDecimals = localToken.metadata.decimals;

    return (inputAmount: string) => {
      const { realValue, fixedValue } = numberAsString(inputAmount, localTokenDecimals);
      const inputAmountBN = new BigNumber(fixedValue ?? '0');

      formikValues[getInputSlugByIndex(index)] = realValue;
      const lpValue = calculateLpValue(inputAmountBN, reserves, totalLpSupply);

      formikValues[LP_INPUT_KEY] = toFixed(lpValue);

      const calculatedValues = tokensInfo.map(({ reserves: calculatedReserve, token }, indexOfCalculatedInput) => {
        if (index === indexOfCalculatedInput) {
          return inputAmountBN;
        }
        const result = calculateOutputWithToken(lpValue, totalLpSupply, calculatedReserve);

        return result && placeDecimals(result, token, BigNumber.ROUND_UP);
      });

      calculatedValues.forEach((calculatedValue, indexOfCalculatedInput) => {
        if (indexOfCalculatedInput !== index) {
          formikValues[getInputSlugByIndex(indexOfCalculatedInput)] = toFixed(calculatedValue);
        }
      });

      stableswapItemFormStore.setLpAndTokenInputAmounts(lpValue, calculatedValues);

      formik.setValues(formikValues);
    };
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

    stableswapItemFormStore.setInputAmount(new BigNumber(inputAmount), index);
    stableswapItemFormStore.setLpInputAmount(new BigNumber(shares));
  };

  const handleInputChange = (reserves: BigNumber, index: number) =>
    stableswapItemFormStore.isBalancedProportion
      ? handleBalancedInputChange(reserves, index)
      : handleImbalancedInputChange(index);

  const data = tokensInfo.map(({ reserves, token }, index) => {
    const balance = findBalanceToken(balanceTokens, token)?.balance;

    return {
      index,
      formik,
      label: labelOutput,
      balance,
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
    lpBalance,
    switcherValue: stableswapItemFormStore.isBalancedProportion,
    isLpInputDisabled: !stableswapItemFormStore.isBalancedProportion,
    handleSwitcherClick,
    handleLpInputChange,
    handleSubmit: formik.handleSubmit
  };
};
