import { useCallback } from 'react';

import { useStableDividendsHarvestAll } from '@modules/stableswap/hooks';
import { useTotalStableDividendsPendingRewards } from '@modules/stableswap/stabledividends/hooks';
import { isEmptyArray } from '@shared/helpers';
import { useTranslation } from '@translation';

export const useStableDividendsRewardInfoViewModel = () => {
  const { t } = useTranslation();
  const { harvestAll: harvestAllApi } = useStableDividendsHarvestAll();
  const { claimablePendingRewards, farmsWithRewards } = useTotalStableDividendsPendingRewards();

  const harvestAll = useCallback(async () => {
    if (!farmsWithRewards || isEmptyArray(farmsWithRewards)) {
      return;
    }

    await harvestAllApi(farmsWithRewards.map(({ contractAddress }) => contractAddress));
  }, [farmsWithRewards, harvestAllApi]);

  const harvestAllText = t('stableswap|harvestAll');

  return { claimablePendingRewards, harvestAll, harvestAllText };
};
