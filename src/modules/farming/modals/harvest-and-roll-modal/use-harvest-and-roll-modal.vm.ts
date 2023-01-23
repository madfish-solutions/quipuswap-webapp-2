import { useEffect } from 'react';

import { BigNumber } from 'bignumber.js';
import { useNavigate } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { useAmplitudeService } from '@shared/hooks';
import { useTranslation } from '@translation';

import { useCoinflipGeneralStats, useCoinflipStore } from '../../../coinflip/hooks';
import { useHarvestAndRoll } from '../../../coinflip/hooks/use-harvest-and-roll';
import { useHarvestAll, useRewards, useHarvestAndRollStore } from '../../hooks';

// eslint-disable-next-line sonarjs/cognitive-complexity
export const useHarvestAndRollModalViewModel = () => {
  const { t } = useTranslation(['common', 'farm']);

  const { getCoinflipGeneralStats } = useCoinflipGeneralStats();

  const { doHarvestAndRoll } = useHarvestAndRoll();

  const navigate = useNavigate();

  const { maxBetSize } = useCoinflipStore();

  const harvestAndRollStore = useHarvestAndRollStore();
  const { opened, coinSide, coinSideError, isLoading, isLoadingHarvest, rewardsInQuipu, rewardsQuipuInUsd } =
    harvestAndRollStore;

  const { rewardsInQuipu: newRewardsInQuipu, rewardsQuipuInUsd: newRewardsQuipuInUsd } = useRewards();

  const { onCoinSideSelect, onClose, harvestAll } = useHarvestAll();

  useEffect(() => {
    (async () => {
      if (!opened) {
        return;
      }
      await getCoinflipGeneralStats();

      harvestAndRollStore.setRewardsInQuipu(newRewardsInQuipu);
      harvestAndRollStore.setRewardsQuipuInUsd(newRewardsQuipuInUsd);
    })();
  }, [opened, getCoinflipGeneralStats, harvestAndRollStore, newRewardsInQuipu, newRewardsQuipuInUsd]);

  const { log } = useAmplitudeService();

  const betSize = maxBetSize && rewardsInQuipu ? BigNumber.min(maxBetSize, rewardsInQuipu) : rewardsInQuipu;
  const isMaxBetSize = maxBetSize && betSize?.isEqualTo(maxBetSize);
  const betSizeUsd = isMaxBetSize ? null : rewardsQuipuInUsd;
  const message = isMaxBetSize ? t('farm|maximumAllowableBid') : null;

  const onHarvestAndRollClick = async () => {
    const logData = {
      coinSide,
      claimablePendingRewards: rewardsInQuipu?.toFixed(),
      claimablePendingRewardsInUsd: rewardsQuipuInUsd?.toFixed(),
      betSize: betSize?.toFixed()
    };

    log('HARVEST_AND_ROLL_FLIP_CLICK', logData);

    if (!betSize) {
      throw new Error('BeiSize of Quipu rewards are not defined');
    }

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

  const onHarvestAllClick = async () => harvestAll(true);

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
      harvestOrRoll: t('farm|harvestOrRoll'),
      harvestAndRoll: t('farm|harvestAndRoll'),
      harvestOrRollDescription: t('farm|harvestOrRollDescription'),
      justHarvest: t('farm|JustHarvest')
    }
  };
};
