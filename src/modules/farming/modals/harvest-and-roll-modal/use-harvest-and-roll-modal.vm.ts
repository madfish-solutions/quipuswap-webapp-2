import { useAmplitudeService } from '@shared/hooks';
import { useTranslation } from '@translation';

import { CoinSide } from '../../../coinflip';
import { useHarvestAndRoll } from '../../../coinflip/hooks/use-harvest-and-roll.ts';
import { useDoHarvestAll, useFarmingListStore, useHarvestAndRollStore } from '../../hooks';

export const useHarvestAndRollModalViewModel = () => {
  const { t } = useTranslation(['common', 'farm']);

  const { doHarvestAndRoll } = useHarvestAndRoll();

  const farmingListStore = useFarmingListStore();
  const { claimablePendingRewards, claimablePendingRewardsInUsd } = farmingListStore;

  const harvestAndRollStore = useHarvestAndRollStore();
  const { coinSide, coinSideError, isLoading, isLoadingHarvest } = harvestAndRollStore;

  const { doHarvestAll } = useDoHarvestAll();

  const { log } = useAmplitudeService();

  const onCoinSideSelect = (_coinSide: CoinSide) => {
    harvestAndRollStore.setCoinSide(coinSide === _coinSide ? null : _coinSide);
    harvestAndRollStore.setCoinSideError(null);
  };

  const onClose = () => {
    harvestAndRollStore.close();
  };

  const onHarvestAllClick = async () => {
    harvestAndRollStore.startHarvestLoading();
    log('HARVEST_AND_ROLL_HARVEST_ALL_CLICK');

    await doHarvestAll();
    log('HARVEST_AND_ROLL_HARVEST_ALL_SUCCESS');
    harvestAndRollStore.finishHarvestLoading();
    onClose();
  };

  const onHarvestAndRollClick = async () => {
    const logData = {
      coinSide,
      claimablePendingRewards: claimablePendingRewards.toFixed(),
      claimablePendingRewardsInUsd: claimablePendingRewardsInUsd?.toFixed()
    };

    log('HARVEST_AND_ROLL_FLIP_CLICK', logData);

    if (!coinSide) {
      harvestAndRollStore.setCoinSideError('Coin Side is required');

      return;
    }

    harvestAndRollStore.setCoinSideError(null);

    try {
      harvestAndRollStore.startLoading();

      await doHarvestAndRoll(claimablePendingRewards, coinSide);

      log('HARVEST_AND_ROLL_FLIP_SUCCESS', logData);
    } catch (error) {
      log('HARVEST_AND_ROLL_FLIP_FAILED', logData);
    }

    harvestAndRollStore.finishLoading();
    onClose();
  };

  return {
    claimablePendingRewards,
    claimablePendingRewardsInUsd,

    isLoadingHarvest,
    isLoading,
    coinSide,
    coinSideError,
    onCoinSideSelect,

    onClose,
    onHarvestAllClick,
    onHarvestAndRollClick,

    texts: {
      harvestOrRoll: t('farm|harvestOrRoll')
    }
  };
};
