import { useMemo } from 'react';

import { DOLLAR, PERCENT } from '@config/constants';
import { PriceView } from '@modules/liquidity/pages/v3-item-page/components';
import StatsStyles from '@shared/components/top-stats/top-stats.module.scss';
import { useTranslation } from '@translation';

import { useLiquidityV3PoolStats } from './use-liquidity-v3-pool-stats';

const MAX_SLIDES_TO_SHOW = 4;

export const useLiquidityV3PoolStatsViewModel = () => {
  const { t } = useTranslation();
  const { isExchangeRatesError, poolTvl, tokenYToXCurrentPrice, feeBpsPercentage } = useLiquidityV3PoolStats();

  const stats = useMemo(
    () => [
      {
        title: t('liquidity|tvl'),
        amount: poolTvl,
        tooltip: t('liquidity|tvlV3Tooltip'),
        currency: DOLLAR,
        isError: isExchangeRatesError
      },
      {
        title: t('liquidity|currentPrice'),
        amount: undefined,
        tooltip: t('liquidity|currentPriceTooltip'),
        children: <PriceView price={tokenYToXCurrentPrice} textClassName={StatsStyles.currencyAmount} />
      },
      {
        title: t('liquidity|feeRate'),
        amount: feeBpsPercentage,
        tooltip: t('liquidity|feeRateTooltip'),
        currency: PERCENT
      }
    ],
    [t, poolTvl, tokenYToXCurrentPrice, feeBpsPercentage, isExchangeRatesError]
  );

  return { stats, slidesToShow: Math.min(stats.length, MAX_SLIDES_TO_SHOW) };
};
