import { useLiquidityListStore } from '@modules/liquidity/hooks';
import { useTranslation } from '@translation';

const MAX_SLIDES_TO_SHOW = 2;

export const useListStatsViewModel = () => {
  const newLiquidityStatsStore = useLiquidityListStore();
  const { t } = useTranslation();

  const stats = [
    {
      title: t('newLiquidity|tvl'),
      tooltip: t('newLiquidity|tvlTooltipStats'),
      amount: newLiquidityStatsStore?.stats?.totalValueLocked ?? null,
      testId: 'statsTVL'
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
    slidesToShow: MAX_SLIDES_TO_SHOW
  };
};
