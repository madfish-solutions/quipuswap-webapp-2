import { useTokensBalancesOnly } from '@shared/hooks';

import { extractTokens } from '../helpers';
import { StableswapItemModel } from '../models';

export const useStableswapTokensBalances = (item: Nullable<StableswapItemModel>) => {
  const tokens = extractTokens(item?.tokensInfo ?? []);

  return useTokensBalancesOnly(tokens);
};
