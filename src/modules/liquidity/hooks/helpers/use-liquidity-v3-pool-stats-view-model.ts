import { useMemo } from 'react';

import { DOLLAR, PERCENT } from '@config/constants';
import { useTranslation } from '@translation';

import { useLiquidityV3PoolStats } from './use-liquidity-v3-pool-stats';

const MAX_SLIDES_TO_SHOW = 4;

export const useLiquidityV3PoolStatsViewModel = () => {
  const { t } = useTranslation();
  const { isExchangeRatesError, poolTvl, tokenYToXCurrentPrice, tokenYToXTokensSymbols, feeBpsPercentage } =
    useLiquidityV3PoolStats();

  const stats = useMemo(
    () => [
      {
        title: t('liquidity|tvl'),
        amount: poolTvl,
        tooltip: t('liquidity|tvlTooltip'),
        currency: DOLLAR,
        isError: isExchangeRatesError
      },
      {
        title: t('liquidity|currentPrice'),
        amount: tokenYToXCurrentPrice,
        tooltip: t('liquidity|currentPriceTooltip'),
        currency: tokenYToXTokensSymbols
      },
      {
        title: t('liquidity|feeRate'),
        amount: feeBpsPercentage,
        tooltip: t('liquidity|feeRateTooltip'),
        currency: PERCENT
      }
    ],
    [t, poolTvl, tokenYToXCurrentPrice, tokenYToXTokensSymbols, feeBpsPercentage, isExchangeRatesError]
  );

  return { stats, slidesToShow: Math.min(stats.length, MAX_SLIDES_TO_SHOW) };
};
