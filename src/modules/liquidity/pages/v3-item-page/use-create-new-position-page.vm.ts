import { useCallback, useEffect, useMemo } from 'react';

import BigNumber from 'bignumber.js';
import { FormikHelpers, FormikValues, useFormik } from 'formik';

import { useLiquidityV3ItemTokens } from '@modules/liquidity/hooks';
import { useReady } from '@providers/use-dapp';
import { TokenInputProps } from '@shared/components';
import { getTokenDecimals, multipliedIfPossible, numberAsString } from '@shared/helpers';
import { useTokenBalance } from '@shared/hooks';
import { useTranslation } from '@translation';

import { useGetLiquidityV3ItemBalances } from '../../hooks/loaders/use-get-liquidity-v3-item-balances';
import { convertToAtomicPrice, getCreatePositionAmountInputSlugByIndex } from './helpers';
import { useLiquidityV3ItemTokensExchangeRates } from './hooks';
import {
  CreatePositionAmountInput,
  CreatePositionFormValues,
  CreatePositionInput,
  CreatePositionPriceInput
} from './types/create-position-form';

const MIN_TICK_SQRT_PRICE = 1;
const PRICE_RANGE_DECIMALS = convertToAtomicPrice(new BigNumber(MIN_TICK_SQRT_PRICE)).decimalPlaces();

export const useCreateNewPositionPageViewModel = () => {
  const { t } = useTranslation();
  const dAppReady = useReady();
  const { getLiquidityV3ItemBalances } = useGetLiquidityV3ItemBalances();
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();
  const tokenXBalance = useTokenBalance(tokenX);
  const tokenYBalance = useTokenBalance(tokenY);
  const { tokenXExchangeRate, tokenYExchangeRate } = useLiquidityV3ItemTokensExchangeRates();

  useEffect(() => {
    if (dAppReady) {
      void getLiquidityV3ItemBalances();
    }
  }, [dAppReady, getLiquidityV3ItemBalances]);

  const handleSubmit = (values: FormikValues, _: FormikHelpers<CreatePositionFormValues>) => {
    // eslint-disable-next-line no-console
    console.log('TODO: handle submit', values);
  };

  const formik = useFormik({
    initialValues: {
      [CreatePositionInput.MIN_PRICE]: '',
      [CreatePositionInput.MAX_PRICE]: '',
      [CreatePositionInput.FULL_RANGE_POSITION]: false,
      [CreatePositionInput.FIRST_AMOUNT_INPUT]: '',
      [CreatePositionInput.SECOND_AMOUNT_INPUT]: ''
    },
    onSubmit: handleSubmit
  });

  const handleInputChange = useCallback(
    (inputSlug: CreatePositionAmountInput | CreatePositionPriceInput, decimals: number) => (value: string) => {
      const { realValue } = numberAsString(value, decimals);
      formik.setFieldValue(inputSlug, realValue);
    },
    [formik]
  );

  const onFullRangeSwitcherClick = async (newState: boolean) =>
    formik.setFieldValue(CreatePositionInput.FULL_RANGE_POSITION, newState);

  const amountInputsProps = useMemo<TokenInputProps[]>(() => {
    const balances = [tokenXBalance, tokenYBalance];
    const tokens = [tokenX, tokenY];
    const exchangeRates = [tokenXExchangeRate, tokenYExchangeRate];

    return balances.map((balance, index) => {
      const inputSlug = getCreatePositionAmountInputSlugByIndex(index);
      const token = tokens[index];
      const decimals = getTokenDecimals(token);
      const dollarEquivalent = multipliedIfPossible(formik.values[inputSlug], exchangeRates[index]);

      return {
        value: formik.values[inputSlug],
        balance,
        label: t('common|Input'),
        error: formik.errors[inputSlug],
        decimals,
        dollarEquivalent: dollarEquivalent?.isNaN() ? null : dollarEquivalent,
        tokens: token,
        disabled: false,
        onInputChange: handleInputChange(inputSlug, decimals)
      };
    });
  }, [
    formik.errors,
    formik.values,
    t,
    tokenX,
    tokenXBalance,
    tokenXExchangeRate,
    tokenY,
    tokenYBalance,
    tokenYExchangeRate,
    handleInputChange
  ]);

  const rangeInputsProps = useMemo<TokenInputProps[]>(() => {
    const rangeInputsSlugs = [CreatePositionInput.MIN_PRICE, CreatePositionInput.MAX_PRICE] as const;
    const labels = [t('liquidity|minPrice'), t('liquidity|maxPrice')];
    // eslint-disable-next-line no-console
    console.log(PRICE_RANGE_DECIMALS);

    return rangeInputsSlugs.map((inputSlug, index) => ({
      value: formik.values[inputSlug],
      label: labels[index],
      error: formik.errors[inputSlug],
      decimals: PRICE_RANGE_DECIMALS,
      tokens: [tokenX, tokenY],
      disabled: false,
      onInputChange: handleInputChange(inputSlug, PRICE_RANGE_DECIMALS),
      hiddenBalance: true,
      hiddenPercentSelector: true
    }));
  }, [formik.errors, formik.values, handleInputChange, t, tokenX, tokenY]);

  return {
    disabled: true,
    loading: false,
    onSubmit: formik.handleSubmit,
    isFullRangePosition: formik.values[CreatePositionInput.FULL_RANGE_POSITION],
    onFullRangeSwitcherClick,
    amountInputsProps,
    rangeInputsProps,
    titleText: t('liquidity|createPosition')
  };
};
