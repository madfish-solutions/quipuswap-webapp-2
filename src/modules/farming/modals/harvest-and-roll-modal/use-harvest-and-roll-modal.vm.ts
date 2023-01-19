import { useEffect } from 'react';

import { BigNumber } from 'bignumber.js';
import { useNavigate } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { QUIPU_TOKEN } from '@config/tokens';
import { shouldHarvestInBatch } from '@modules/farming/helpers';
import { getSumOfNumbers, isQuipuToken } from '@shared/helpers';
import { useAmplitudeService, useTokenAmountInUsd } from '@shared/hooks';
import { Nullable } from '@shared/types';
import { useTranslation } from '@translation';

import { CoinSide, TokenToPlay } from '../../../coinflip';
import { useCoinflipGeneralStats, useCoinflipStore } from '../../../coinflip/hooks';
import { useHarvestAndRoll } from '../../../coinflip/hooks/use-harvest-and-roll';
import { useDoHarvestAll, useRewards, useHarvestAndRollStore } from '../../hooks';

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

  const { getUsd } = useTokenAmountInUsd(QUIPU_TOKEN);
  const { rewards } = useRewards();

  useEffect(() => {
    (async () => {
      if (!opened) {
        return;
      }
      await getCoinflipGeneralStats();

      const quipuRewards = rewards.filter(reward => isQuipuToken(reward.rewardToken) && shouldHarvestInBatch(reward));
      const _rewardsInQuipu = getSumOfNumbers(quipuRewards.map(({ earnBalance }) => earnBalance ?? null));
      const _rewardsQuipuInUsd = getSumOfNumbers(quipuRewards.map(({ earnBalanceUsd }) => earnBalanceUsd ?? null));
      harvestAndRollStore.setRewardsInQuipu(_rewardsInQuipu);
      harvestAndRollStore.setRewardsQuipuInUsd(_rewardsQuipuInUsd);
    })();
  }, [opened, getCoinflipGeneralStats, harvestAndRollStore, getUsd, rewards]);

  const { doHarvestAll } = useDoHarvestAll();
  const coinflipStore = useCoinflipStore();

  const { log } = useAmplitudeService();

  const betSize = maxBetSize && rewardsInQuipu ? BigNumber.min(maxBetSize, rewardsInQuipu) : rewardsInQuipu;
  const isMaxBetSize = maxBetSize && betSize?.isEqualTo(maxBetSize);
  const betSizeUsd = isMaxBetSize ? null : rewardsQuipuInUsd;
  const message = isMaxBetSize ? t('farm|maximumAllowableBid') : null;

  const onCoinSideSelect = (_coinSide: Nullable<CoinSide>) => {
    harvestAndRollStore.setCoinSide(coinSide === _coinSide ? null : _coinSide);
    harvestAndRollStore.setCoinSideError(null);
  };

  const onClose = () => {
    onCoinSideSelect(null);
    harvestAndRollStore.close();
  };

  const onHarvestAllClick = async () => {
    harvestAndRollStore.startHarvestLoading();
    coinflipStore.setPendingGameTokenToPlay(TokenToPlay.Quipu);
    log('HARVEST_AND_ROLL_HARVEST_ALL_CLICK');

    await doHarvestAll();
    log('HARVEST_AND_ROLL_HARVEST_ALL_SUCCESS');
    harvestAndRollStore.finishHarvestLoading();
    onClose();
  };

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
