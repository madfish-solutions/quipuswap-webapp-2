import { useTokensBalances } from '@shared/hooks';

import { extractTokens } from '../helpers';
import { StableswapItem } from '../types';

export const useTokensBalancesArray = (item: Nullable<StableswapItem>) => {
  const tokens = extractTokens(item?.tokensInfo ?? []);

  const tokensAndBalances = useTokensBalances(tokens);

  return tokensAndBalances.map(tokenAndBalance => tokenAndBalance.balance ?? null);
};
