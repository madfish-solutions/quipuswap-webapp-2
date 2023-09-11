import { useEffect, useMemo } from 'react';

import BigNumber from 'bignumber.js';

import { ZERO_AMOUNT_BN } from '@config/constants';
import {
  useGetLiquidityV3ItemWithPositions,
  useLiquidityV3ItemTokens,
  useLiquidityV3PoolStore
} from '@modules/liquidity/hooks';
import { useReady } from '@providers/use-dapp';
import { getInvertedValue, getTokenDecimals, isExist, stringToBigNumber } from '@shared/helpers';
import { useTokensWithBalances } from '@shared/hooks';
import { useTranslation } from '@translation';

import { FULL_PATH_PREFIX } from './constants';
import {
  useBottomMessages,
  useCreatePositionFormik,
  useCurrentTick,
  useAmountInputsProps,
  useInputsHandlers,
  useInitialPriceRange,
  useShouldShowTokenXToYPrice,
  useRangeInputsProps,
  useToPriceRangeInputValue
} from './hooks';
import { CreatePositionInput } from './types/create-position-form';
import { useGetLiquidityV3ItemBalances } from '../../hooks/loaders/use-get-liquidity-v3-item-balances';

const MIN_PRICE_RANGE_DECIMALS = 6;
const NO_EFFECT_MULTIPLIER = 1;

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
  const shouldShowTokenXToYPrice = useShouldShowTokenXToYPrice();
  const priceRangeDecimals = Math.max(
    getTokenDecimals(shouldShowTokenXToYPrice ? tokenX : tokenY),
    MIN_PRICE_RANGE_DECIMALS
  );
  const toPriceRangeInputValue = useToPriceRangeInputValue(priceRangeDecimals);

  const { minPrice: initialMinPrice, maxPrice: initialMaxPrice } = useInitialPriceRange(priceRangeDecimals);

  useEffect(() => {
    if (dAppReady) {
      void getLiquidityV3ItemBalances();
      void getLiquidityV3ItemWithPositions();
    }
  }, [dAppReady, getLiquidityV3ItemBalances, getLiquidityV3ItemWithPositions]);

  const formik = useCreatePositionFormik(initialMinPrice, initialMaxPrice, tokensWithBalances);
  const isFullRangePosition = formik.values[CreatePositionInput.FULL_RANGE_POSITION];

  const { handleInputChange, handleRangeInputBlur, onFullRangeSwitcherClick, onPriceRangeChange } = useInputsHandlers(
    formik,
    priceRangeDecimals,
    initialMinPrice,
    initialMaxPrice
  );

  useEffect(() => {
    const shouldInvertPrices = poolStore.localShouldShowXToYPrice !== shouldShowTokenXToYPrice;
    poolStore.localShouldShowXToYPrice = shouldShowTokenXToYPrice;
    if (shouldInvertPrices && isFullRangePosition) {
      onPriceRangeChange(ZERO_AMOUNT_BN.toString(), toPriceRangeInputValue(new BigNumber(Infinity)));
    } else if (shouldInvertPrices) {
      const shiftPreventionMultiplier = shouldShowTokenXToYPrice
        ? NO_EFFECT_MULTIPLIER + Number.EPSILON
        : NO_EFFECT_MULTIPLIER - Number.EPSILON;
      const currentMinPrice = stringToBigNumber(formik.values[CreatePositionInput.MIN_PRICE]);
      const currentMaxPrice = stringToBigNumber(formik.values[CreatePositionInput.MAX_PRICE]);
      const newMaxPrice = getInvertedValue(currentMinPrice.times(shiftPreventionMultiplier));
      const newMinPrice = getInvertedValue(currentMaxPrice.times(shiftPreventionMultiplier));
      onPriceRangeChange(toPriceRangeInputValue(newMinPrice), toPriceRangeInputValue(newMaxPrice));
    }
  }, [shouldShowTokenXToYPrice, onPriceRangeChange, formik, toPriceRangeInputValue, isFullRangePosition, poolStore]);

  const amountInputsProps = useAmountInputsProps(tokensWithBalances, handleInputChange, currentTick, formik);

  const rangeInputsProps = useRangeInputsProps(
    formik,
    tokensList,
    priceRangeDecimals,
    handleInputChange,
    handleRangeInputBlur
  );

  const { bottomError, warningMessages } = useBottomMessages(formik);
  const backHref = `${FULL_PATH_PREFIX}/${poolStore.poolId?.toFixed()}`;
  const disabled = formik.isSubmitting || isExist(bottomError);

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
    warningMessages
  };
};
