import { useEffect } from 'react';

import { BigNumber } from 'bignumber.js';
import { FormikHelpers, useFormik } from 'formik';

import { LP_INPUT_KEY } from '@config/constants';
import { isNull, isTokenEqual, hasFormikError, toFixed, fromDecimals } from '@shared/helpers';
import { BalanceToken, useTokensBalances } from '@shared/hooks';
import { Token } from '@shared/types';
import { useTranslation } from '@translation';

import {
  calculateLpValue,
  calculateOutputWithToken,
  createAmountsMichelsonMap,
  extractTokens,
  getFormikInitialValues,
  getInputSlugByIndex,
  prepareInputAmountAsBN
} from '../../../../../../helpers';
import { useCalcTokenAmountView, useStableswapItemFormStore, useStableswapItemStore } from '../../../../../../hooks';
import { useAddLiqFormValidation } from './use-add-liq-form-validation';

const DEFAULT_LENGTH = 0;
const IS_DEPOSIT = true;

export interface AddLiqFormValues {
  [key: string]: string;
}

const findBalanceToken = (balances: Array<BalanceToken>, token: Token) =>
  balances.find(value => isTokenEqual(value.token, token));

export const useAddLiqFormViewModel = () => {
  const { t } = useTranslation();
  const { calcTokenAmountView } = useCalcTokenAmountView(IS_DEPOSIT);
  const { item } = useStableswapItemStore();
  const {
    isBalancedProportion,
    clearStore,
    setLpAndTokenInputAmount,
    setLpAndTokenInputAmounts,
    setIsBalancedProportion
  } = useStableswapItemFormStore();

  const balances = useTokensBalances(item?.tokensInfo.map(({ token }) => token));
  const userBalances = (item?.tokensInfo ?? []).map(({ token }) => {
    const balanceWrapper = findBalanceToken(balances, token);

    return balanceWrapper?.balance ?? null;
  });

  const validationSchema = useAddLiqFormValidation(userBalances, isBalancedProportion);

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
    return () => clearStore();
  }, [clearStore]);

  if (isNull(item)) {
    return null;
  }

  const label = t('common|Input');
  const tooltip = t('common|Success');

  const { tokensInfo, totalLpSupply, lpToken } = item;

  const formikValues = getFormikInitialValues(tokensInfo.length);

  const isSubmitting = formik.isSubmitting;
  const disabled = isSubmitting || hasFormikError(formik.errors);

  const calculateShares = async (index: number, inputAmount: string) => {
    const tokens = extractTokens(tokensInfo);
    const map = createAmountsMichelsonMap(formik.values, tokens, index, inputAmount);
    const shares = await calcTokenAmountView(map);

    // eslint-disable-next-line no-console
    console.log('fixedShares', fromDecimals(shares, lpToken).toFixed());

    return fromDecimals(shares, lpToken);
  };

  const handleImbalancedInputChange = (index: number) => async (inputAmount: string) => {
    const formikKey = getInputSlugByIndex(index);
    const inputAmountBN = prepareInputAmountAsBN(inputAmount);
    const shares = await calculateShares(index, inputAmount);

    formik.setFieldValue(formikKey, inputAmount);
    setLpAndTokenInputAmount(shares, inputAmountBN, index);
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

    setLpAndTokenInputAmounts(lpValue, calculatedValues);

    formik.setValues(formikValues);
  };

  const handleInputChange = (reserves: BigNumber, index: number) =>
    isBalancedProportion ? handleBalancedInputChange(reserves, index) : handleImbalancedInputChange(index);

  const data = tokensInfo.map(({ reserves, token }, index) => {
    const balance = findBalanceToken(balances, token)?.balance;

    return {
      index,
      label,
      formik,
      balance: balance,
      onInputChange: handleInputChange(reserves, index)
    };
  });

  const handleSwitcherClick = (state: boolean) => {
    return setIsBalancedProportion(state);
  };

  return {
    data,
    tooltip,
    disabled,
    isSubmitting,
    switcherValue: isBalancedProportion,
    handleSwitcherClick,
    handleSubmit: formik.handleSubmit
  };
};
