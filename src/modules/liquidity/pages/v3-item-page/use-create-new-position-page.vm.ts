import { useEffect, useMemo } from 'react';

import {
  useGetLiquidityV3ItemWithPositions,
  useLiquidityV3ItemTokens,
  useLiquidityV3PoolStore
} from '@modules/liquidity/hooks';
import { useReady } from '@providers/use-dapp';
import { TokenInputProps } from '@shared/components';
import { getFormikError, getTokenDecimals, isExist } from '@shared/helpers';
import { useTokensWithBalances } from '@shared/hooks';
import { useTranslation } from '@translation';

import { useGetLiquidityV3ItemBalances } from '../../hooks/loaders/use-get-liquidity-v3-item-balances';
import { FULL_PATH_PREFIX } from './constants';
import {
  useCreatePositionFormik,
  useCurrentTick,
  useAmountInputsProps,
  useInputsHandlers,
  useInitialPriceRange
} from './hooks';
import { CreatePositionInput } from './types/create-position-form';
import { tezosTokenIsIncluded } from './helpers';

const MIN_PRICE_RANGE_DECIMALS = 6;

export const useCreateNewPositionPageViewModel = () => {
  const { t } = useTranslation();
  const dAppReady = useReady();
  const { getLiquidityV3ItemBalances } = useGetLiquidityV3ItemBalances();
  const { getLiquidityV3ItemWithPositions } = useGetLiquidityV3ItemWithPositions();
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();
  const tokensList = useMemo(() => (isExist(tokenX) && isExist(tokenY) ? [tokenX, tokenY] : null), [tokenX, tokenY]);
  const tokensWithBalances = useTokensWithBalances(tokensList);
  const poolStore = useLiquidityV3PoolStore();
  const currentTick = useCurrentTick();
  const priceRangeDecimals = Math.max(getTokenDecimals(tokenY), MIN_PRICE_RANGE_DECIMALS);

  const { minPrice: initialMinPrice, maxPrice: initialMaxPrice } = useInitialPriceRange(priceRangeDecimals);

  useEffect(() => {
    if (dAppReady) {
      void getLiquidityV3ItemBalances();
      void getLiquidityV3ItemWithPositions();
    }
  }, [dAppReady, getLiquidityV3ItemBalances, getLiquidityV3ItemWithPositions]);

  const formik = useCreatePositionFormik(initialMinPrice, initialMaxPrice, tokensWithBalances);

  const { handleInputChange, handleRangeInputBlur, onFullRangeSwitcherClick } = useInputsHandlers(
    formik,
    priceRangeDecimals,
    initialMinPrice,
    initialMaxPrice
  );

  const amountInputsProps = useAmountInputsProps(tokensWithBalances, handleInputChange, currentTick, formik);

  const rangeInputsProps = useMemo<TokenInputProps[]>(() => {
    const rangeInputsSlugs = [CreatePositionInput.MIN_PRICE, CreatePositionInput.MAX_PRICE] as const;
    const rangeInputsLabels = [t('liquidity|minPrice'), t('liquidity|maxPrice')];

    return rangeInputsSlugs.map((inputSlug, index) => ({
      value: formik.values[inputSlug],
      label: rangeInputsLabels[index],
      decimals: priceRangeDecimals,
      tokens: tokensList && [...tokensList].reverse(),
      readOnly: formik.values[CreatePositionInput.FULL_RANGE_POSITION],
      onInputChange: handleInputChange(inputSlug, priceRangeDecimals),
      hiddenBalance: true,
      hiddenPercentSelector: true,
      hiddenNotWhitelistedMessage: true,
      fullWidth: false,
      tokenLogoWidth: 32,
      hiddenUnderline: true,
      onBlur: handleRangeInputBlur(inputSlug)
    }));
  }, [formik, handleInputChange, handleRangeInputBlur, t, tokensList, priceRangeDecimals]);

  const backHref = `${FULL_PATH_PREFIX}/${poolStore.poolId?.toFixed()}`;
  const bottomError =
    getFormikError(formik, CreatePositionInput.MIN_PRICE) ?? getFormikError(formik, CreatePositionInput.MAX_PRICE);
  const disabled = formik.isSubmitting || isExist(bottomError);
  const warningMessage =
    tezosTokenIsIncluded([tokenX, tokenY]) && !isExist(bottomError)
      ? t('liquidity|v3PositionWithTezCreationWarning')
      : null;

  return {
    bottomError,
    disabled,
    loading: formik.isSubmitting,
    onSubmit: formik.handleSubmit,
    isFullRangePosition: formik.values[CreatePositionInput.FULL_RANGE_POSITION],
    onFullRangeSwitcherClick,
    amountInputsProps,
    rangeInputsProps,
    titleText: t('liquidity|createPosition'),
    backHref,
    warningMessage
  };
};
