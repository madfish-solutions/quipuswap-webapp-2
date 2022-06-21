import { useCallback, useMemo } from 'react';

import { BigNumber } from 'bignumber.js';

import { DEFAULT_TOKEN } from '@config/tokens';
import { fromDecimals, isEmptyArray, isNull, multipliedIfPossible } from '@shared/helpers';
import { useTranslation } from '@translation';

import { useStableFarmHarvest, useStableFarmItemStore } from '../../../hooks';
import { StableFarmRewardDetailsParams } from '../stablefarm-reward-details/types';

export const useStableFarmRewardInfoViewModel = () => {
  const { t } = useTranslation();
  const { item, userInfo } = useStableFarmItemStore();
  const { harvest } = useStableFarmHarvest();

  const quipuExchangeRates = item?.stakedTokenExchangeRate ?? null;
  const tokensInfo = item?.tokensInfo ?? null;

  const hadleHarvest = useCallback(async () => await harvest(), [harvest]);

  const shares = userInfo ? fromDecimals(userInfo.yourDeposit, DEFAULT_TOKEN) : null;
  const sharesDollarEquivalent = multipliedIfPossible(quipuExchangeRates, shares);

  const rawData: Array<StableFarmRewardDetailsParams> = useMemo(() => {
    const helperArray: Array<StableFarmRewardDetailsParams> = [];
    if (isNull(userInfo) || isNull(tokensInfo)) {
      return [];
    }

    userInfo.yourReward?.forEach((value, key) => {
      if (value.isGreaterThan('0')) {
        const tokenInfo = tokensInfo[key.toNumber()];
        const { token, exchangeRate } = tokenInfo;
        const amount = fromDecimals(value, token);
        helperArray.push({
          claimable: {
            amount,
            dollarEquivalent: amount.multipliedBy(exchangeRate)
          },
          token
        });
      }
    });

    return helperArray;
  }, [tokensInfo, userInfo]);

  const claimablePendingRewards = useMemo(() => {
    return rawData
      .map(({ claimable }) => claimable.dollarEquivalent)
      .reduce((acc, curr) => acc.plus(curr), new BigNumber('0'));
  }, [rawData]);

  const buttonText = t('stableswap|Harvest');
  //TODO: tooltip text
  const rewardTooltip = undefined;
  const yourShareName = t('farm|Your Share');
  //TODO: tooltip text
  const yourShareTooltip = t('farm|yourShareTooltip');

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
