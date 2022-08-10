import { PERCENT } from '@config/constants';
import { useNewLiquidityListStore } from '@modules/new-liquidity/hooks';
import { useTranslation } from '@translation';

export const useListStatsViewModel = () => {
  const newLiquidityStatsStore = useNewLiquidityListStore();
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
    stats,
    slidesToShow: 3
  };
};
