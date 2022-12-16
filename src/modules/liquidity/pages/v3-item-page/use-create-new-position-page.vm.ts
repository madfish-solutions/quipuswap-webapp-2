import { useCallback, useEffect, useMemo } from 'react';

import BigNumber from 'bignumber.js';
import { useFormik } from 'formik';

import { useLiquidityV3ItemTokens, useLiquidityV3PoolStore } from '@modules/liquidity/hooks';
import { useReady } from '@providers/use-dapp';
import { TokenInputProps } from '@shared/components';
import { getTokenDecimals, isExist, multipliedIfPossible, numberAsString } from '@shared/helpers';
import { useTokensWithBalances } from '@shared/hooks';
import { useTranslation } from '@translation';

import { useGetLiquidityV3ItemBalances } from '../../hooks/loaders/use-get-liquidity-v3-item-balances';
import { FULL_PATH_PREFIX } from './constants';
import { convertToAtomicPrice, getCreatePositionAmountInputSlugByIndex } from './helpers';
import { useLiquidityV3ItemTokensExchangeRates } from './hooks';
import { CreatePositionAmountInput, CreatePositionInput, CreatePositionPriceInput } from './types/create-position-form';

const MIN_TICK_SQRT_PRICE = 1;
const PRICE_RANGE_DECIMALS = convertToAtomicPrice(new BigNumber(MIN_TICK_SQRT_PRICE)).decimalPlaces();

export const useCreateNewPositionPageViewModel = () => {
  const { t } = useTranslation();
  const dAppReady = useReady();
  const { getLiquidityV3ItemBalances } = useGetLiquidityV3ItemBalances();
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();
  const tokensList = useMemo(() => (isExist(tokenX) && isExist(tokenY) ? [tokenX, tokenY] : null), [tokenX, tokenY]);
  const tokensWithBalances = useTokensWithBalances(tokensList);
  const { tokenXExchangeRate, tokenYExchangeRate } = useLiquidityV3ItemTokensExchangeRates();
  const poolStore = useLiquidityV3PoolStore();

  useEffect(() => {
    if (dAppReady) {
      void getLiquidityV3ItemBalances();
    }
  }, [dAppReady, getLiquidityV3ItemBalances]);

  const handleSubmit = () => {
    // eslint-disable-next-line no-console
    console.log('TODO: handle submit');
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
    (inputSlug: CreatePositionAmountInput | CreatePositionPriceInput, inputDecimals: number) => (value: string) => {
      const { realValue } = numberAsString(value, inputDecimals);
      formik.setFieldValue(inputSlug, realValue);
    },
    [formik]
  );

  const onFullRangeSwitcherClick = async (newState: boolean) =>
    formik.setFieldValue(CreatePositionInput.FULL_RANGE_POSITION, newState);

  const amountInputsProps = useMemo<TokenInputProps[]>(() => {
    const exchangeRates = [tokenXExchangeRate, tokenYExchangeRate];

    return tokensWithBalances.map(({ balance, token }, index) => {
      const inputSlug = getCreatePositionAmountInputSlugByIndex(index);
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
        hiddenNotWhitelistedMessage: true,
        onInputChange: handleInputChange(inputSlug, decimals)
      };
    });
  }, [formik.errors, formik.values, t, tokenXExchangeRate, tokensWithBalances, tokenYExchangeRate, handleInputChange]);

  const rangeInputsProps = useMemo<TokenInputProps[]>(() => {
    const rangeInputsSlugs = [CreatePositionInput.MIN_PRICE, CreatePositionInput.MAX_PRICE] as const;
    const rangeInputsLabels = [t('liquidity|minPrice'), t('liquidity|maxPrice')];

    return rangeInputsSlugs.map((inputSlug, index) => ({
      value: formik.values[inputSlug],
      label: rangeInputsLabels[index],
      error: formik.errors[inputSlug],
      decimals: PRICE_RANGE_DECIMALS,
      tokens: tokensList,
      disabled: false,
      onInputChange: handleInputChange(inputSlug, PRICE_RANGE_DECIMALS),
      hiddenBalance: true,
      hiddenPercentSelector: true,
      hiddenNotWhitelistedMessage: true,
      fullWidth: false,
      tokenLogoWidth: 32
    }));
  }, [formik.errors, formik.values, handleInputChange, t, tokensList]);

  const backHref = `${FULL_PATH_PREFIX}/${poolStore.poolId?.toFixed()}`;

  return {
    disabled: true,
    loading: false,
    onSubmit: formik.handleSubmit,
    isFullRangePosition: formik.values[CreatePositionInput.FULL_RANGE_POSITION],
    onFullRangeSwitcherClick,
    amountInputsProps,
    rangeInputsProps,
    titleText: t('liquidity|createPosition'),
    backHref
  };
};
