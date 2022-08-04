import { PERCENT } from '@config/constants';
import { useTranslation } from '@translation';

import { useNewLiquidityStore } from './hooks/store';

const DEFAULT_DATA = {
  totalValueLocked: null,
  maxApr: null,
  poolsCount: null
};

export const useListStatsViewModel = () => {
  const newLiquidityStore = useNewLiquidityStore();
  const { t } = useTranslation();

  const { maxApr, totalValueLocked, poolsCount } = newLiquidityStore?.stats ?? DEFAULT_DATA;

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
