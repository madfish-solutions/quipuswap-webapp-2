import { useTranslation } from '@translation';

import { useStableDividendsListStore } from '../../../../../hooks';

export const useStableDividendsStatsViewModel = () => {
  const { t } = useTranslation();
  const { stats } = useStableDividendsListStore();

  const label = t('stableswap|totalValueLocked');

  return {
    label,

    tvl: stats?.totalTvlInUsd.toString() ?? null
  };
};
