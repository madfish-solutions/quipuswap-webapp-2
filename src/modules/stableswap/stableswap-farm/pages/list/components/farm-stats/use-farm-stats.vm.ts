import { useTranslation } from '@translation';

import { useStableFarmListStore } from '../../../../../hooks';

export const useFarmStatsViewModel = () => {
  const { t } = useTranslation();
  const { stats } = useStableFarmListStore();

  const label = t('stableswap|totalValueLocked');

  return {
    label,

    tvl: stats?.totalTvlInUsd.toString() ?? null
  };
};
