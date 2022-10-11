import { useCallback } from 'react';

import { TEZOS_TOKEN } from '@config/tokens';
import { useNewLiquidityItemStore } from '@modules/new-liquidity/hooks';
import { useNewExchangeRates } from '@providers/use-new-exchange-rate';
import { getTokenSlug, isNull, multipliedIfPossible } from '@shared/helpers';
import { useTokenBalance } from '@shared/hooks';

import { useClaimRewards } from './use-claim-rewards';
import { useNewLiquidityRewards } from './use-new-liquidity-rewards';

export const useDexTwoClaimRewardsFromViewModel = () => {
  const balance = useTokenBalance(TEZOS_TOKEN);
  const { item } = useNewLiquidityItemStore();
  const exchangeRate = useNewExchangeRates();
  const { claim } = useClaimRewards();
  const { rewards } = useNewLiquidityRewards();

  const doClaim = useCallback(async () => {
    await claim();
  }, [claim]);

  if (!isNull(item)) {
    const tokenSlug = getTokenSlug(TEZOS_TOKEN);
    const tokenExchangeRate = exchangeRate[tokenSlug];

    return {
      balance,
      rewardDollarEquivalent: multipliedIfPossible(tokenExchangeRate, rewards),
      doClaim,
      rewardValue: rewards?.toFixed() ?? 'wait'
    };
  }

  return {
    rewardValue: '',
    balance,
    doClaim
  };
};
