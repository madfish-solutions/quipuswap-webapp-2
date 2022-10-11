import { useCallback } from 'react';

import BigNumber from 'bignumber.js';

import { TEZOS_TOKEN } from '@config/tokens';
import { useNewLiquidityItemStore } from '@modules/new-liquidity/hooks';
import { useNewExchangeRates } from '@providers/use-new-exchange-rate';
import { getTokenSlug, isNull, multipliedIfPossible } from '@shared/helpers';
import { useTokenBalance } from '@shared/hooks';

export const useDexTwoClaimRewardsFromViewModel = () => {
  const balance = useTokenBalance(TEZOS_TOKEN);
  const { item } = useNewLiquidityItemStore();
  const exchangeRate = useNewExchangeRates();

  const doClaim = useCallback(() => {
    // eslint-disable-next-line no-console
    console.log('doClaim');
  }, []);

  if (!isNull(item)) {
    const tokenSlug = getTokenSlug(TEZOS_TOKEN);
    const tokenExchangeRate = exchangeRate[tokenSlug];

    const rewards = new BigNumber('15');

    return {
      balance,
      rewardDollarEquivalent: multipliedIfPossible(tokenExchangeRate, rewards),
      doClaim,
      rewardValue: rewards.toFixed()
    };
  }

  return {
    rewardValue: '',
    balance,
    doClaim
  };
};
