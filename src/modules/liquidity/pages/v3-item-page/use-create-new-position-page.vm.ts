import { useCallback, useEffect, useMemo, useRef } from 'react';

import BigNumber from 'bignumber.js';
import { useFormik } from 'formik';

import { EMPTY_STRING } from '@config/constants';
import {
  useLiquidityV3CurrentPrice,
  useLiquidityV3ItemTokens,
  useLiquidityV3PoolStore
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
  numberAsString
} from '@shared/helpers';
import { useTokensWithBalances } from '@shared/hooks';
import { useTranslation } from '@translation';

import { useGetLiquidityV3ItemBalances } from '../../hooks/loaders/use-get-liquidity-v3-item-balances';
import { FULL_PATH_PREFIX } from './constants';
import { convertToAtomicPrice, getCreatePositionAmountInputSlugByIndex } from './helpers';
import { useCreateNewPositionFormValidationSchema, useLiquidityV3ItemTokensExchangeRates } from './hooks';
import {
  CreatePositionAmountInput,
  CreatePositionInput,
  CreatePositionPriceInput,
  isAmountInput
} from './types/create-position-form';

const MIN_TICK_SQRT_PRICE = 1;
const PRICE_RANGE_DECIMALS = convertToAtomicPrice(new BigNumber(MIN_TICK_SQRT_PRICE)).decimalPlaces();
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
  const validationSchema = useCreateNewPositionFormValidationSchema(tokensWithBalances);
  const lastEditedAmountFieldRef = useRef<CreatePositionAmountInput | null>(null);

  const initialMinPrice = useMemo(
    () =>
      isNull(currentPrice)
        ? EMPTY_STRING
        : decreaseByPercentage(currentPrice, new BigNumber(LOWER_PRICE_DELTA_PERCENTAGE)).toFixed(),
    [currentPrice]
  );
  const initialMaxPrice = useMemo(
    () =>
      isNull(currentPrice)
        ? EMPTY_STRING
        : increaseByPercentage(currentPrice, new BigNumber(UPPER_PRICE_DELTA_PERCENTAGE)).toFixed(),
    [currentPrice]
  );

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
      [CreatePositionInput.MIN_PRICE]: initialMinPrice,
      [CreatePositionInput.MAX_PRICE]: initialMaxPrice,
      [CreatePositionInput.FULL_RANGE_POSITION]: false,
      [CreatePositionInput.FIRST_AMOUNT_INPUT]: EMPTY_STRING,
      [CreatePositionInput.SECOND_AMOUNT_INPUT]: EMPTY_STRING
    },
    onSubmit: handleSubmit,
    validationSchema
  });

  const handleInputChange = useCallback(
    (inputSlug: CreatePositionAmountInput | CreatePositionPriceInput, inputDecimals: number) => (value: string) => {
      const { realValue } = numberAsString(value, inputDecimals);
      if (isAmountInput(inputSlug)) {
        lastEditedAmountFieldRef.current = inputSlug;
      }
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
        error: getFormikError(formik, inputSlug),
        decimals,
        dollarEquivalent: dollarEquivalent?.isNaN() ? null : dollarEquivalent,
        tokens: token,
        disabled: false,
        hiddenNotWhitelistedMessage: true,
        onInputChange: handleInputChange(inputSlug, decimals)
      };
    });
  }, [formik, t, tokenXExchangeRate, tokensWithBalances, tokenYExchangeRate, handleInputChange]);

  const rangeInputsProps = useMemo<TokenInputProps[]>(() => {
    const rangeInputsSlugs = [CreatePositionInput.MIN_PRICE, CreatePositionInput.MAX_PRICE] as const;
    const rangeInputsLabels = [t('liquidity|minPrice'), t('liquidity|maxPrice')];

    return rangeInputsSlugs.map((inputSlug, index) => ({
      value: formik.values[inputSlug],
      label: rangeInputsLabels[index],
      error: getFormikError(formik, inputSlug),
      decimals: PRICE_RANGE_DECIMALS,
      tokens: tokensList && [...tokensList].reverse(),
      disabled: false,
      onInputChange: handleInputChange(inputSlug, PRICE_RANGE_DECIMALS),
      hiddenBalance: true,
      hiddenPercentSelector: true,
      hiddenNotWhitelistedMessage: true,
      fullWidth: false,
      tokenLogoWidth: 32
    }));
  }, [formik, handleInputChange, t, tokensList]);

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
