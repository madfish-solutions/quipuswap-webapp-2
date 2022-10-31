import { useLiquidityListStore } from '@modules/liquidity/hooks';
import { useTranslation } from '@translation';

const MAX_SLIDES_TO_SHOW = 2;

export const useListStatsViewModel = () => {
  const liquidityStatsStore = useLiquidityListStore();
  const { t } = useTranslation();

  const stats = [
    {
      title: t('liquidity|tvl'),
      tooltip: t('liquidity|tvlTooltipStats'),
      amount: liquidityStatsStore?.stats?.totalValueLocked ?? null,
      testId: 'statsTVL'
    },
    {
      title: t('liquidity|pools'),
      tooltip: t('liquidity|poolsTooltip'),
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
