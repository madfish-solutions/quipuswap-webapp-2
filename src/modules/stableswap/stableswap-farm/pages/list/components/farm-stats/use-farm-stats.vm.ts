import { useTranslation } from '@translation';

import { useStableFarmListStore } from '../../../../../hooks';

export const useFarmStatsViewModel = () => {
  const { t } = useTranslation();
  const stableFarmListStore = useStableFarmListStore();

  const label = t('stableswap|totalValueLocked');

  return {
    label,

    tvl: stableFarmListStore.stats?.totalTvlInUsd.toString() ?? null
  };
};
