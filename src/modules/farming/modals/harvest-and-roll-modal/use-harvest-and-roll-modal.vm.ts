import { useEffect } from 'react';

import { BigNumber } from 'bignumber.js';
import { useNavigate } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { useAmplitudeService } from '@shared/hooks';
import { useTranslation } from '@translation';

import { CoinSide } from '../../../coinflip';
import { useCoinflipGeneralStats, useCoinflipStore } from '../../../coinflip/hooks';
import { useHarvestAndRoll } from '../../../coinflip/hooks/use-harvest-and-roll.ts';
import { useDoHarvestAll, useFarmingListStore, useHarvestAndRollStore } from '../../hooks';

export const useHarvestAndRollModalViewModel = () => {
  const { t } = useTranslation(['common', 'farm']);

  const { getCoinflipGeneralStats } = useCoinflipGeneralStats();

  useEffect(() => {
    (async () => {
      await getCoinflipGeneralStats();
    })();
  }, [getCoinflipGeneralStats]);

  const { doHarvestAndRoll } = useHarvestAndRoll();

  const navigate = useNavigate();

  const { maxBetSize } = useCoinflipStore();

  const farmingListStore = useFarmingListStore();
  const { claimablePendingRewards, claimablePendingRewardsInUsd } = farmingListStore;

  const harvestAndRollStore = useHarvestAndRollStore();
  const { coinSide, coinSideError, isLoading, isLoadingHarvest } = harvestAndRollStore;

  const { doHarvestAll } = useDoHarvestAll();

  const { log } = useAmplitudeService();

  const betSize = maxBetSize ? BigNumber.min(maxBetSize, claimablePendingRewards) : claimablePendingRewards;
  const isMaxBetSize = maxBetSize && betSize.isEqualTo(maxBetSize);
  const betSizeUsd = isMaxBetSize ? null : claimablePendingRewardsInUsd;
  const message = isMaxBetSize ? 'Maximum allowable bid' : null;

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
      claimablePendingRewardsInUsd: claimablePendingRewardsInUsd?.toFixed(),
      betSize: betSize.toFixed()
    };

    log('HARVEST_AND_ROLL_FLIP_CLICK', logData);

    if (!coinSide) {
      harvestAndRollStore.setCoinSideError('Coin Side is required');

      return;
    }

    harvestAndRollStore.setCoinSideError(null);

    try {
      harvestAndRollStore.startLoading();

      await doHarvestAndRoll(betSize, coinSide);

      log('HARVEST_AND_ROLL_FLIP_SUCCESS', logData);

      navigate(AppRootRoutes.Coinflip);
    } catch (error) {
      log('HARVEST_AND_ROLL_FLIP_FAILED', logData);
    }

    harvestAndRollStore.finishLoading();
    onClose();
  };

  return {
    betSize,
    betSizeUsd,
    message,

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
