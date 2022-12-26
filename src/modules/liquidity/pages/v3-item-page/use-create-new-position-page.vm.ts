import { useCallback, useEffect, useMemo } from 'react';

import BigNumber from 'bignumber.js';

import { EMPTY_STRING, INFINITY_SIGN, ZERO_AMOUNT } from '@config/constants';
import {
  useLiquidityV3CurrentPrice,
  useLiquidityV3ItemTokens,
  useLiquidityV3PoolStore,
  useV3PoolPriceDecimals
} from '@modules/liquidity/hooks';
import { useReady } from '@providers/use-dapp';
import { TokenInputProps } from '@shared/components';
import {
  decreaseByPercentage,
  getFormikError,
  getTokenDecimals,
  increaseByPercentage,
  isExist,
  isNull,
  multipliedIfPossible,
  numberAsString,
  toAtomic,
  toReal
} from '@shared/helpers';
import { useTokensWithBalances } from '@shared/hooks';
import { useTranslation } from '@translation';

import { useGetLiquidityV3ItemBalances } from '../../hooks/loaders/use-get-liquidity-v3-item-balances';
import { FULL_PATH_PREFIX } from './constants';
import {
  calculateTick,
  convertToAtomicPrice,
  getCreatePositionAmountInputSlugByIndex,
  shouldAddTokenX,
  shouldAddTokenY
} from './helpers';
import {
  useCreatePositionFormik,
  useCurrentTick,
  useLiquidityV3ItemTokensExchangeRates,
  useOnAmountInputChange,
  useOnPriceRangeChange,
  useOnPriceRangeInputChange,
  usePositionTicks,
  useTickSpacing
} from './hooks';
import {
  CreatePositionAmountInput,
  CreatePositionInput,
  CreatePositionPriceInput,
  isAmountInput
} from './types/create-position-form';

