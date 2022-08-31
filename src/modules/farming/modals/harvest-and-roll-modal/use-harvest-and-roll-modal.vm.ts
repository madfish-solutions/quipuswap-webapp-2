import { useState } from 'react';

import { Nullable } from '@shared/types';
import { useTranslation } from '@translation';

import { CoinSide } from '../../../coinflip';
import { useDoHarvestAll, useFarmingListStore, useHarvestAndRollStore } from '../../hooks';

export const useHarvestAndRollModalViewModel = () => {
  const { t } = useTranslation(['common', 'farm']);

  const farmingListStore = useFarmingListStore();
  const { claimablePendingRewards, claimablePendingRewardsInUsd } = farmingListStore;

  const harvestAndRollStore = useHarvestAndRollStore();
  const { doHarvestAll } = useDoHarvestAll();

  const isLoading = false;

  const [coinSide, setCoinSide] = useState<Nullable<CoinSide>>(null);
  const [coinSideError, setCoinSideError] = useState<Nullable<string>>(null);
  const onCoinSideSelect = (_coinSide: CoinSide) => {
    setCoinSide(coinSide === _coinSide ? null : _coinSide);
    setCoinSideError(null);
  };

  const onClose = () => {
    harvestAndRollStore.close();
  };

  const onHarvestAllClick = async () => {
    await doHarvestAll();
    onClose();
  };

  const onFlipClick = async () => {
    setCoinSideError('Coin Side is required');
    // onClose();
  };

  return {
    claimablePendingRewards,
    claimablePendingRewardsInUsd,

    isLoading,
    coinSide,
    coinSideError,
    onCoinSideSelect,

    onClose,
    onHarvestAllClick,
    onFlipClick,

    texts: {
      harvestOrRoll: t('farm|harvestOrRoll')
    }
  };
};
