import { useEffect } from 'react';

import { BigNumber } from 'bignumber.js';
import { FormikHelpers, useFormik } from 'formik';

import { LP_INPUT_KEY } from '@config/constants';
import { isNull, isTokenEqual, hasFormikError, toFixed } from '@shared/helpers';
import { BalanceToken, useTokensBalances } from '@shared/hooks';
import { Token } from '@shared/types';
import { useTranslation } from '@translation';

import {
  calculateLpValue,
  calculateOutputWithToken,
  getFormikInitialValues,
  getInputSlugByIndex,
  prepareInputAmountAsBN
} from '../../../../../../helpers';
import { useStableswapItemFormStore, useStableswapItemStore } from '../../../../../../hooks';
import { useAddLiqFormValidation } from './use-add-liq-form-validation';

const DEFAULT_LENGTH = 0;

interface AddLiqFormValues {
  [key: string]: string;
}

const findBalanceToken = (balances: Array<BalanceToken>, token: Token) =>
  balances.find(value => isTokenEqual(value.token, token));

export const useAddLiqFormViewModel = () => {
  const { t } = useTranslation();
  const stableswapItemStore = useStableswapItemStore();
  const stableswapItemFormStore = useStableswapItemFormStore();
  const item = stableswapItemStore.item;

  const balances = useTokensBalances(item?.tokensInfo.map(({ token }) => token));

  const validationSchema = useAddLiqFormValidation(
    (item?.tokensInfo ?? []).map(({ token }) => {
      const balanceWrapper = findBalanceToken(balances, token);

      return balanceWrapper?.balance ?? null;
    })
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
    return null;
  }

  const label = t('common|Input');
  const tooltip = t('common|Success');

  const { tokensInfo, totalLpSupply } = item;

  const formikValues = getFormikInitialValues(tokensInfo.length);

  const isSubmitting = formik.isSubmitting;
  const disabled = isSubmitting || hasFormikError(formik.errors);

  const handleImbalancedInputChange = (index: number) => (inputAmount: string) => {
    const formikKey = getInputSlugByIndex(index);
    const inputAmountBN = prepareInputAmountAsBN(inputAmount);

    formik.setFieldValue(formikKey, inputAmount);
    stableswapItemFormStore.setInputAmount(inputAmountBN, index);
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

  const handleInputChange = (reserves: BigNumber, index: number) =>
    stableswapItemFormStore.isBalancedProportion
      ? handleBalancedInputChange(reserves, index)
      : handleImbalancedInputChange(index);

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
    return stableswapItemFormStore.setIsBalancedProportion(state);
  };

  return {
    data,
    tooltip,
    disabled,
    isSubmitting,
    switcherValue: stableswapItemFormStore.isBalancedProportion,
    handleSwitcherClick,
    handleSubmit: formik.handleSubmit
  };
};
