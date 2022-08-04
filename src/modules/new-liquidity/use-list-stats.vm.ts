import { PERCENT } from '@config/constants';
import { useTranslation } from '@translation';

import { useNewLiquidityStatsStore } from './hooks/store';

export const useListStatsViewModel = () => {
  const newLiquidityStatsStore = useNewLiquidityStatsStore();
  const { t } = useTranslation();

  const stats = [
    {
      title: t('newLiquidity|tvl'),
      tooltip: t('newLiquidity|tvlTooltip'),
      amount: newLiquidityStatsStore?.stats?.totalValueLocked ?? null,
      testId: 'statsTVL'
    },
    {
      title: t('newLiquidity|maxApr'),
      tooltip: t('newLiquidity|maxAprTooltip'),
      amount: newLiquidityStatsStore?.stats?.maxApr ?? null,
      currency: PERCENT,
      testId: 'statsMaxAPR'
    },
    {
      title: t('newLiquidity|pools'),
      tooltip: t('newLiquidity|poolsTooltip'),
      amount: newLiquidityStatsStore?.stats?.poolsCount ?? null,
      currency: null,
      testId: 'statsPools'
    }
  ];

  return {
    stats
  };
};
