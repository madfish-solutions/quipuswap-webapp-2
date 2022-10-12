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

  if (isExist(item)) {
    const tokenSlug = getTokenSlug(TEZOS_TOKEN);
    const tokenExchangeRate = exchangeRate[tokenSlug];

    return {
      balance,
      rewardDollarEquivalent: multipliedIfPossible(tokenExchangeRate, rewards),
      doClaim: claim,
      rewardValue: rewards?.toFixed() ?? null
    };
  }

  return {
    rewardValue: '',
    balance,
    doClaim: claim
  };
};
