import { useTokensBalancesOnly } from '@shared/hooks';

import { extractTokens } from '../helpers';
import { StableswapItem } from '../types';

export const useStableswapTokensBalances = (item: Nullable<StableswapItem>) => {
  const tokens = extractTokens(item?.tokensInfo ?? []);

  return useTokensBalancesOnly(tokens);
};
