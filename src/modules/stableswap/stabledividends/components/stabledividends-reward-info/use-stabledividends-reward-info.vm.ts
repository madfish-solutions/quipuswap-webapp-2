import { useCallback } from 'react';

import { isEmptyArray, multipliedIfPossible } from '@shared/helpers';
import { useTranslation } from '@translation';

import { useStableDividendsHarvest, useStableDividendsItemStore } from '../../../hooks';
import { useStableDividendsPendingRewards, useStableDividendsStakerBalance } from '../../hooks';

export const useStableDividendsRewardInfoViewModel = () => {
  const { t } = useTranslation();
  const { item } = useStableDividendsItemStore();
  const { harvest } = useStableDividendsHarvest();

  const quipuExchangeRates = item?.stakedTokenExchangeRate ?? null;

  const hadleHarvest = useCallback(async () => await harvest(), [harvest]);

  const shares = useStableDividendsStakerBalance();
  const sharesDollarEquivalent = multipliedIfPossible(quipuExchangeRates, shares);

  const { rawData, claimablePendingRewards } = useStableDividendsPendingRewards();

  const buttonText = t('stableswap|Harvest');
  //TODO: tooltip text
  const rewardTooltip = undefined;
  const yourShareName = t('stableswap|yourShare');
  //TODO: tooltip text
  const yourShareTooltip = t('stableswap|yourShareTooltip');

  return {
    claimablePendingRewards,
    hadleHarvest,

    buttonText,
    rewardTooltip,
    yourShareName,
    yourShareTooltip,

    rawData,
    showDetails: !isEmptyArray(rawData),

    shares,
    sharesDollarEquivalent
  };
};