const MIN_TICK_SQRT_PRICE = 1;
const PRICE_RANGE_DECIMALS = convertToAtomicPrice(new BigNumber(MIN_TICK_SQRT_PRICE)).decimalPlaces() ?? ZERO_AMOUNT;
const LOWER_PRICE_DELTA_PERCENTAGE = 50;
const UPPER_PRICE_DELTA_PERCENTAGE = 50;
export const useCreateNewPositionPageViewModel = () => {
  const { t } = useTranslation();
  const dAppReady = useReady();
  const { getLiquidityV3ItemBalances } = useGetLiquidityV3ItemBalances();
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();
  const tokensList = useMemo(() => (isExist(tokenX) && isExist(tokenY) ? [tokenX, tokenY] : null), [tokenX, tokenY]);
  const tokensWithBalances = useTokensWithBalances(tokensList);
  const { tokenXExchangeRate, tokenYExchangeRate } = useLiquidityV3ItemTokensExchangeRates();
  const poolStore = useLiquidityV3PoolStore();
  const currentPrice = useLiquidityV3CurrentPrice();
  const currentTick = useCurrentTick();
  const tickSpacing = useTickSpacing();
  const priceDecimals = useV3PoolPriceDecimals();

  const initialMinPrice = useMemo(() => {
    if (isNull(currentPrice)) {
      return EMPTY_STRING;
    }

    const basicPrice = decreaseByPercentage(currentPrice, new BigNumber(LOWER_PRICE_DELTA_PERCENTAGE));
    const tick = calculateTick(toAtomic(basicPrice, priceDecimals), tickSpacing);

    return toReal(tick.price, priceDecimals).toFixed();
  }, [currentPrice, priceDecimals, tickSpacing]);
  const initialMaxPrice = useMemo(() => {
    if (isNull(currentPrice)) {
      return EMPTY_STRING;
    }

    const basicPrice = increaseByPercentage(currentPrice, new BigNumber(UPPER_PRICE_DELTA_PERCENTAGE));
    const tick = calculateTick(toAtomic(basicPrice, priceDecimals), tickSpacing);

    return toReal(tick.price, priceDecimals).toFixed();
  }, [currentPrice, priceDecimals, tickSpacing]);

  useEffect(() => {
    if (dAppReady) {
      void getLiquidityV3ItemBalances();
    }
  }, [dAppReady, getLiquidityV3ItemBalances]);

  const formik = useCreatePositionFormik(initialMinPrice, initialMaxPrice, tokensWithBalances);
  const { upperTick, lowerTick } = usePositionTicks(formik);
  const { onAmountInputChange, lastEditedAmountFieldRef } = useOnAmountInputChange(formik);
  const onPriceRangeInputChange = useOnPriceRangeInputChange(formik, lastEditedAmountFieldRef);
  const onPriceRangeChange = useOnPriceRangeChange(formik, lastEditedAmountFieldRef);

  const handleRangeInputBlur = useCallback(
    (inputSlug: CreatePositionPriceInput) => () => {
      const inputValue = formik.values[inputSlug];

      if (!isExist(inputValue)) {
        return;
      }

      const realValue = new BigNumber(numberAsString(inputValue, PRICE_RANGE_DECIMALS).realValue);
      const tick = realValue.isNaN() ? null : calculateTick(toAtomic(realValue, priceDecimals), tickSpacing);

      if (!formik.values[CreatePositionInput.FULL_RANGE_POSITION] && isExist(tick)) {
        onPriceRangeInputChange(inputSlug, toReal(tick.price, priceDecimals).toFixed());
      }
    },
    [formik.values, onPriceRangeInputChange, priceDecimals, tickSpacing]
  );

  const handleInputChange = useCallback(
    (inputSlug: CreatePositionAmountInput | CreatePositionPriceInput, inputDecimals: number) => (value: string) => {
      const { realValue } = numberAsString(value, inputDecimals);
      if (isAmountInput(inputSlug)) {
        onAmountInputChange(inputSlug, realValue);
      } else {
        onPriceRangeInputChange(inputSlug, realValue);
      }
    },
    [onAmountInputChange, onPriceRangeInputChange]
  );

  const onFullRangeSwitcherClick = useCallback(
    (newState: boolean) => {
      formik.setFieldValue(CreatePositionInput.FULL_RANGE_POSITION, newState).then(() => {
        if (newState) {
          onPriceRangeChange(ZERO_AMOUNT.toString(), `+${INFINITY_SIGN}`);
        } else {
          onPriceRangeChange(initialMinPrice, initialMaxPrice);
        }
      });
    },
    [formik, initialMaxPrice, initialMinPrice, onPriceRangeChange]
  );

  const amountInputsProps = useMemo<TokenInputProps[]>(() => {
    const exchangeRates = [tokenXExchangeRate, tokenYExchangeRate];

    return tokensWithBalances.map(({ balance, token }, index) => {
      const inputSlug = getCreatePositionAmountInputSlugByIndex(index);
      const decimals = getTokenDecimals(token);
      const dollarEquivalent = multipliedIfPossible(formik.values[inputSlug], exchangeRates[index]);

      return {
        value: formik.values[inputSlug],
        balance,
        disabled:
          inputSlug === CreatePositionInput.FIRST_AMOUNT_INPUT
            ? isExist(currentTick) && isExist(upperTick) && !shouldAddTokenX(currentTick.index, upperTick.index)
            : isExist(currentTick) && isExist(lowerTick) && !shouldAddTokenY(currentTick.index, lowerTick.index),
        label: t('common|Input'),
        error: getFormikError(formik, inputSlug),
        decimals,
        dollarEquivalent: dollarEquivalent?.isNaN() ? null : dollarEquivalent,
        tokens: token,
        hiddenNotWhitelistedMessage: true,
        onInputChange: handleInputChange(inputSlug, decimals)
      };
    });
  }, [
    tokenXExchangeRate,
    tokenYExchangeRate,
    tokensWithBalances,
    formik,
    currentTick,
    upperTick,
    lowerTick,
    t,
    handleInputChange
  ]);

  const rangeInputsProps = useMemo<TokenInputProps[]>(() => {
    const rangeInputsSlugs = [CreatePositionInput.MIN_PRICE, CreatePositionInput.MAX_PRICE] as const;
    const rangeInputsLabels = [t('liquidity|minPrice'), t('liquidity|maxPrice')];

    return rangeInputsSlugs.map((inputSlug, index) => ({
      value: formik.values[inputSlug],
      label: rangeInputsLabels[index],
      error: getFormikError(formik, inputSlug),
      decimals: PRICE_RANGE_DECIMALS,
      tokens: tokensList && [...tokensList].reverse(),
      disabled: formik.values[CreatePositionInput.FULL_RANGE_POSITION],
      onInputChange: handleInputChange(inputSlug, PRICE_RANGE_DECIMALS),
      hiddenBalance: true,
      hiddenPercentSelector: true,
      hiddenNotWhitelistedMessage: true,
      fullWidth: false,
      tokenLogoWidth: 32,
      onBlur: handleRangeInputBlur(inputSlug)
    }));
  }, [formik, handleInputChange, handleRangeInputBlur, t, tokensList]);

  const backHref = `${FULL_PATH_PREFIX}/${poolStore.poolId?.toFixed()}`;

  return {
    disabled: false,
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
