import { useCallback, useMemo } from 'react';

import { BigNumber } from 'bignumber.js';

import { useStableDividendsHarvestAll, useStableDividendsListStore } from '@modules/stableswap/hooks';
import { isEmptyArray } from '@shared/helpers';
import { useTranslation } from '@translation';

export const useStableDividendsRewardInfoViewModel = () => {
  const { t } = useTranslation();
  const { listWithUserInfo } = useStableDividendsListStore();
  const { harvestAll: harvestAllApi } = useStableDividendsHarvestAll();
  const farmsWithRewars = useMemo(
    () => listWithUserInfo?.filter(({ yourEarnedInUsd }) => yourEarnedInUsd?.isGreaterThan('0')),
    [listWithUserInfo]
  );

  const claimablePendingRewards = useMemo(
    () => farmsWithRewars?.reduce((acc, { yourEarnedInUsd }) => acc.plus(yourEarnedInUsd), new BigNumber('0')) ?? null,
    [farmsWithRewars]
  );

  const harvestAll = useCallback(async () => {
    if (!farmsWithRewars || isEmptyArray(farmsWithRewars)) {
      return;
    }

    await harvestAllApi(farmsWithRewars.map(({ contractAddress }) => contractAddress));
  }, [farmsWithRewars, harvestAllApi]);

  const harvestAllText = t('stableswap|harvestAll');

  return { claimablePendingRewards, harvestAll, harvestAllText };
};
