import { useEffect } from 'react';

import { BigNumber } from 'bignumber.js';
import { FormikHelpers, useFormik } from 'formik';

import { LP_INPUT_KEY } from '@config/constants';
import {
  findBalanceToken,
  fromDecimals,
  isNull,
  numberAsString,
  placeDecimals,
  saveBigNumber,
  toFixed
} from '@shared/helpers';
import { useAuthStore, useTokenBalance, useTokensWithBalances } from '@shared/hooks';
import { useTranslation } from '@translation';

import {
  calculateShares as calculateLpValue,
  calculateOutputWithLp,
  calculateOutputWithToken,
  extractTokens,
  getFormikInitialValues,
  getFormikInitialValuesRemoveForm,
  getInputSlugByIndex,
  createAmountsMichelsonMapFormikValues
} from '../../../../../../helpers';
import {
  useRemoveStableswapLiquidity,
  useStableswapItemFormStore,
  useStableswapItemStore,
  useCalcTokenAmountView
} from '../../../../../../hooks';
import { StableswapItem } from '../../../../../../types';
import { useRemoveLiqFormValidation } from './use-remove-liq-form-validation';

const DEFAULT_LENGTH = 0;
const DEFAULT_LP_BALANCE = null;
export interface RemoveLiqFormValues {
  [key: string]: string;
}

const useRemoveLiqFormService = (item: Nullable<StableswapItem>, isBalancedProportion: boolean) => {
  const lpBalance = useTokenBalance(item?.lpToken);
  const fixedLpBalance = lpBalance ?? DEFAULT_LP_BALANCE;

  const tokens = item?.tokensInfo ? extractTokens(item.tokensInfo) : null;
  const balanceTokens = useTokensWithBalances(tokens);

  const lockeds = (item && item.tokensInfo.map(({ reserves }) => reserves)) ?? [];
  const inputsCount = (item && item.tokensInfo.length) ?? DEFAULT_LENGTH;

  const validationSchema = useRemoveLiqFormValidation(fixedLpBalance, lockeds, isBalancedProportion);

  return {
    lpBalance,
    balanceTokens,
    inputsCount,
    validationSchema
  };
};

export const useRemoveLiqFormViewModel = () => {
  const { calcTokenAmountView } = useCalcTokenAmountView();
  const { removeStableswapLiquidity } = useRemoveStableswapLiquidity();
  const { accountPkh } = useAuthStore();
  const stableswapItemStore = useStableswapItemStore();
  const stableswapItemFormStore = useStableswapItemFormStore();
  const { t } = useTranslation();
  const { item } = stableswapItemStore;

  const { lpBalance, balanceTokens, inputsCount, validationSchema } = useRemoveLiqFormService(
    item,
    stableswapItemFormStore.isBalancedProportion
  );

  const handleSubmit = async (_: RemoveLiqFormValues, actions: FormikHelpers<RemoveLiqFormValues>) => {
    actions.setSubmitting(true);
    await removeStableswapLiquidity();
    formik.resetForm();
    stableswapItemFormStore.clearStore();
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

  const { tokensInfo, totalLpSupply, lpToken } = item;

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
      const inputAmountBN = saveBigNumber(fixedValue, null);

      formikValues[getInputSlugByIndex(index)] = realValue;
      const lpValue = calculateLpValue(inputAmountBN, reserves, totalLpSupply);
      formikValues[LP_INPUT_KEY] = toFixed(lpValue);

      const calculatedValues = tokensInfo.map(({ reserves: calculatedReserve, token }, indexOfCalculatedInput) => {
        if (index === indexOfCalculatedInput) {
          return inputAmountBN;
        }

        return calculateOutputWithToken(lpValue, totalLpSupply, calculatedReserve, token);
      });

      calculatedValues.forEach((calculatedValue, indexOfCalculatedInput) => {
        if (indexOfCalculatedInput !== index) {
          formikValues[getInputSlugByIndex(indexOfCalculatedInput)] = toFixed(calculatedValue);
        }
      });

      const fixedLpValue = lpValue ? placeDecimals(lpValue, lpToken, BigNumber.ROUND_UP) : null;
      stableswapItemFormStore.setLpAndTokenInputAmounts(fixedLpValue, calculatedValues);

      formik.setValues(formikValues);
    };
  };

  const calculateShares = async (index: number, inputAmount: string) => {
    const tokens = extractTokens(item.tokensInfo);
    const map = createAmountsMichelsonMapFormikValues(formik.values, tokens, index, inputAmount);
    const shares = await calcTokenAmountView(map);
    const fixedShares = fromDecimals(shares, item.lpToken);

    return fixedShares.toFixed();
  };

  const handleImbalancedInputChange = (index: number) => async (inputAmount: string) => {
    formik.setFieldValue(getInputSlugByIndex(index), inputAmount);

    const shares = await calculateShares(index, inputAmount);
    formik.setFieldValue(LP_INPUT_KEY, shares);

    stableswapItemFormStore.setInputAmount(saveBigNumber(inputAmount, new BigNumber('0')), index);
    stableswapItemFormStore.setShares(new BigNumber(shares));
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
      isRemove: true,
      onInputChange: handleInputChange(reserves, index)
    };
  });

  const handleLpInputChange = (inputAmount: string) => {
    const { realValue, fixedValue } = numberAsString(inputAmount, lpToken.metadata.decimals);

    formikValues[LP_INPUT_KEY] = realValue;

    const inputAmountBN = saveBigNumber(fixedValue, new BigNumber('0'));
    const tokenOutputs = calculateOutputWithLp(inputAmountBN, totalLpSupply, tokensInfo);

    tokenOutputs.forEach((amount, indexOfTokenInput) => {
      formikValues[getInputSlugByIndex(indexOfTokenInput)] = toFixed(amount);
    });

    setValues(inputAmountBN, tokenOutputs);
  };

  const handleSwitcherClick = (state: boolean) => {
    return stableswapItemFormStore.setIsBalancedProportion(state);
  };

  const disabled = formik.isSubmitting || !accountPkh;

  return {
    data,
    formik,
    tooltip,
    labelInput,
    isSubmitting: formik.isSubmitting,
    disabled,
    lpBalance,
    switcherValue: stableswapItemFormStore.isBalancedProportion,
    isLpInputDisabled: !stableswapItemFormStore.isBalancedProportion,
    handleSwitcherClick,
    handleLpInputChange,
    handleSubmit: formik.handleSubmit
  };
};
