import { useMemo } from 'react';

import { DOLLAR, PERCENT } from '@config/constants';
import { useTranslation } from '@translation';

import { useLiquidityV3PoolStats } from './use-liquidity-v3-pool-stats';

export const useLiquidityV3PoolStatsViewModel = () => {
  const { t } = useTranslation();
  const { isExchangeRatesError, poolTvl, currentPrice, tokensSymbols, feeBpsPercentage } = useLiquidityV3PoolStats();

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
        amount: currentPrice,
        tooltip: t('liquidity|currentPriceTooltip'),
        currency: tokensSymbols
      },
      {
        title: t('liquidity|feeRate'),
        amount: feeBpsPercentage,
        tooltip: t('liquidity|feeRateTooltip'),
        currency: PERCENT
      }
    ],
    [t, poolTvl, currentPrice, tokensSymbols, feeBpsPercentage, isExchangeRatesError]
  );

  return { stats };
};
