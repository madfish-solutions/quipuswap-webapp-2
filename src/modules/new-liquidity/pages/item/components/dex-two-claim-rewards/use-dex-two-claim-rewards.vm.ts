import { useCallback, useMemo, useState } from 'react';

import { TEZOS_TOKEN } from '@config/tokens';
import { useNewLiquidityItemStore } from '@modules/new-liquidity/hooks';
import { useNewExchangeRates } from '@providers/use-new-exchange-rate';
import { getTokenSlug, isExist, multipliedIfPossible } from '@shared/helpers';
import { useTokenBalance } from '@shared/hooks';

import { useClaimRewards } from './use-claim-rewards';
import { useNewLiquidityRewards } from './use-new-liquidity-rewards';

export const useDexTwoClaimRewardsFromViewModel = () => {
  const balance = useTokenBalance(TEZOS_TOKEN);
  const { item } = useNewLiquidityItemStore();
  const exchangeRate = useNewExchangeRates();
  const { claim } = useClaimRewards();
  const { rewards } = useNewLiquidityRewards();

  const [submitting, setSubmitting] = useState(false);

  const doClaim = useCallback(async () => {
    setSubmitting(true);
    await claim();
    setSubmitting(false);
  }, [claim]);

  const preParams = useMemo(
    () => ({
      rewardValue: '',
      balance,
      doClaim,
      disabled: !isExist(balance) || !isExist(rewards),
      loading: submitting,
      rewardDollarEquivalent: null
    }),
    [balance, doClaim, rewards, submitting]
  );

  if (isExist(item)) {
    const tokenSlug = getTokenSlug(TEZOS_TOKEN);
    const tokenExchangeRate = exchangeRate[tokenSlug];

    return {
      ...preParams,
      rewardDollarEquivalent: multipliedIfPossible(tokenExchangeRate, rewards),
      rewardValue: rewards?.toFixed() ?? null
    };
  }

  return preParams;
};
