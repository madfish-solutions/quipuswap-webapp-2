import { useLiquidityListStore } from '@modules/liquidity/hooks';
import { useTranslation } from '@translation';

const MAX_SLIDES_TO_SHOW = 2;

export const useListStatsViewModel = () => {
  const liquidityStatsStore = useLiquidityListStore();
  const { t } = useTranslation();

  const stats = [
    {
      title: t('newLiquidity|tvl'),
      tooltip: t('newLiquidity|tvlTooltipStats'),
      amount: liquidityStatsStore?.stats?.totalValueLocked ?? null,
      testId: 'statsTVL'
    },
    {
      title: t('newLiquidity|pools'),
      tooltip: t('newLiquidity|poolsTooltip'),
      amount: liquidityStatsStore?.stats?.poolsCount ?? null,
      currency: null,
      testId: 'statsPools'
    }
  ];

  return {
    stats,
    slidesToShow: MAX_SLIDES_TO_SHOW
  };
};
