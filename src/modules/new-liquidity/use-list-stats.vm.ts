import { PERCENT } from '@config/constants';
import { useTranslation } from '@translation';

import { useNewLiquidityStatsStore } from './hooks/store';
import { DEFAULT_DATA } from './store';

export const useListStatsViewModel = () => {
  const newLiquidityStatsStore = useNewLiquidityStatsStore();
  const { t } = useTranslation();

  const { maxApr, totalValueLocked, poolsCount } = newLiquidityStatsStore?.stats ?? DEFAULT_DATA;

  const stats = [
    {
      title: t('newLiquidity|tvl'),
      tooltip: t('newLiquidity|tvlTooltip'),
      amount: totalValueLocked,
      testId: 'statsTVL'
    },
    {
      title: t('newLiquidity|maxApr'),
      tooltip: t('newLiquidity|maxAprTooltip'),
      amount: maxApr,
      currency: PERCENT,
      testId: 'statsMaxAPR'
    },
    {
      title: t('newLiquidity|pools'),
      tooltip: t('newLiquidity|poolsTooltip'),
      amount: poolsCount,
      currency: null,
      testId: 'statsPools'
    }
  ];

  return {
    stats
  };
};
